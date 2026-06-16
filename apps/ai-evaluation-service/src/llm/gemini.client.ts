// =============================================================================
// AI Evaluation Service - Google Gemini LLM Client
// =============================================================================

import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "node:fs";

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

/**
 * Strip a leading/trailing markdown code fence (```json ... ``` or ``` ... ```)
 * that Gemini sometimes wraps JSON in despite responseMimeType: application/json.
 */
function stripCodeFences(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```[a-zA-Z0-9]*\s*/, "").replace(/\s*```$/, "").trim();
  }
  return s;
}

/**
 * Escape raw control characters (U+0000–U+001F) that appear INSIDE string
 * literals. Gemini routinely emits literal newlines/tabs inside long-form string
 * values, which a spec-compliant JSON.parse rejects even though the object is
 * otherwise complete — the #1 cause of "valid-looking but unparseable" output.
 */
function escapeControlCharsInStrings(s: string): string {
  let out = "";
  let inStr = false;
  let escaped = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        out += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        out += ch;
        inStr = false;
        continue;
      }
      const code = s.charCodeAt(i);
      if (code < 0x20) {
        out +=
          ch === "\n" ? "\\n"
          : ch === "\r" ? "\\r"
          : ch === "\t" ? "\\t"
          : "\\u" + code.toString(16).padStart(4, "0");
        continue;
      }
      out += ch;
    } else {
      if (ch === '"') inStr = true;
      out += ch;
    }
  }
  return out;
}

/**
 * Robust JSON extraction from an LLM response. Repairs the failure modes Gemini
 * exhibits on long-form output — markdown fences, stray prose around the object,
 * literal control chars inside strings, trailing commas, and truncation (unclosed
 * braces/strings) — each of which makes a structurally-complete object throw on a
 * plain JSON.parse and silently fall back. Tries progressively more forgiving
 * repairs, then throws if nothing parses (preserving the throw-on-bad-JSON
 * contract that raw JSON.parse callers relied on).
 */
