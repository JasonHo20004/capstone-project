// =============================================================================
// Text Normalization Service
// =============================================================================
// Cleans raw text extracted from PDF/DOCX so the question parser can work with
// a predictable shape: consistent line endings, canonical markers, and merged
// soft-wrapped lines. Option lines and question markers are preserved.

import {
  ANSWER_LINE_RE,
  EXPLANATION_LINE_RE,
} from "./inline-answer-parser.service.js";

const QUESTION_MARKER_RE = /^(?:Question|Quiz|Câu)\s+\d+/i;
const QUESTION_SHORTHAND_RE = /^Q\s*\d+\s*[:.\)]/i;
const OPTION_MARKER_RE = /^[A-D][.\)]\s+/;
const ANSWER_SECTION_RE =
  /^(?:answer\s*key|answers|correct\s*answers|key|đáp\s*án)\s*[:]?\s*$/i;

const looksLikeBoundary = (line: string): boolean => {
  if (!line) return true;
  return (
    QUESTION_MARKER_RE.test(line) ||
    QUESTION_SHORTHAND_RE.test(line) ||
    OPTION_MARKER_RE.test(line) ||
    ANSWER_SECTION_RE.test(line) ||
    // Inline per-question answer/explanation lines must stay on their own line
    // so the inline-answer parser can extract them (don't glue onto option D).
    ANSWER_LINE_RE.test(line) ||
    EXPLANATION_LINE_RE.test(line) ||
    /^\d+\s*[.\)\-:]\s*[A-D]/.test(line) // answer key entries like "1. A"
  );
};

export class TextNormalizationService {
  normalize(rawText: string): string {
    if (!rawText) return "";

    // 1) Normalise line endings + non-breaking spaces.
    let text = rawText
      .replace(/\r\n?/g, "\n")
      .replace(/ /g, " ")
      .replace(/\t/g, " ");

    // 2) Canonical question markers.
    // `Q1:` / `Q1.` → `Question 1:`
    text = text.replace(/^Q\s*(\d+)[A-Za-z]?\s*[:.\)]/gim, "Question $1:");
    // `Câu 1:` → `Question 1:`
    text = text.replace(/^Câu\s+(\d+)[A-Za-z]?\s*[:.\)]/gim, "Question $1:");
    // `Quiz 1.` / `Quiz 1:` / `Quiz 1)` → `Question 1:`
    text = text.replace(/^Quiz\s+(\d+)[A-Za-z]?\s*[:.\)]/gim, "Question $1:");

    // 3) Canonical option markers: `A)` → `A.`
    text = text.replace(/^([A-D])\)\s+/gim, "$1. ");
    // Inline option markers `A)` → `A.` only when preceded by whitespace.
    text = text.replace(/(\s)([A-D])\)\s+/g, "$1$2. ");

    // 4) Collapse runs of spaces (but keep newlines).
    text = text
      .split("\n")
      .map((line) => line.replace(/[ ]{2,}/g, " ").trimEnd())
      .join("\n");

    // 5) Merge soft-wrapped lines: when a line doesn't start with a boundary
    //    marker (question/option/answer-key) and the previous line is also
    //    not blank, the lines belong together.
    const lines = text.split("\n");
    const merged: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const current = lines[i].trim();
      if (!current) {
        merged.push("");
        continue;
      }
      const prev = merged.length > 0 ? merged[merged.length - 1] : "";
      const shouldMerge =
        prev &&
        !looksLikeBoundary(current) &&
        !looksLikeBoundary(prev) === false &&
        // Only merge into an option/question line; don't keep gluing prose.
        (OPTION_MARKER_RE.test(prev) || QUESTION_MARKER_RE.test(prev));
      if (shouldMerge) {
        merged[merged.length - 1] = `${prev} ${current}`;
      } else {
        merged.push(current);
      }
    }

    // 6) Collapse 3+ blank lines into a single blank.
    return merged.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
}

export const textNormalizationService = new TextNormalizationService();
