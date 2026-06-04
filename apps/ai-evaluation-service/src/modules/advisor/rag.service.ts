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
   * Generate an embedding vector for a query string.
   * Uses Google text-embedding-004 (768 dimensions) — same API key as Gemini.
   */
  private async embed(text: string): Promise<number[]> {
    // Use Gemini client's embedding method if available, otherwise call REST directly
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("RAG: GEMINI_API_KEY not configured");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`RAG embedding failed: ${response.statusText}`);
    }

    const json = (await response.json()) as { embedding: { values: number[] } };
    return json.embedding.values;
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

      // Build filter clauses
      const skillFilter = skill ? `AND skill = '${skill}'` : "";
      const bandFilter = bandRange ? `AND band_range = '${bandRange}'` : "";

      // Raw SQL for cosine similarity search (pgvector syntax)
      const results = await prisma.$queryRawUnsafe<KnowledgeChunk[]>(`
        SELECT id, content, skill, band_range as "bandRange", source
        FROM ai_evaluation_db.ielts_knowledge_base
        WHERE embedding IS NOT NULL
        ${skillFilter}
        ${bandFilter}
        ORDER BY embedding <=> '${vectorLiteral}'::vector
        LIMIT ${topK}
      `);

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