export function extractJson<T = any>(raw: string): T {
  if (!raw || !raw.trim()) throw new Error("extractJson: empty LLM response");
  let s = stripCodeFences(raw);

  // Slice to the outermost { } or [ ] so leading/trailing prose is dropped.
  const firstObj = s.indexOf("{");
  const firstArr = s.indexOf("[");
  let start: number;
  if (firstObj >= 0 && firstArr >= 0) start = Math.min(firstObj, firstArr);
  else start = Math.max(firstObj, firstArr);
  const end = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]")) + 1;
  if (start >= 0 && end > start) s = s.slice(start, end);

  // 1) plain parse
  try {
    return JSON.parse(s) as T;
  } catch {
    /* fall through to repair */
  }

  // 2) escape literal control chars inside strings + strip trailing commas
  let repaired = escapeControlCharsInStrings(s).replace(/,(\s*[}\]])/g, "$1");
  try {
    return JSON.parse(repaired) as T;
  } catch {
    /* fall through to truncation recovery */
  }

  // 3) truncation recovery — close any unclosed string/braces/brackets.
  const opens: string[] = [];
  let inString = false;
  let escape = false;
  for (const ch of repaired) {
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{" || ch === "[") opens.push(ch);
    else if (ch === "}" || ch === "]") opens.pop();
  }
  if (inString) repaired += '"';
  if (opens.length > 0) {
    // Drop a trailing partial element (everything after the last comma) before
    // closing, so we don't leave a dangling key/half-written value.
    const lastComma = repaired.lastIndexOf(",");
    const lastOpen = Math.max(repaired.lastIndexOf("{"), repaired.lastIndexOf("["));
    if (lastComma > lastOpen) repaired = repaired.slice(0, lastComma);
    for (let i = opens.length - 1; i >= 0; i--) {
      repaired += opens[i] === "{" ? "}" : "]";
    }
  }
  return JSON.parse(repaired) as T; // throws if still bad — preserves contract
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
  // Vertex AI client (Gemini billed to the $300 GCP credit). Tried BEFORE the
  // AI Studio keys when configured — it has Pro quota the free keys lack and
  // sidesteps their rate-limits / ToS bans. null when Vertex isn't configured.
  private vertexClient: GoogleGenAI | null;
  private model: string;
  private proModel: string;
  // Round-robin pointer across the key pool (per process). Lets several free-tier
  // keys share the load; advanced past a key once it responds OK / is exhausted.
  private keyCursor = 0;

  private constructor() {
    const keys = GeminiClient.loadKeys();
    this.vertexClient = GeminiClient.loadVertexClient();
    if (keys.length === 0 && !this.vertexClient) {
      throw new Error(
        "No Gemini provider configured — set VERTEX_CREDENTIALS (a service account with Vertex AI access), or GEMINI_API_KEY_1..12 / GEMINI_API_KEYS"
      );
    }
    this.clients = keys.map((apiKey) => new GoogleGenAI({ apiKey }));
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    this.proModel = process.env.GEMINI_PRO_MODEL || "gemini-2.5-pro";
    console.log(`🤖 [Gemini] ${this.clients.length} AI Studio key(s) loaded for rotation`);
    console.log(`🤖 [Gemini] Vertex AI: ${this.vertexClient ? "ENABLED (tried first)" : "disabled"}`);
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
   * GEMINI_API_KEY_1..12 slots first, then the comma-separated GEMINI_API_KEYS
   * (or the single legacy GEMINI_API_KEY). Mirrors the rag-service convention.
   */
  private static loadKeys(): string[] {
    const numbered = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
      (i) => process.env[`GEMINI_API_KEY_${i}`] ?? ""
    );
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
   * Build a Vertex AI client (Gemini on Google Cloud, billed to the $300 credit)
   * when VERTEX_CREDENTIALS (a service-account JSON) is set. Auth goes through ADC
   * — we point GOOGLE_APPLICATION_CREDENTIALS at the key so the SDK picks it up
   * (this service has no other use for that var). The project comes from
   * VERTEX_PROJECT, else the JSON's project_id. Returns null (→ API-keys-only) when
   * not configured or on any init failure; set GEMINI_USE_VERTEX=false to disable.
   */
  private static loadVertexClient(): GoogleGenAI | null {
    if ((process.env.GEMINI_USE_VERTEX ?? "true").toLowerCase() === "false") return null;
    const credPath = (process.env.VERTEX_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS || "").trim();
    if (!credPath) return null;

    let project = (process.env.VERTEX_PROJECT || "").trim();
    if (!project) {
      try {
        project = (JSON.parse(readFileSync(credPath, "utf-8")).project_id || "").trim();
      } catch (e) {
        console.warn(`⚠️ [Gemini/Vertex] could not read project_id from ${credPath}: ${e}`);
      }
    }
    if (!project) {
      console.warn("⚠️ [Gemini/Vertex] no project id (set VERTEX_PROJECT) — using API keys only");
      return null;
    }

    const location = (process.env.VERTEX_LOCATION || "us-central1").trim();
    try {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath; // ADC for the SDK
      const client = new GoogleGenAI({ vertexai: true, project, location });
      console.log(`🤖 [Gemini/Vertex] project=${project}, location=${location}, key=${credPath}`);
      return client;
    } catch (e) {
      console.warn(`⚠️ [Gemini/Vertex] init failed: ${e} — using API keys only`);
      return null;
    }
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
    const start = n > 0 ? this.keyCursor % n : 0;
    let lastError: any = null;

    for (let m = 0; m < models.length; m++) {
      const model = models[m];
      const isFallback = m > 0;

      // Vertex AI first (when configured): it has the Pro quota the free AI Studio
      // keys lack and avoids their rate-limits / bans. Any failure falls through
      // to the key rotation below for this same model.
      if (this.vertexClient) {
        try {
          const response = await this.vertexClient.models.generateContent({
            model,
            contents: request.contents,
            config: request.config,
          });
          const content = response.text;
          if (content) {
            console.log(`✅ [Gemini/Vertex] ${model} responded (${label})`);
            return content;
          }
          console.warn(`⚠️ [Gemini/Vertex] ${model} returned empty (${label}) — trying API keys`);
        } catch (error: any) {
          lastError = error;
          const rate = isRateLimitError(error);
          console.warn(`⚠️ [Gemini/Vertex] ${model} ${rate ? "rate-limited" : "errored"} (${label}) — trying API keys`);
        }
      }

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
    const { maxTokens = 30000, temperature = 0.3, useProModel = false } = options || {};
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
    const { maxTokens = 30000, temperature = 0.3, useProModel = false } = options || {};
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
    const { maxTokens = 30000, temperature = 0.5 } = options || {};
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
