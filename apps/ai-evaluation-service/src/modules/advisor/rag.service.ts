// =============================================================================
// AI Advisor — RAG Service
// Retrieves relevant IELTS knowledge chunks from pgvector for grounding AI.
// =============================================================================

import { databaseService } from "../../services/database.service.js";
import geminiClient from "../../llm/gemini.client.js";

interface KnowledgeChunk {
  id: string;
  content: string;
  skill: string;
  bandRange: string;
  source: string | null;
}

class RagService {
  /**
   * Generate an embedding vector for a query string. Delegates to the shared
   * Gemini client, which embeds via Vertex AI (same service account as chat) and
   * falls back to the AI Studio key pool — no separate embedding API key needed.
   */
  private async embed(text: string): Promise<number[]> {
    return geminiClient.embed(text);
  }

  /**
   * Retrieve the top-K most relevant IELTS knowledge chunks for a given query.
   * Uses cosine similarity via pgvector.
   */
  async retrieve(
    query: string,
    skill?: string,
    bandRange?: string,
    topK = 5
  ): Promise<KnowledgeChunk[]> {
    const prisma = databaseService.getClient();

    try {
      const embedding = await this.embed(query);
      const vectorLiteral = `[${embedding.join(",")}]`;

      // Parameterized query: every caller-influenced value is bound as a $N
      // placeholder, never string-interpolated, so `skill`/`bandRange` can't break
      // out of the SQL. The query SHAPE is assembled from constants only; the bound
      // params (passed as the trailing args to $queryRawUnsafe) carry all data.
      const params: unknown[] = [];
      const conditions: string[] = ["embedding IS NOT NULL"];

      if (skill) {
        params.push(skill);
        conditions.push(`skill = $${params.length}`);
      }
      if (bandRange) {
        params.push(bandRange);
        conditions.push(`band_range = $${params.length}`);
      }

      params.push(vectorLiteral);
      const vectorParam = `$${params.length}`;

      // Clamp topK to a sane integer for LIMIT (defense-in-depth, even though it's
      // not caller-controlled today).
      params.push(Math.max(1, Math.min(50, Math.floor(topK) || 5)));
      const limitParam = `$${params.length}`;

      // Raw SQL for cosine similarity search (pgvector syntax). Column/schema names
      // are static; only $N placeholders vary.
      const sql = `
        SELECT id, content, skill, band_range as "bandRange", source
        FROM ai_evaluation_db.ielts_knowledge_base
        WHERE ${conditions.join(" AND ")}
        ORDER BY embedding OPERATOR(public.<=>) ${vectorParam}::public.vector
        LIMIT ${limitParam}
      `;

      const results = await prisma.$queryRawUnsafe<KnowledgeChunk[]>(sql, ...params);
      return results;
    } catch (error) {
      // RAG failure is non-fatal — return empty (AI will use general knowledge)
      console.error("[RAG] Retrieval failed, continuing without context:", error);
      return [];
    }
  }

  /**
   * Format retrieved chunks into a context string for the AI prompt
   */
  formatContext(chunks: KnowledgeChunk[]): string {
    if (chunks.length === 0) {
      return "No specific IELTS reference material available for this query.";
    }

    return chunks
      .map(
        (chunk, i) =>
          `[Reference ${i + 1}] (Skill: ${chunk.skill}, Band: ${chunk.bandRange}${chunk.source ? `, Source: ${chunk.source}` : ""})\n${chunk.content}`
      )
      .join("\n\n");
  }
}

export const ragService = new RagService();
