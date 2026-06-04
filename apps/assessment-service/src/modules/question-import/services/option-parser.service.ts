// =============================================================================
// Option Parser
// =============================================================================
// Given the text inside a single question block (everything between two
// question markers), extract the A/B/C/D option texts. Handles three layouts:
//   • Inline:    `A. for B. to C. of D. with`
//   • Multiline: each option on its own line
//   • Wrapped:   option text spans several lines
//
// Critical: only treat A/B/C/D as option markers when they sit at the boundary
// between options. We use a regex with whitespace + letter + `.` lookahead so
// occurrences like `Section A.` inside prose are NOT split.

export interface ParsedOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

const OPTION_LETTER_RE = /(^|\s)([A-D])\.\s/g;

const LETTERS: Array<ParsedOption["key"]> = ["A", "B", "C", "D"];

export class OptionParserService {
  /**
   * @returns Options array (may have <4 if the source was malformed) and the
   *          question-body text that comes before the first option marker.
   */
  parse(blockText: string): {
    options: ParsedOption[];
    questionBody: string;
  } {
    if (!blockText) return { options: [], questionBody: "" };

    // Find all option marker positions using boundary-aware regex.
    const markers: Array<{ key: ParsedOption["key"]; start: number; end: number }> = [];
    let m: RegExpExecArray | null;
    OPTION_LETTER_RE.lastIndex = 0;
    while ((m = OPTION_LETTER_RE.exec(blockText)) !== null) {
      const letter = m[2] as ParsedOption["key"];
      // The marker `<space>X. ` — text starts after the trailing space.
      const markerStart = m.index + (m[1] ? m[1].length : 0);
      const textStart = m.index + m[0].length;
      markers.push({ key: letter, start: markerStart, end: textStart });
    }

    if (markers.length === 0) {
      return { options: [], questionBody: blockText.trim() };
    }

    // Filter markers so we keep only the canonical first sequence A→B→C→D.
    // This guards against random `A.` occurring inside an option's text.
    const sequence: typeof markers = [];
    let nextLetterIdx = 0;
    for (const marker of markers) {
      if (LETTERS[nextLetterIdx] && marker.key === LETTERS[nextLetterIdx]) {
        sequence.push(marker);
        nextLetterIdx += 1;
      }
      if (nextLetterIdx >= LETTERS.length) break;
    }

    if (sequence.length === 0) {
      return { options: [], questionBody: blockText.trim() };
    }

    const questionBody = blockText.slice(0, sequence[0].start).trim();
    const options: ParsedOption[] = sequence.map((marker, idx) => {
      const next = sequence[idx + 1];
      const endPos = next ? next.start : blockText.length;
      const text = blockText.slice(marker.end, endPos).replace(/\s+/g, " ").trim();
      return { key: marker.key, text };
    });

    return { options, questionBody };
  }
}

export const optionParserService = new OptionParserService();
