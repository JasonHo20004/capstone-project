// =============================================================================
// Question Parser
// =============================================================================
// Splits normalised text into question blocks keyed by their numeric marker.
// Each block contains the text between `Question N:` and the next marker.

const PRIMARY_MARKER_RE = /^(?:Question|Quiz|Câu)\s+(\d+)([A-Za-z]?)\s*[:.\)]/i;
// Phụ: `1.` / `1)` at start of line — only used when no primary markers found.
const FALLBACK_MARKER_RE = /^(\d+)\s*[.\)]\s+/;

export interface QuestionBlock {
  questionNumber: number;
  /** Text following the marker on the marker line, plus any continuation lines. */
  blockText: string;
  /** Warnings about marker quirks (e.g. `Question 5r:`). */
  warnings: string[];
}

export class QuestionParserService {
  /**
   * Splits text into blocks. Returns ordered blocks plus any unparsed leading
   * text (used for `unparsedText` debugging).
   */
  parse(text: string): { blocks: QuestionBlock[]; unparsedText: string } {
    if (!text) return { blocks: [], unparsedText: "" };

    const lines = text.split("\n");
    type Match = {
      lineIdx: number;
      questionNumber: number;
      rest: string;
      warnings: string[];
    };
    const matches: Match[] = [];

    const collect = (regex: RegExp, isPrimary: boolean) => {
      const found: Match[] = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const m = line.match(regex);
        if (!m) continue;
        const numStr = m[1];
        const suffix = isPrimary ? m[2] || "" : "";
        const num = parseInt(numStr, 10);
        if (!Number.isFinite(num)) continue;
        const rest = line.slice(m[0].length).trim();
        const warnings: string[] = [];
        if (suffix) {
          warnings.push(
            `Unexpected question marker format: Question ${numStr}${suffix}`
          );
        }
        found.push({ lineIdx: i, questionNumber: num, rest, warnings });
      }
      return found;
    };

    let primary = collect(PRIMARY_MARKER_RE, true);
    let usedFallback = false;
    if (primary.length === 0) {
      primary = collect(FALLBACK_MARKER_RE, false);
      usedFallback = primary.length > 0;
    }

    if (primary.length === 0) {
      return { blocks: [], unparsedText: text };
    }

    primary.sort((a, b) => a.lineIdx - b.lineIdx);
    const blocks: QuestionBlock[] = [];
    for (let i = 0; i < primary.length; i++) {
      const cur = primary[i];
      const nextLine = i + 1 < primary.length ? primary[i + 1].lineIdx : lines.length;
      const between = lines.slice(cur.lineIdx + 1, nextLine).join("\n").trim();
      const combined = [cur.rest, between].filter(Boolean).join("\n");
      blocks.push({
        questionNumber: cur.questionNumber,
        blockText: combined,
        warnings: cur.warnings,
      });
    }

    const unparsedText = lines.slice(0, primary[0].lineIdx).join("\n").trim();
    if (usedFallback) {
      blocks.forEach((b) =>
        b.warnings.push("Parsed using fallback marker pattern (1./1))")
      );
    }
    return { blocks, unparsedText };
  }
}

export const questionParserService = new QuestionParserService();
