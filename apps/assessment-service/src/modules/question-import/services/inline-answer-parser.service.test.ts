// =============================================================================
// InlineAnswerParserService — Unit Tests
// =============================================================================
import { describe, it, expect } from "vitest";
import { InlineAnswerParserService } from "./inline-answer-parser.service.js";

const parser = new InlineAnswerParserService();

describe("InlineAnswerParserService", () => {
  it("extracts an inline 'Correct answer: C' and strips it from the body", () => {
    const block = [
      "IELTS Listening gồm bao nhiêu phần?",
      "A. 2 phần",
      "B. 3 phần",
      "C. 4 phần",
      "D. 5 phần",
      "Correct answer: C",
      "Explanation: IELTS Listening có 4 phần.",
    ].join("\n");

    const result = parser.parse(block);

    expect(result.correctLetter).toBe("C");
    expect(result.explanation).toBe("IELTS Listening có 4 phần.");
    expect(result.body).not.toContain("Correct answer");
    expect(result.body).not.toContain("Explanation");
    expect(result.body).toContain("D. 5 phần");
  });

  it("supports the Vietnamese 'Đáp án' label", () => {
    const block = ["Câu hỏi?", "A. x", "B. y", "Đáp án: B"].join("\n");
    const result = parser.parse(block);
    expect(result.correctLetter).toBe("B");
  });

  it("supports parenthesised and trailing-period answer formats", () => {
    expect(parser.parse("Q?\nA. x\nAnswer (D).").correctLetter).toBe("D");
    expect(parser.parse("Q?\nA. x\nCorrect answer is A").correctLetter).toBe("A");
  });

  it("does NOT treat a question line as an answer", () => {
    const block = "Answer the following questions about X\nA. yes\nB. no";
    const result = parser.parse(block);
    expect(result.correctLetter).toBeNull();
    expect(result.body).toContain("Answer the following questions");
  });

  it("captures a multi-line explanation", () => {
    const block = [
      "Q?",
      "A. x",
      "Correct answer: A",
      "Explanation: line one",
      "line two continues",
    ].join("\n");
    const result = parser.parse(block);
    expect(result.explanation).toBe("line one\nline two continues");
  });

  it("returns nulls when no answer/explanation present", () => {
    const result = parser.parse("Q?\nA. x\nB. y");
    expect(result.correctLetter).toBeNull();
    expect(result.explanation).toBeNull();
    expect(result.body).toContain("A. x");
  });
});
