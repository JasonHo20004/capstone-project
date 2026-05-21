// =============================================================================
// Seed Placement Test Question Bank (Gemini-driven)
//
// Usage:
//   npx tsx prisma/seed-placement.ts
//   npx tsx prisma/seed-placement.ts --count 5
//   npx tsx prisma/seed-placement.ts --type reorder --dry-run
//
// Requires: GEMINI_API_KEY in environment (.env loaded automatically by tsx
// if dotenv/config is imported, see below).
// =============================================================================

import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// ─── CLI ─────────────────────────────────────────────────────────────────────

type QuestionType = "fill_blank" | "heading_match" | "reorder" | "listening_mcq";

interface CliFlags {
  count: number;
  dryRun: boolean;
  typeFilter: QuestionType | null;
}

function parseFlags(): CliFlags {
  const args = process.argv.slice(2);
  let count = 3;
  let dryRun = false;
  let typeFilter: QuestionType | null = null;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--count") {
      count = Math.max(1, parseInt(args[++i] ?? "3", 10) || 3);
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a === "--type") {
      const v = args[++i];
      if (v === "fill_blank" || v === "heading_match" || v === "reorder" || v === "listening_mcq") {
        typeFilter = v;
      } else {
        throw new Error(`Invalid --type value: ${v}`);
      }
    }
  }
  return { count, dryRun, typeFilter };
}

// ─── Bucket Definitions ──────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";

interface Bucket {
  type: QuestionType;
  section: 1 | 2 | 3;
  difficulty: Difficulty;
  skill: "Grammar" | "Vocabulary" | null;
  skillTagPrefix: string;
  minCount: number;
  timeLimit: number;
}

const BUCKETS: Bucket[] = [
  // fill_blank — Section 1
  { type: "fill_blank", section: 1, difficulty: "easy", skill: "Grammar", skillTagPrefix: "Grammar", minCount: 6, timeLimit: 30 },
  { type: "fill_blank", section: 1, difficulty: "easy", skill: "Vocabulary", skillTagPrefix: "Vocabulary", minCount: 5, timeLimit: 30 },
  { type: "fill_blank", section: 1, difficulty: "medium", skill: "Grammar", skillTagPrefix: "Grammar", minCount: 6, timeLimit: 30 },
  { type: "fill_blank", section: 1, difficulty: "medium", skill: "Vocabulary", skillTagPrefix: "Vocabulary", minCount: 5, timeLimit: 30 },
  { type: "fill_blank", section: 1, difficulty: "hard", skill: "Grammar", skillTagPrefix: "Grammar", minCount: 3, timeLimit: 30 },
  { type: "fill_blank", section: 1, difficulty: "hard", skill: "Vocabulary", skillTagPrefix: "Vocabulary", minCount: 2, timeLimit: 30 },

  // heading_match — Section 2
  { type: "heading_match", section: 2, difficulty: "medium", skill: null, skillTagPrefix: "Reading — Heading Match", minCount: 5, timeLimit: 90 },

  // reorder — Section 2
  { type: "reorder", section: 2, difficulty: "medium", skill: null, skillTagPrefix: "Reading — Reorder", minCount: 5, timeLimit: 90 },
  { type: "reorder", section: 2, difficulty: "hard", skill: null, skillTagPrefix: "Reading — Reorder", minCount: 1, timeLimit: 90 },

  // listening_mcq — Section 3
  { type: "listening_mcq", section: 3, difficulty: "easy", skill: null, skillTagPrefix: "Listening — Inference", minCount: 5, timeLimit: 60 },
  { type: "listening_mcq", section: 3, difficulty: "medium", skill: null, skillTagPrefix: "Listening — Inference", minCount: 4, timeLimit: 60 },
  { type: "listening_mcq", section: 3, difficulty: "hard", skill: null, skillTagPrefix: "Listening — Inference", minCount: 2, timeLimit: 60 },
];

const CEFR_HINT: Record<Difficulty, string> = {
  easy: "CEFR A1–A2 (Elementary). Common everyday vocabulary, simple tenses, short sentences.",
  medium: "CEFR B1 (Intermediate). Connected discourse, common phrasal verbs, mixed tenses, light idiomatic use.",
  hard: "CEFR B2–C1 (Upper-Intermediate to Advanced). Complex sentences, advanced collocations, conditional/inversion structures, nuanced vocabulary.",
};

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const MCQItemSchema = z.object({
  context: z.string().min(1).optional().nullable(),
  instruction: z.string().min(1),
  prompt: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  correctAnswer: z.enum(["A", "B", "C"]),
  skillTag: z.string().min(1),
});

