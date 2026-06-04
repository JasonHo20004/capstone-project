// =============================================================================
// Answer Key Parser
// =============================================================================
// Detects an "Answer Key" block in normalised text and extracts a map of
// question-number → letter(s). Stateless and deterministic.

const SECTION_TITLES = [
  "answer key",
  "answers",
  "correct answers",
  "key",
  "đáp án",
];

const isSectionHeader = (line: string): boolean => {
  const trimmed = line.trim().toLowerCase().replace(/[:：]\s*$/, "");
  return SECTION_TITLES.includes(trimmed);
};

// Single line of an answer key — supports `1. A`, `2) C`, `3 - A`, `4. A,C`,
// `5. A, C`, `6: D`.
const ANSWER_LINE_RE =
  /^(\d+)\s*[.\)\-:]\s*([A-D](?:\s*[,\s]\s*[A-D])*)\s*$/i;

export interface AnswerKeyResult {
  /** Map from question number (as string) → array of letters. */
  answers: Record<string, string[]>;
  /** Range of the input text that was consumed by the answer-key block. */
  blockRange: { start: number; end: number } | null;
}

export class AnswerKeyParserService {
  parse(text: string): AnswerKeyResult {
    if (!text) return { answers: {}, blockRange: null };

    const lines = text.split("\n");
    // Find the first section header.
    let headerIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (isSectionHeader(lines[i])) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) {
      return { answers: {}, blockRange: null };
    }

    const answers: Record<string, string[]> = {};
    let lastConsumed = headerIdx;
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const raw = lines[i].trim();
      if (!raw) {
        // Blank lines inside the block are allowed; keep scanning until we
        // hit something that clearly belongs elsewhere.
        continue;
      }
      // Some answer keys put multiple entries on the same line: "1. A 2. B 3. C"
      const tokens = raw.split(/\s{2,}|\t/).filter(Boolean);
      let matched = false;
      const candidates = tokens.length > 1 ? tokens : [raw];
      for (const token of candidates) {
        const m = token.match(ANSWER_LINE_RE);
        if (!m) continue;
        const num = m[1];
        const letters = m[2]
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((l) => l.toUpperCase());
        if (letters.length > 0) {
          answers[num] = letters;
          matched = true;
        }
      }
      if (matched) {
        lastConsumed = i;
        continue;
      }
      // Stop scanning when we hit a clearly unrelated line.
      break;
    }

    // Compute character offsets so the orchestrator can strip the block from
    // the text before running the question parser.
    const before = lines.slice(0, headerIdx).join("\n");
    const blockText = lines.slice(headerIdx, lastConsumed + 1).join("\n");
    const start = before.length + (headerIdx > 0 ? 1 : 0);
    const end = start + blockText.length;

    return { answers, blockRange: { start, end } };
  }
}

export const answerKeyParserService = new AnswerKeyParserService();
