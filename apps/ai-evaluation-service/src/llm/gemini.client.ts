// =============================================================================
// AI Evaluation Service - Google Gemini LLM Client
// =============================================================================

import { GoogleGenAI, Type } from "@google/genai";

/**
 * Robust rate-limit / quota detection. The @google/genai SDK is inconsistent
 * about where it surfaces a 429 (sometimes error.status, sometimes error.code,
 * often only in the message), so check all of them. Used to decide when to fall
 * back from the Pro model to Flash.
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

class GeminiClient {
  private static instance: GeminiClient;
  private ai: GoogleGenAI;
  private model: string;
  private proModel: string;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    this.proModel = process.env.GEMINI_PRO_MODEL || "gemini-2.5-pro";
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
   * Text-only chat completion (for Writing evaluation)
   */
  public async chatCompletion(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number; temperature?: number; useProModel?: boolean }
  ): Promise<string> {
    const { maxTokens = 4096, temperature = 0.3, useProModel = false } = options || {};
    const selectedModel = useProModel ? this.proModel : this.model;

    try {
      const response = await this.ai.models.generateContent({
        model: selectedModel,
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
          responseMimeType: "application/json",
        },
      });

      const content = response.text;
      if (!content) {
        throw new Error("Empty response from Gemini");
      }
      return content;
    } catch (error: any) {
      // Auto-fallback: if the pro model is rate-limited / quota-exhausted, retry on flash.
      if (useProModel && isRateLimitError(error)) {
        console.warn(`⚠️ [Gemini] Pro model (${this.proModel}) rate limited, falling back to ${this.model}`);
        const response = await this.ai.models.generateContent({
          model: this.model,
          contents: userMessage,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: maxTokens,
            temperature,
            responseMimeType: "application/json",
          },
        });
        const content = response.text;
        if (!content) throw new Error("Empty response from Gemini (fallback)");
        return content;
      }
      throw error;
    }
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
    const selectedModel = useProModel ? this.proModel : this.model;
    const contentsParts = [
      {
        role: "user" as const,
        parts: [
          { inlineData: { mimeType: audioMimeType, data: audioBase64 } },
          { text: textPrompt },
        ],
      },
    ];

    try { 
      const response = await this.ai.models.generateContent({
        model: selectedModel,
        contents: contentsParts,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
          responseMimeType: "application/json",
        },
      });
      const content = response.text;
      if (!content) throw new Error("Empty response from Gemini (multimodal)");
      return content;
    } catch (error: any) {
      if (useProModel && isRateLimitError(error)) {
        console.warn(`⚠️ [Gemini] Pro model (${this.proModel}) rate limited, falling back to ${this.model} (multimodal)`);
        const response = await this.ai.models.generateContent({
          model: this.model,
          contents: contentsParts,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: maxTokens,
            temperature,
            responseMimeType: "application/json",
          },
        });
        const content = response.text;
        if (!content) throw new Error("Empty response from Gemini (multimodal fallback)");
        return content;
      }
      throw error;
    }
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

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: history,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: maxTokens,
        temperature,
        responseMimeType: "application/json",
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("Empty response from Gemini (conversation)");
    }

    return content;
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

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: maxTokens,
        temperature,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("Empty response from Gemini (text)");
    }

    return content;
  }
}

export const geminiClient = GeminiClient.getInstance();
export default geminiClient;