const HeadingMatchItemSchema = MCQItemSchema.extend({
  passage: z.string().min(40),
});

const ReorderItemSchema = z.object({
  instruction: z.string().min(1),
  prompt: z.string().min(1),
  fixedFragment: z.string().min(1),
  fragmentA: z.string().min(1),
  fragmentB: z.string().min(1),
  fragmentC: z.string().min(1),
  correctOrder: z.string().regex(/^[ABC]{3}$/),
  skillTag: z.string().min(1),
});

const ListeningItemSchema = MCQItemSchema.extend({
  audioContext: z.string().min(1),
  audioScript: z.string().min(40),
});

type MCQItem = z.infer<typeof MCQItemSchema>;
type HeadingMatchItem = z.infer<typeof HeadingMatchItemSchema>;
type ReorderItem = z.infer<typeof ReorderItemSchema>;
type ListeningItem = z.infer<typeof ListeningItemSchema>;

// ─── Gemini Response Schemas (JSON Schema for Gemini structured output) ──────

const STR = { type: Type.STRING };
const REQ_STR = { type: Type.STRING, minLength: "1" };

function arrayOf(itemProps: Record<string, unknown>, required: string[]) {
  return {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: itemProps,
      required,
    },
  };
}

const FILL_BLANK_SCHEMA = arrayOf(
  {
    context: STR,
    instruction: REQ_STR,
    prompt: REQ_STR,
    optionA: REQ_STR,
    optionB: REQ_STR,
    optionC: REQ_STR,
    correctAnswer: { type: Type.STRING, enum: ["A", "B", "C"] },
    skillTag: REQ_STR,
  },
  ["instruction", "prompt", "optionA", "optionB", "optionC", "correctAnswer", "skillTag"],
);

const HEADING_MATCH_SCHEMA = arrayOf(
  {
    instruction: REQ_STR,
    passage: REQ_STR,
    prompt: REQ_STR,
    optionA: REQ_STR,
    optionB: REQ_STR,
    optionC: REQ_STR,
    correctAnswer: { type: Type.STRING, enum: ["A", "B", "C"] },
    skillTag: REQ_STR,
  },
  ["instruction", "passage", "prompt", "optionA", "optionB", "optionC", "correctAnswer", "skillTag"],
);

const REORDER_SCHEMA = arrayOf(
  {
    instruction: REQ_STR,
    prompt: REQ_STR,
    fixedFragment: REQ_STR,
    fragmentA: REQ_STR,
    fragmentB: REQ_STR,
    fragmentC: REQ_STR,
    correctOrder: { type: Type.STRING, minLength: "3", maxLength: "3" },
    skillTag: REQ_STR,
  },
  ["instruction", "prompt", "fixedFragment", "fragmentA", "fragmentB", "fragmentC", "correctOrder", "skillTag"],
);

const LISTENING_SCHEMA = arrayOf(
  {
    audioContext: REQ_STR,
    audioScript: REQ_STR,
    instruction: REQ_STR,
    prompt: REQ_STR,
    optionA: REQ_STR,
    optionB: REQ_STR,
    optionC: REQ_STR,
    correctAnswer: { type: Type.STRING, enum: ["A", "B", "C"] },
    skillTag: REQ_STR,
  },
  ["audioContext", "audioScript", "instruction", "prompt", "optionA", "optionB", "optionC", "correctAnswer", "skillTag"],
);

// ─── Prompt Builders ─────────────────────────────────────────────────────────

const DISTRACTOR_RULE =
  "All three options MUST be plausible. No throwaway distractors (no random unrelated words, no obvious grammar mistakes). Wrong options should reflect realistic learner errors at this CEFR level.";

