// =============================================================================
// Instruction Detector Service
// =============================================================================
// Scans normalised text for section instruction phrases that include an explicit
// question-number range ("from X to Y").  Returns a map of
//   firstQuestionNumber → instructionText
// so the orchestrator can stamp `sectionInstruction` on the first ParsedQuestion
// of each section.  Downstream UI renders the instruction as a sticky header that
// stays visible until a new section begins.
//
// Currently relies on the "from X to Y" range pattern that is common in
// Vietnamese high-school English test formats.  Instruction blocks without an
// explicit range are silently ignored for now.

const INSTRUCTION_KEYWORDS: RegExp[] = [
  /read the following/i,
  /mark the letter [A-D]/i,
  /indicate the (?:best|correct)/i,
  /best arrangement of/i,
  /best answer to each/i,
  /meaningful exchange/i,
  /best fits each/i,
  /best completes each/i,
  /numbered blanks/i,
];

/** "…from 1 to 6", "…from 13 to 17" */
const RANGE_RE = /from\s+(\d+)\s+to\s+(\d+)/i;

/** Maximum characters kept from the raw instruction text. */
const MAX_LEN = 280;

function containsKeyword(text: string): boolean {
  return INSTRUCTION_KEYWORDS.some((re) => re.test(text));
}

/**
 * Given a paragraph (no blank lines), extract only the lines that contain
 * instruction keywords — stripping any trailing passage text.
 */
function extractInstructionLines(para: string): string {
  const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
  const kept: string[] = [];
  for (const line of lines) {
    if (containsKeyword(line)) kept.push(line);
  }
  const joined = kept.join(" ").replace(/\s{2,}/g, " ").trim();
  return joined.length > MAX_LEN ? joined.slice(0, MAX_LEN - 1) + "…" : joined;
}

export interface DetectedInstruction {
  /** Inclusive start of the question range. */
  startsAtQuestion: number;
  /** Inclusive end of the question range. */
  endsAtQuestion: number;
  /** Human-readable instruction text extracted from the document. */
  instructionText: string;
}

export class InstructionDetectorService {
  /**
   * Scans `normalizedText` for instruction+range pairs.
   *
   * @returns Map<questionNumber, instructionText> — only the **first** question
   *   of each detected section has an entry.  Callers should carry the
   *   instruction forward until a new entry is found.
   */
  detect(normalizedText: string): Map<number, string> {
    const map = new Map<number, string>();
    if (!normalizedText) return map;

    // Split into paragraphs (separated by one or more blank lines).
    const paragraphs = normalizedText.split(/\n{2,}/);

    for (const para of paragraphs) {
      if (!containsKeyword(para)) continue;

      const rangeMatch = para.match(RANGE_RE);
      if (!rangeMatch) continue;

      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);

      // Sanity checks: valid positive range, not absurdly long.
      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        start < 1 ||
        end < start ||
        end - start > 99
      ) {
        continue;
      }

      const instructionText = extractInstructionLines(para);
      if (!instructionText) continue;

      // Register only the first question of the range.
      // If two instruction blocks claim the same start number, the first wins.
      if (!map.has(start)) {
        map.set(start, instructionText);
      }
    }

    return map;
  }

  /**
   * Returns all detected instructions as an ordered array (by startsAtQuestion).
   * Convenience wrapper used for debugging / unit tests.
   */
  detectAll(normalizedText: string): DetectedInstruction[] {
    const paragraphs = normalizedText.split(/\n{2,}/);
    const results: DetectedInstruction[] = [];

    for (const para of paragraphs) {
      if (!containsKeyword(para)) continue;

      const rangeMatch = para.match(RANGE_RE);
      if (!rangeMatch) continue;

      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (
        !Number.isFinite(start) || !Number.isFinite(end) ||
        start < 1 || end < start || end - start > 99
      ) continue;

      const instructionText = extractInstructionLines(para);
      if (!instructionText) continue;

      results.push({ startsAtQuestion: start, endsAtQuestion: end, instructionText });
    }

    return results.sort((a, b) => a.startsAtQuestion - b.startsAtQuestion);
  }
}

export const instructionDetectorService = new InstructionDetectorService();
