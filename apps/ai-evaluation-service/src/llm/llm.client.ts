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
   * Chat completion with JSON mode
   */
  public async chatCompletion(
    systemPrompt: string,
    userMessage: string,
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const { jsonMode = false, maxTokens = 4096, temperature = 0.3 } = options || {};

    const response = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
      throw new Error("Empty response from Groq LLM");
    }

    return content;
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
  }> {
    const transcription = await this.groq.audio.transcriptions.create({
      file: audioFile as any,
      model: "whisper-large-v3",
      response_format: "verbose_json",
      language: "en",
    });

    return {
      transcript: transcription.text,
      duration: (transcription as any).duration ?? 0,
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