function buildFillBlankPrompt(bucket: Bucket, n: number): string {
  const isGrammar = bucket.skill === "Grammar";
  const focus = isGrammar
    ? "grammar point (e.g. Past Simple vs Present Perfect, Conditionals, Articles, Modals, Reported Speech, Inversion)."
    : "vocabulary point (e.g. Phrasal Verbs, Collocations, Word Choice, Idioms, Connectors).";

  return `Generate ${n} English placement-test "fill in the blank" multiple-choice questions.

Difficulty: ${bucket.difficulty} — ${CEFR_HINT[bucket.difficulty]}
Focus: ${focus}

Rules:
- "context" is an optional 1–2 sentence situation (e.g. "At the airport check-in." or null).
- "prompt" is ONE sentence containing exactly one blank written as "___".
- "instruction" should be a short user-facing instruction like "Choose the word or phrase that best completes the sentence."
- "optionA/B/C" are the three choices that fill the blank.
- ${DISTRACTOR_RULE}
- "skillTag" must look like: "${bucket.skillTagPrefix} — <specific skill>" (e.g. "${bucket.skillTagPrefix} — Past Perfect" or "${bucket.skillTagPrefix} — Phrasal Verbs (look)").
- Vary the skillTag across the batch — do not repeat the same sub-skill more than twice.
- Balance the correct answer across A/B/C roughly evenly.

Return a JSON array of ${n} items.`;
}

function buildHeadingMatchPrompt(n: number): string {
  return `Generate ${n} English placement-test "heading match" reading questions.

Difficulty: medium — ${CEFR_HINT.medium}

Rules:
- "passage" is a 60–90 word coherent paragraph on a varied topic (technology, environment, culture, work, travel, etc.).
- "prompt" is "Choose the most suitable heading for the passage above."
- "instruction" is a short user-facing instruction.
- "optionA/B/C" are three candidate headings (short, 4–10 words each).
- ${DISTRACTOR_RULE} Distractor headings should match a partial theme of the passage but miss the main idea.
- "skillTag" should look like "Reading — Heading Match (<topic>)" (e.g. "Reading — Heading Match (Technology)").
- Vary topics across the batch.
- Balance the correct answer across A/B/C.

Return a JSON array of ${n} items.`;
}

function buildReorderPrompt(bucket: Bucket, n: number): string {
  return `Generate ${n} English placement-test "reorder" reading questions.

Difficulty: ${bucket.difficulty} — ${CEFR_HINT[bucket.difficulty]}

Each item is a short coherent paragraph (4 sentences total) split into:
- "fixedFragment": the OPENING sentence (shown pinned, not draggable).
- "fragmentA", "fragmentB", "fragmentC": the remaining 3 sentences, presented in SHUFFLED order with labels A, B, C.
- "correctOrder": a 3-letter string (permutation of "ABC") giving the correct order of fragments AFTER the fixed opening.
  Example: if the correct flow is fixedFragment -> fragmentB -> fragmentC -> fragmentA, then correctOrder = "BCA".

Rules:
- The 4 sentences together must form a logical paragraph with clear discourse cues (pronouns, connectors, sequence words).
- Make ordering non-trivial: at this difficulty, learners should rely on cohesion devices, not just topic.
- "prompt" is "Reorder the fragments to form a coherent paragraph."
- "instruction" is a short user-facing instruction.
- "skillTag" looks like "Reading — Reorder (<topic>)".
- Vary topics across the batch. Balance correct orders across the 6 permutations.

Return a JSON array of ${n} items.`;
}

function buildListeningPrompt(bucket: Bucket, n: number): string {
  return `Generate ${n} English placement-test "listening MCQ" questions.

Difficulty: ${bucket.difficulty} — ${CEFR_HINT[bucket.difficulty]}

Each item is based on a short audio dialogue (the audioScript). The audio will be played to the test taker via TTS.

Rules:
- "audioContext" is a one-line scene description (e.g. "A customer ordering food at a café.", "Two colleagues discussing a project deadline.").
- "audioScript" is a natural-sounding dialogue between 2+ speakers, 4–8 turns total. Use speaker labels like "Man:" / "Woman:" / "A:" / "B:". Include realistic distracting details (numbers, names, alternative options that get dismissed).
- The answer must be inferable from the dialogue but expressed INDIRECTLY (paraphrase, implication, tone). Avoid verbatim copy of the option text.
- "prompt" is the question stem (e.g. "What does the man want to do?", "What is the woman's main concern?").
- "instruction" is a short user-facing instruction.
- "optionA/B/C" are three plausible answers. ${DISTRACTOR_RULE} Distractors should match details mentioned in the dialogue but not the actual answer (red herrings).
- "skillTag" looks like "Listening — Inference (<scenario>)" or "Listening — Detail (<scenario>)".
- Vary scenarios across the batch. Balance correct answers across A/B/C.

Return a JSON array of ${n} items.`;
}

