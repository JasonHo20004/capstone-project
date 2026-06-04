// =============================================================================
// AI Evaluation Service - Groq LLM Client
// =============================================================================

import Groq from "groq-sdk";

class LLMClient {
  private static instance: LLMClient;
  private groq: Groq;

  private constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  public static getInstance(): LLMClient {
    if (!LLMClient.instance) {
      LLMClient.instance = new LLMClient();
    }
    return LLMClient.instance;
  }

  /**
   * Chat completion with a specified model (via Groq)
   */
  public async chatCompletion(
    systemPrompt: string,
    userMessage: string,
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number; model?: string }
  ): Promise<string> {
    const { jsonMode = false, maxTokens = 8192, temperature = 0, model = "openai/gpt-oss-120b" } = options || {};

    const response = await this.groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature,
      ...(jsonMode && { response_format: { type: "json_object" } }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(`Empty response from Groq LLM (${model})`);
    }

    return content;
  }

  /**
   * Ensemble completion — runs the same prompt on 2 models in parallel.
   * Returns both raw responses for the caller to merge/average.
   */
  public async ensembleCompletion(
    systemPrompt: string,
    userMessage: string,
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number }
  ): Promise<{ modelA: string; modelB: string }> {
    const models = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"];

    const [responseA, responseB] = await Promise.allSettled([
      this.chatCompletion(systemPrompt, userMessage, { ...options, model: models[0] }),
      this.chatCompletion(systemPrompt, userMessage, { ...options, model: models[1] }),
    ]);

    const resultA = responseA.status === "fulfilled" ? responseA.value : null;
    const resultB = responseB.status === "fulfilled" ? responseB.value : null;

    if (!resultA && !resultB) {
      throw new Error("Both ensemble models failed");
    }

    return {
      modelA: resultA || resultB!,
      modelB: resultB || resultA!,
    };
  }

  /**
   * Fast completion (for real-time writing assistant)
   * Uses a faster/smaller model for low latency
   */
  public async fastCompletion(
    systemPrompt: string,
    userMessage: string
  ): Promise<string> {
    const response = await this.groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1024,
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Groq LLM");
    }

    return content;
  }

  /**
   * Speech-to-Text using Groq's Whisper API
   */
  public async transcribeAudio(audioFile: File | Blob, filename: string): Promise<{
    transcript: string;
    duration: number;
    segments: { start: number; end: number; text: string }[];
  }> {
    const transcription = await this.groq.audio.transcriptions.create({
      file: audioFile as any,
      model: "whisper-large-v3",
      response_format: "verbose_json",
      language: "en",
    });

    // verbose_json includes per-segment timestamps — keep them so the UI can
    // sync the transcript with the audio (click a line → seek to that moment).
    const segments = Array.isArray((transcription as any).segments)
      ? (transcription as any).segments
          .map((s: any) => ({
            start: Number(s.start) || 0,
            end: Number(s.end) || 0,
            text: String(s.text ?? "").trim(),
          }))
          .filter((s: { text: string }) => s.text)
      : [];

    return {
      transcript: transcription.text,
      duration: (transcription as any).duration ?? 0,
      segments,
    };
  }

  /**
   * Get the underlying Groq client for advanced usage
   */
  public getGroqClient(): Groq {
    return this.groq;
  }
}

export const llmClient = LLMClient.getInstance();
export default llmClient;
