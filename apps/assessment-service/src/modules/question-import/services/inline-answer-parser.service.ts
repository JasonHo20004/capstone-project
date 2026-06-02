// =============================================================================
// Inline Answer / Explanation Parser
// =============================================================================
// Many real-world quiz documents put the answer and explanation directly under
// each question instead of in a separate "Answer Key" block, e.g.:
//
//   Quiz 1. IELTS Listening gồm bao nhiêu phần?
//   A. 2 phần
//   B. 3 phần
//   C. 4 phần
//   D. 5 phần
//   Correct answer: C
//   Explanation: IELTS Listening có 4 phần…
//
// This service runs on a single question block and pulls out the inline answer
// letter and explanation, returning the cleaned body (question + options only)
// so the option parser never swallows the answer/explanation lines.

export interface InlineAnswerResult {
  /** Block text with answer/explanation lines removed (question + options). */
  body: string;
  /** Detected correct-answer letter, or null. */
  correctLetter: "A" | "B" | "C" | "D" | null;
  /** Detected explanation text, or null. */
  explanation: string | null;
}

// A line that is ONLY an answer label followed by a single A–D letter.
// The `$` anchor is critical: it prevents a question line such as
// "Answer the following questions" from being mistaken for an answer.
// Exported so the text normalizer can treat these lines as boundaries.
export const ANSWER_LINE_RE =
  /^\s*(?:correct\s*answers?|correct\s*option|right\s*answers?|answers?|key|[đĐ]áp\s*án(?:\s*[đĐ]úng)?)\s*(?:is\b|:|-|=|\.|\))?\s*\(?\s*([A-D])\s*\)?\s*[.)]?\s*$/i;

// A line that starts an explanation; group 1 is any text on the same line.
// Exported so the text normalizer can treat these lines as boundaries.
export const EXPLANATION_LINE_RE =
  /^\s*(?:explanations?|reasons?|giải\s*thích|lý\s*giải|giải\s*[đĐ]áp)\s*(?::|-|=|\.|\))?\s*(.*)$/i;

export class InlineAnswerParserService {
  parse(blockText: string): InlineAnswerResult {
    if (!blockText) return { body: "", correctLetter: null, explanation: null };

    const lines = blockText.split("\n");
    const bodyLines: string[] = [];
    const explanationLines: string[] = [];
    let correctLetter: InlineAnswerResult["correctLetter"] = null;
    let inExplanation = false;

    for (const line of lines) {
      // Once inside an explanation, every following line belongs to it.
      if (inExplanation) {
        explanationLines.push(line.trim());
        continue;
      }

      const expMatch = line.match(EXPLANATION_LINE_RE);
      if (expMatch) {
        inExplanation = true;
        const sameLine = expMatch[1]?.trim();
        if (sameLine) explanationLines.push(sameLine);
        continue;
      }

      const ansMatch = line.match(ANSWER_LINE_RE);
      if (ansMatch) {
        if (!correctLetter) {
          correctLetter = ansMatch[1].toUpperCase() as InlineAnswerResult["correctLetter"];
        }
        continue;
      }

      bodyLines.push(line);
    }

    const explanation = explanationLines.filter(Boolean).join("\n").trim() || null;

    return {
      body: bodyLines.join("\n").trim(),
      correctLetter,
      explanation,
    };
  }
}

export const inlineAnswerParserService = new InlineAnswerParserService();
