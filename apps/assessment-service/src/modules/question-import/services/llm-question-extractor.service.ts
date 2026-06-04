// =============================================================================
// LLM Question Extractor (Groq fallback)
// =============================================================================
// When the deterministic parser is not confident (see confidence.service), this
// service asks Groq to extract MCQ questions as STRUCTURED JSON, validates the
// shape with Zod, and maps it to the same option model the rest of the pipeline
// uses. It is format-agnostic — this is what lifts the parse rate for the long
// tail of teacher-specific layouts.
//
// Guardrails:
//   • Returns null (never throws) on any failure → caller keeps the
//     deterministic result.
//   • Results are cached by SHA-256 content hash to avoid re-billing the same
//     file (e.g. a seller clicking "Parse" twice). In-memory today; swapping in
//     Redis later is a drop-in change.

import { createHash } from "node:crypto";
import { z } from "zod";
import { groqClient } from "../../../llm/groq.client.js";

const LETTERS = ["A", "B", "C", "D"] as const;
type Letter = (typeof LETTERS)[number];

export interface ExtractedOption {
  key: Letter;
  text: string;
}

export interface ExtractedQuestion {
  questionText: string;
  options: ExtractedOption[];
  correctAnswerIndex: number | null;
  explanation: string | null;
}

// ---- LLM output contract -----------------------------------------------------

const LlmQuestionSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().nullable().optional(),
  explanation: z.string().nullable().optional(),
});

const LlmPayloadSchema = z.object({
  questions: z.array(LlmQuestionSchema),
});

const SYSTEM_PROMPT = [
  "You extract multiple-choice questions (MCQ) from quiz/test documents.",
  "The document may be in any language and any layout (Quiz/Question/Câu markers,",
  "inline answers, answer-key tables, etc.).",
  "",
  "Rules:",
  "- Extract EVERY question you find, in document order.",
  "- Preserve the ORIGINAL language and wording. Do NOT translate or rephrase.",
  "- Do NOT invent questions, options, answers, or explanations.",
  "- Each question has 2–4 options. Keep only the answer choices (strip the A./B. labels).",
  "- `correctOptionIndex` is the 0-based index of the correct option, or null if unknown.",
  "- `explanation` is the per-question explanation text if present, else null.",
  "",
  "Return ONLY JSON of the form:",
  '{ "questions": [ { "questionText": string, "options": string[],',
  '  "correctOptionIndex": number|null, "explanation": string|null } ] }',
].join("\n");

// ---- Content-hash cache ------------------------------------------------------

const MAX_CACHE_ENTRIES = 50;
const cache = new Map<string, ExtractedQuestion[]>();

const hashKey = (text: string, model: string): string =>
  createHash("sha256").update(`${model}::${text}`).digest("hex");

const rememberInCache = (key: string, value: ExtractedQuestion[]): void => {
  // Simple bounded FIFO eviction — oldest entry drops first.
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
};

// ---- Mapping (pure, unit-testable) ------------------------------------------

/**
 * Validates a raw JSON string against the LLM contract and maps it to the
 * pipeline's option model. Returns null when the payload is unusable.
 */
export function mapLlmJsonToQuestions(raw: string): ExtractedQuestion[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const result = LlmPayloadSchema.safeParse(parsed);
  if (!result.success) return null;

  const questions: ExtractedQuestion[] = result.data.questions
    .map((q) => {
      // M1 supports 4-option single-answer MCQ — cap and label A–D.
      const options: ExtractedOption[] = q.options
        .slice(0, LETTERS.length)
        .map((text, i) => ({ key: LETTERS[i], text: text.trim() }))
        .filter((o) => o.text.length > 0);

      const idx = q.correctOptionIndex;
      const correctAnswerIndex =
        typeof idx === "number" && idx >= 0 && idx < options.length
          ? idx
          : null;

      return {
        questionText: q.questionText.trim(),
        options,
        correctAnswerIndex,
        explanation: q.explanation?.trim() || null,
      };
    })
    .filter((q) => q.questionText.length > 0 && q.options.length >= 2);

  return questions.length > 0 ? questions : null;
}

// ---- Service -----------------------------------------------------------------

export class LlmQuestionExtractorService {
  /** True when the underlying Groq client has an API key configured. */
  isAvailable(): boolean {
    return groqClient.isConfigured();
  }

  /**
   * Extracts questions from normalised text via Groq. Returns null on any
   * failure so the caller can fall back to the deterministic result.
   */
  async extract(
    normalisedText: string,
    model = "openai/gpt-oss-120b"
  ): Promise<ExtractedQuestion[] | null> {
    // Groq's free (`on_demand`) tier caps tokens-per-minute (TPM) across the
    // WHOLE request — prompt input PLUS the reserved `max_tokens` completion.
    // The client default of 8192 alone exceeds the 8000 TPM ceiling, so we must
    // size the completion budget to what's left after the input or every call
    // 413s with `rate_limit_exceeded`. Estimate ~2.5 chars/token (Vietnamese
    // tokenizes denser than English) and keep a safety margin under 8000.
    const TPM_BUDGET = 7200;
    const MIN_COMPLETION_TOKENS = 1024;
    const CHARS_PER_TOKEN = 2.5;
    const PROMPT_OVERHEAD_TOKENS = 400; // system prompt + chat framing
    const estimatedInputTokens =
      Math.ceil(normalisedText.length / CHARS_PER_TOKEN) + PROMPT_OVERHEAD_TOKENS;
    const maxTokens = Math.max(
      MIN_COMPLETION_TOKENS,
      Math.min(8192, TPM_BUDGET - estimatedInputTokens)
    );

    if (!normalisedText.trim() || !groqClient.isConfigured()) {
      console.warn(
        `[llm-extractor] Skipping LLM: ${
          !normalisedText.trim() ? "empty input text" : "Groq client not configured (no GROQ_API_KEY at construction)"
        }.`
      );
      return null;
    }

    const key = hashKey(normalisedText, model);
    const cached = cache.get(key);
    if (cached) return cached;

    try {
      const raw = await groqClient.completeJson(SYSTEM_PROMPT, normalisedText, {
        model,
        temperature: 0,
        maxTokens,
      });
      const questions = mapLlmJsonToQuestions(raw);
      if (questions) {
        rememberInCache(key, questions);
      } else {
        // DIAGNOSTIC: Groq responded but the payload failed Zod validation /
        // produced no usable questions. Log a preview to inspect the shape.
        console.warn(
          `[llm-extractor] Groq returned a response but it produced no usable questions (model=${model}). Raw preview:`,
          raw.slice(0, 500)
        );
      }
      return questions;
    } catch (error) {
      // DIAGNOSTIC: surface the swallowed error so the fallback failure is
      // visible. The orchestrator still keeps the deterministic result.
      console.error(
        `[llm-extractor] Groq call failed (model=${model}) — keeping deterministic result:`,
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
}

export const llmQuestionExtractorService = new LlmQuestionExtractorService();
