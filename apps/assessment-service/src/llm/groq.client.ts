// =============================================================================
// Assessment Service — Groq LLM Client
// =============================================================================
// Thin singleton wrapper around groq-sdk, mirroring the pattern used in
// ai-evaluation-service. Used by the question-import LLM fallback. If
// GROQ_API_KEY is absent the client reports `isConfigured() === false` so
// callers can gracefully skip the LLM path instead of throwing at startup.

import Groq from "groq-sdk";

export interface GroqCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Fast + cheap model is the right default for deterministic JSON extraction.
const DEFAULT_MODEL = "openai/gpt-oss-120b";

class GroqClient {
  private static instance: GroqClient;
  private client: Groq | null;

  private constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    this.client = apiKey ? new Groq({ apiKey }) : null;
  }

  public static getInstance(): GroqClient {
    if (!GroqClient.instance) {
      GroqClient.instance = new GroqClient();
    }
    return GroqClient.instance;
  }

  /** True when a GROQ_API_KEY is present and the client is usable. */
  public isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Chat completion forced into JSON-object mode. Returns the raw JSON string;
   * the caller validates the shape (e.g. with Zod).
   */
  public async completeJson(
    systemPrompt: string,
    userMessage: string,
    options?: GroqCompletionOptions
  ): Promise<string> {
    if (!this.client) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const {
      model = DEFAULT_MODEL,
      maxTokens = 8192,
      temperature = 0,
    } = options || {};

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(`Empty response from Groq LLM (${model})`);
    }

    return content;
  }
}

export const groqClient = GroqClient.getInstance();