// ─── Gemini Caller ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT =
  "You are an English language test item writer. You write high-quality CEFR-aligned multiple-choice items with plausible distractors. Output strictly valid JSON matching the requested schema. Do not include explanations outside JSON.";

async function callGemini(
  ai: GoogleGenAI,
  model: string,
  userPrompt: string,
  responseSchema: unknown,
): Promise<unknown> {
  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: responseSchema as never,
    },
  });
  const text = response.text;
  if (!text) throw new Error("Empty Gemini response");
  return JSON.parse(text);
}

// ─── Generation Per Bucket ───────────────────────────────────────────────────

interface BucketResult {
  bucket: Bucket;
  target: number;
  existing: number;
  generated: number;
  inserted: number;
  skipped: number;
  errors: number;
}

async function processBucket(
  ai: GoogleGenAI,
  model: string,
  bucket: Bucket,
  multiplier: number,
  dryRun: boolean,
): Promise<BucketResult> {
  const target = bucket.minCount * multiplier;

  const existing = await prisma.placementQuestion.count({
    where: {
      type: bucket.type,
      section: bucket.section,
      difficulty: bucket.difficulty,
      ...(bucket.skill
        ? { skillTag: { startsWith: bucket.skillTagPrefix } }
        : {}),
      isActive: true,
    },
  });

  const label = `${bucket.type}/${bucket.difficulty}${bucket.skill ? `/${bucket.skill}` : ""}`;
  console.log(`\n▶ ${label}: existing=${existing}, target=${target}`);

  if (existing >= target) {
    console.log(`  ✓ Already satisfied. Skipping generation.`);
    return { bucket, target, existing, generated: 0, inserted: 0, skipped: 0, errors: 0 };
  }

  const need = target - existing;

  let prompt: string;
  let schema: unknown;
  switch (bucket.type) {
    case "fill_blank":
      prompt = buildFillBlankPrompt(bucket, need);
      schema = FILL_BLANK_SCHEMA;
      break;
    case "heading_match":
      prompt = buildHeadingMatchPrompt(need);
      schema = HEADING_MATCH_SCHEMA;
      break;
    case "reorder":
      prompt = buildReorderPrompt(bucket, need);
      schema = REORDER_SCHEMA;
      break;
    case "listening_mcq":
      prompt = buildListeningPrompt(bucket, need);
      schema = LISTENING_SCHEMA;
      break;
  }

  console.log(`  → Calling Gemini for ${need} items...`);
  let raw: unknown;
  try {
    raw = await callGemini(ai, model, prompt, schema);
  } catch (err) {
    console.error(`  ✗ Gemini call failed:`, err instanceof Error ? err.message : err);
    return { bucket, target, existing, generated: 0, inserted: 0, skipped: 0, errors: 1 };
  }

  if (!Array.isArray(raw)) {
    console.error(`  ✗ Gemini returned non-array:`, raw);
    return { bucket, target, existing, generated: 0, inserted: 0, skipped: 0, errors: 1 };
  }

  const result: BucketResult = {
    bucket,
    target,
    existing,
    generated: raw.length,
    inserted: 0,
    skipped: 0,
    errors: 0,
  };

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    try {
      const data = buildPrismaData(bucket, item);
      if (!dryRun) {
        await prisma.placementQuestion.create({ data });
      }
      result.inserted++;
    } catch (err) {
      result.skipped++;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠ skip item #${i}: ${msg.slice(0, 200)}`);
    }
  }

  console.log(`  ✓ Generated=${result.generated}, Inserted=${result.inserted}, Skipped=${result.skipped}${dryRun ? " (dry-run)" : ""}`);
  return result;
}

// ─── Validation + Prisma payload ─────────────────────────────────────────────

interface PlacementCreateData {
  section: number;
  difficulty: string;
  type: string;
  skillTag: string;
  context: string | null;
  instruction: string;
  prompt: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  correctAnswer: string | null;
  passage: string | null;
  fixedFragment: string | null;
  fragmentA: string | null;
  fragmentB: string | null;
  fragmentC: string | null;
  correctOrder: string | null;
  audioContext: string | null;
  audioScript: string | null;
  audioUrl: string | null;
  timeLimit: number;
}

