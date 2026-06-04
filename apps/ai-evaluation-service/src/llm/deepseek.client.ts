// =============================================================================
// AI Evaluation Service - DeepSeek LLM Client
// Uses OpenAI-compatible API with DeepSeek V3
// =============================================================================

import OpenAI from "openai";

class DeepSeekClient {
  private static instance: DeepSeekClient;
  private client: OpenAI;

  private constructor() {
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
  }

  public static getInstance(): DeepSeekClient {
    if (!DeepSeekClient.instance) {
      DeepSeekClient.instance = new DeepSeekClient();
    }
    return DeepSeekClient.instance;
  }

  /**
   * Chat completion with DeepSeek V3
   * DeepSeek V3 is a reasoning model — it follows complex instructions
   * much better than open-source models on Groq.
   */
  public async chatCompletion(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const { maxTokens = 8192, temperature = 0 } = options || {};

    const response = await this.client.chat.completions.create({
      model: "deepseek-chat",
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
      throw new Error("Empty response from DeepSeek");
    }

    return content;
  }
}

export const deepseekClient = DeepSeekClient.getInstance();
export default deepseekClient;
