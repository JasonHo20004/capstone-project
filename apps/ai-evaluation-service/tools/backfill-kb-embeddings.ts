// =============================================================================
// Backfill embeddings for IELTS Knowledge Base rows whose vector is NULL.
//
// Why this exists: migration 20260526071101_y dropped the `embedding` column
// (Prisma drift), discarding every vector while keeping the `content` text. After
// 20260617000000_restore_kb_embedding re-adds the column, all rows have a NULL
// embedding. The fresh seeder (tools/seed-ielts-kb/seed.ts) skips a non-empty
// table, so it can't repair them — this tool re-embeds NULL rows in place.
//
// Run: npx tsx tools/backfill-kb-embeddings.ts
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import geminiClient from "../src/llm/gemini.client.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AI_EVALUATION_DIRECT_URL || process.env.AI_EVALUATION_DATABASE_URL,
    },
  },
});

interface NullRow {
  id: string;
  content: string;
}

async function backfill(): Promise<void> {
  const rows = await prisma.$queryRawUnsafe<NullRow[]>(
    `SELECT id, content
       FROM ai_evaluation_db.ielts_knowledge_base
      WHERE embedding IS NULL
      ORDER BY created_at`
  );

  if (rows.length === 0) {
    console.log("✅ No NULL-embedding rows — knowledge base is fully embedded.");
    return;
  }

  console.log(`\n🔧 Back-filling embeddings for ${rows.length} row(s)...\n`);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const progress = `[${i + 1}/${rows.length}]`;
    try {
      const vector = await geminiClient.embed(row.content);
      const vectorLiteral = `[${vector.join(",")}]`;

      // Bind id + vector as params — never interpolate caller/DB data into SQL.
      await prisma.$executeRawUnsafe(
        `UPDATE ai_evaluation_db.ielts_knowledge_base
            SET embedding = $1::public.vector
          WHERE id = $2::uuid`,
        vectorLiteral,
        row.id
      );

      success++;
      console.log(`✅ ${progress} ${row.content.slice(0, 64)}...`);
    } catch (err) {
      failed++;
      console.error(`❌ ${progress} Failed for ${row.id}: ${err}`);
    }
  }

  console.log(`\n✨ Backfill complete: ${success} succeeded, ${failed} failed.`);
}

backfill()
  .catch((err) => {
    console.error("Backfill aborted:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