function buildPrismaData(bucket: Bucket, raw: unknown): PlacementCreateData {
  const base = {
    section: bucket.section,
    difficulty: bucket.difficulty,
    type: bucket.type,
    timeLimit: bucket.timeLimit,
    context: null,
    optionA: null,
    optionB: null,
    optionC: null,
    correctAnswer: null,
    passage: null,
    fixedFragment: null,
    fragmentA: null,
    fragmentB: null,
    fragmentC: null,
    correctOrder: null,
    audioContext: null,
    audioScript: null,
    audioUrl: null,
  };

  if (bucket.type === "fill_blank") {
    const v: MCQItem = MCQItemSchema.parse(raw);
    if (!/_{2,}|___/.test(v.prompt)) {
      throw new Error("fill_blank prompt must contain a '___' blank");
    }
    return {
      ...base,
      skillTag: v.skillTag,
      instruction: v.instruction,
      prompt: v.prompt,
      context: v.context ?? null,
      optionA: v.optionA,
      optionB: v.optionB,
      optionC: v.optionC,
      correctAnswer: v.correctAnswer,
    };
  }

  if (bucket.type === "heading_match") {
    const v: HeadingMatchItem = HeadingMatchItemSchema.parse(raw);
    return {
      ...base,
      skillTag: v.skillTag,
      instruction: v.instruction,
      prompt: v.prompt,
      passage: v.passage,
      optionA: v.optionA,
      optionB: v.optionB,
      optionC: v.optionC,
      correctAnswer: v.correctAnswer,
    };
  }

  if (bucket.type === "reorder") {
    const v: ReorderItem = ReorderItemSchema.parse(raw);
    return {
      ...base,
      skillTag: v.skillTag,
      instruction: v.instruction,
      prompt: v.prompt,
      fixedFragment: v.fixedFragment,
      fragmentA: v.fragmentA,
      fragmentB: v.fragmentB,
      fragmentC: v.fragmentC,
      correctOrder: v.correctOrder.toUpperCase(),
    };
  }

  // listening_mcq
  const v: ListeningItem = ListeningItemSchema.parse(raw);
  return {
    ...base,
    skillTag: v.skillTag,
    instruction: v.instruction,
    prompt: v.prompt,
    optionA: v.optionA,
    optionB: v.optionB,
    optionC: v.optionC,
    correctAnswer: v.correctAnswer,
    audioContext: v.audioContext,
    audioScript: v.audioScript,
    audioUrl: null,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const flags = parseFlags();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to apps/assessment-service/.env");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const ai = new GoogleGenAI({ apiKey });

  console.log("══════════════════════════════════════════════════════════════");
  console.log(" Placement Test — Question Bank Seeder");
  console.log("══════════════════════════════════════════════════════════════");
  console.log(` Model:      ${model}`);
  console.log(` Multiplier: ×${flags.count}`);
  console.log(` Dry-run:    ${flags.dryRun}`);
  console.log(` Type filter: ${flags.typeFilter ?? "(all)"}`);

  const targets = flags.typeFilter
    ? BUCKETS.filter((b) => b.type === flags.typeFilter)
    : BUCKETS;

  const results: BucketResult[] = [];
  for (const bucket of targets) {
    const r = await processBucket(ai, model, bucket, flags.count, flags.dryRun);
    results.push(r);
  }

  // Summary
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log(" Summary");
  console.log("══════════════════════════════════════════════════════════════");
  const pad = (s: string, n: number) => s.padEnd(n);
  console.log(
    pad("Bucket", 42) +
      pad("Existing", 10) +
      pad("Target", 8) +
      pad("Gen", 6) +
      pad("Ins", 6) +
      pad("Skip", 6) +
      pad("Err", 6),
  );
  console.log("─".repeat(84));
  let totInserted = 0;
  let totSkipped = 0;
  let totErrors = 0;
  for (const r of results) {
    const label = `${r.bucket.type}/${r.bucket.difficulty}${r.bucket.skill ? `/${r.bucket.skill}` : ""}`;
    console.log(
      pad(label, 42) +
        pad(String(r.existing), 10) +
        pad(String(r.target), 8) +
        pad(String(r.generated), 6) +
        pad(String(r.inserted), 6) +
        pad(String(r.skipped), 6) +
        pad(String(r.errors), 6),
    );
    totInserted += r.inserted;
    totSkipped += r.skipped;
    totErrors += r.errors;
  }
  console.log("─".repeat(84));
  console.log(`Total inserted: ${totInserted}, skipped: ${totSkipped}, errors: ${totErrors}`);
  if (flags.dryRun) console.log("(dry-run — no rows written to database)");
}

main()
  .catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
