// =============================================================================
// AI Evaluation Service - Google Gemini LLM Client
// =============================================================================

import { GoogleGenAI } from "@google/genai";

/**
 * Robust rate-limit / quota detection. The @google/genai SDK is inconsistent
 * about where it surfaces a 429 (sometimes error.status, sometimes error.code,
 * often only in the message), so check all of them. Used to decide when to
 * rotate to the next key, then fall back from the Pro model to Flash.
 */
function isRateLimitError(error: any): boolean {
  if (!error) return false;
  if (error.status === 429 || error.code === 429) return true;
  const msg = String(error?.message ?? error).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("resource_exhausted") ||
    msg.includes("resource exhausted")
  );
}

export interface ConversationTurn {
  role: "user" | "model";
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
}

interface GenerateRequest {
  contents: any;
  config: Record<string, any>;
}

class GeminiClient {
  private static instance: GeminiClient;
  // One SDK client per API key — @google/genai binds a key at construction, so
  // rotating keys means rotating clients.
  private clients: GoogleGenAI[];
  private model: string;
  private proModel: string;
  // Round-robin pointer across the key pool (per process). Lets several free-tier
  // keys share the load; advanced past a key once it responds OK / is exhausted.
  private keyCursor = 0;

  private constructor() {
    const keys = GeminiClient.loadKeys();
    if (keys.length === 0) {
      throw new Error(
        "No Gemini API key configured — set GEMINI_API_KEY, GEMINI_API_KEYS (comma-separated), or GEMINI_API_KEY_1..6"
      );
    }
    this.clients = keys.map((apiKey) => new GoogleGenAI({ apiKey }));
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    this.proModel = process.env.GEMINI_PRO_MODEL || "gemini-2.5-pro";
    console.log(`🤖 [Gemini] ${this.clients.length} key(s) loaded for rotation`);
    console.log(`🤖 [Gemini] Default model: ${this.model}`);
    console.log(`🤖 [Gemini] Pro model (evaluation): ${this.proModel}`);
  }

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    return GeminiClient.instance;
  }

  /**
   * Build the key pool, de-duplicated and in priority order: the numbered
   * GEMINI_API_KEY_1..6 slots first, then the comma-separated GEMINI_API_KEYS
   * (or the single legacy GEMINI_API_KEY). Mirrors the rag-service convention.
   */
  private static loadKeys(): string[] {
    const numbered = [1, 2, 3, 4, 5, 6].map((i) => process.env[`GEMINI_API_KEY_${i}`] ?? "");
    const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
    const comma = raw ? raw.split(",") : [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const candidate of [...numbered, ...comma]) {
      const key = candidate.trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push(key);
      }
    }
    return out;
  }

  /**
   * Core rotation engine. Tries each model in `models` order; for each model it
   * round-robins through every key in the pool, skipping past a key that is
   * rate-limited or errors. Only when ALL keys are exhausted for a model does it
   * move to the next (fallback) model.
   *
   * So with models=[pro, flash]: every key is tried on Pro first, and Flash is
   * reached only after the whole pool is exhausted on Pro.
   */
  private async generate(models: string[], request: GenerateRequest, label: string): Promise<string> {
    const n = this.clients.length;
    const start = this.keyCursor % n;
    let lastError: any = null;

    for (let m = 0; m < models.length; m++) {
      const model = models[m];
      const isFallback = m > 0;
      for (let offset = 0; offset < n; offset++) {
        const idx = (start + offset) % n;
        try {
          const response = await this.clients[idx].models.generateContent({
            model,
            contents: request.contents,
            config: request.config,
          });
          const content = response.text;
          if (!content) {
            lastError = new Error(`Empty response from Gemini (${label})`);
            console.warn(`⚠️ [Gemini] key ${idx + 1}/${n} on ${model} returned empty (${label}) — trying next key`);
            continue;
          }
          // Success — start the next request at the following key.
          this.keyCursor = (idx + 1) % n;
          if (isFallback || offset > 0) {
            console.log(`✅ [Gemini] key ${idx + 1}/${n} on ${model} responded (${label})`);
          }
          return content;
        } catch (error: any) {
          lastError = error;
          const rate = isRateLimitError(error);
          console.warn(
            `⚠️ [Gemini] key ${idx + 1}/${n} on ${model} ${rate ? "rate-limited" : "errored"} (${label}) — trying next key`
          );
          // Rotate to the next key on any failure; a single bad/exhausted key
          // should never sink the whole request.
        }
      }
      if (m < models.length - 1) {
        console.warn(`⚠️ [Gemini] all ${n} key(s) exhausted on ${model} (${label}) — falling back to ${models[m + 1]}`);
      }
    }

    throw lastError ?? new Error(`All Gemini keys/models exhausted (${label})`);
  }

  /** Models to try, in order: Pro first (then Flash) when useProModel, else just the default. */
  private modelChain(useProModel: boolean): string[] {
    if (useProModel && this.proModel !== this.model) return [this.proModel, this.model];
    return [this.model];
  }

  /**
   * Text-only chat completion (for Writing evaluation)
   */
  public async chatCompletion(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number; temperature?: number; useProModel?: boolean }
  ): Promise<string> {
    const { maxTokens = 4096, temperature = 0.3, useProModel = false } = options || {};
    return this.generate(
      this.modelChain(useProModel),
      {
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
          responseMimeType: "application/json",
        },
      },
      "chat"
    );
  }

  /**
   * Multimodal completion — audio + text (for Speaking evaluation)
   * Sends audio directly to Gemini for transcript + evaluation in one call
   */
  public async multimodalCompletion(
    systemPrompt: string,
    audioBase64: string,
    audioMimeType: string,
    textPrompt: string,
    options?: { maxTokens?: number; temperature?: number; useProModel?: boolean }
  ): Promise<string> {
    const { maxTokens = 4096, temperature = 0.3, useProModel = false } = options || {};
    const contentsParts = [
      {
        role: "user" as const,
        parts: [
          { inlineData: { mimeType: audioMimeType, data: audioBase64 } },
          { text: textPrompt },
        ],
      },
    ];
    return this.generate(
      this.modelChain(useProModel),
      {
        contents: contentsParts,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
          responseMimeType: "application/json",
        },
      },
      "multimodal"
    );
  }

  /**
   * Multi-turn conversation completion (for Interactive Speaking sessions)
   * Maintains conversation history for context-aware follow-up questions
   */
  public async conversationCompletion(
    systemPrompt: string,
    history: ConversationTurn[],
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const { maxTokens = 4096, temperature = 0.5 } = options || {};
    return this.generate(
      [this.model],
      {
        contents: history,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
          responseMimeType: "application/json",
        },
      },
      "conversation"
    );
  }

  /**
   * Simple text generation (no JSON mode, for generating examiner questions as plain text)
   */
  public async generateText(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const { maxTokens = 2048, temperature = 0.7 } = options || {};
    return this.generate(
      [this.model],
      {
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
        },
      },
      "text"
    );
  }
}

export const geminiClient = GeminiClient.getInstance();
export default geminiClient;
