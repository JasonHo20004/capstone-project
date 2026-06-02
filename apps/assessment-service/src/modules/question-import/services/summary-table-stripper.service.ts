// =============================================================================
// Summary-Table Stripper
// =============================================================================
// DOCX/PDF quizzes often end with a redundant answer-summary grid that, when
// flattened to text, becomes a run of bare tokens:
//
//   Quiz   Answer   Quiz   Answer   Quiz   Answer
//   1      C        6      B        11     B
//   2      C        7      B        12     B
//   …
//
// The answers are already captured inline per question, so this grid is noise —
// and worse, it gets appended to the LAST parsed question's block. This service
// detects such a trailing grid and removes it (along with any short footer note
// after it) so it never pollutes the final question.

// A bare header cell: "Quiz", "Answer", "Câu", "No", "STT", "Key"…
const HEADER_TOKEN_RE =
  /^(?:quiz|question|c[âa]u|no\.?|stt|key|answers?|[đĐ]áp\s*án)$/i;

// A bare data cell: a 1–3 digit number or a single A–D letter.
const CELL_TOKEN_RE = /^(?:\d{1,3}|[A-D])\.?$/i;

const MIN_CELL_TOKENS = 4;
const MIN_MATCH_RATIO = 0.6;

const normalizeToken = (line: string): string =>
  line.trim().replace(/[:：]\s*$/, "");

export class SummaryTableStripperService {
  /**
   * Returns the text with a trailing answer-summary grid removed. If no grid is
   * detected, the input is returned unchanged.
   */
  strip(text: string): string {
    if (!text) return text;

    const lines = text.split("\n");

    for (let start = 0; start < lines.length; start++) {
      const token = normalizeToken(lines[start]);
      if (!HEADER_TOKEN_RE.test(token)) continue;

      // Examine everything from this header token to end-of-text.
      const rest = lines.slice(start);
      const nonEmpty = rest
        .map(normalizeToken)
        .filter((l) => l.length > 0);
      if (nonEmpty.length === 0) continue;

      let cellCount = 0;
      let matchCount = 0;
      for (const l of nonEmpty) {
        const isHeader = HEADER_TOKEN_RE.test(l);
        const isCell = CELL_TOKEN_RE.test(l);
        if (isCell) cellCount += 1;
        if (isHeader || isCell) matchCount += 1;
      }

      const ratio = matchCount / nonEmpty.length;
      if (cellCount >= MIN_CELL_TOKENS && ratio >= MIN_MATCH_RATIO) {
        return lines.slice(0, start).join("\n").trim();
      }
    }

    return text;
  }
}

export const summaryTableStripperService = new SummaryTableStripperService();
