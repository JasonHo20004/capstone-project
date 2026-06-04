// =============================================================================
// Quiz Parsing Pipeline — Integration Test
// =============================================================================
// Reproduces the exact "Quiz N. … Correct answer: X … Explanation: …" document
// that previously parsed to ZERO questions, and asserts the full text pipeline
// (normalize → strip summary grid → answer key → questions → inline answer →
// options) now recovers every question with its answer and explanation.
import { describe, it, expect } from "vitest";
import { textNormalizationService } from "./text-normalization.service.js";
import { summaryTableStripperService } from "./summary-table-stripper.service.js";
import { answerKeyParserService } from "./answer-key-parser.service.js";
import { questionParserService } from "./question-parser.service.js";
import { optionParserService } from "./option-parser.service.js";
import { inlineAnswerParserService } from "./inline-answer-parser.service.js";

const LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

// Trimmed but representative slice of the real document (Quiz 1-3 + summary grid).
const RAW = [
  "Quiz 1. IELTS Listening gồm bao nhiêu phần?",
  "A. 2 phần",
  "B. 3 phần",
  "C. 4 phần",
  "D. 5 phần",
  "Correct answer: C",
  "Explanation: IELTS Listening có 4 phần, độ khó tăng dần từ phần 1 đến phần 4.",
  "",
  "Quiz 2. Tổng số câu hỏi trong bài thi IELTS Listening là bao nhiêu?",
  "A. 20 câu",
  "B. 30 câu",
  "C. 40 câu",
  "D. 50 câu",
  "Correct answer: C",
  "Explanation: Bài thi IELTS Listening có 40 câu hỏi.",
  "",
  "Quiz 3. Kỹ năng quan trọng cần dùng trước khi nghe là gì?",
  "A. Viết đáp án ngay lập tức",
  "B. Đọc câu hỏi và xác định từ khóa",
  "C. Dịch toàn bộ câu hỏi sang tiếng Việt",
  "D. Chỉ nghe mà không cần nhìn đề",
  "Correct answer: B",
  "Explanation: Đọc trước câu hỏi và xác định từ khóa giúp dự đoán thông tin cần nghe.",
  "",
  "Quiz",
  "Answer",
  "Quiz",
  "Answer",
  "1",
  "C",
  "2",
  "C",
  "3",
  "B",
  "Gợi ý sử dụng: Có thể dùng các câu hỏi này làm quiz nhanh.",
].join("\n");

function runPipeline(raw: string) {
  const normalised = summaryTableStripperService.strip(
    textNormalizationService.normalize(raw)
  );
  const answerKey = answerKeyParserService.parse(normalised);
  const textWithoutKey = answerKey.blockRange
    ? (
        normalised.slice(0, answerKey.blockRange.start) +
        normalised.slice(answerKey.blockRange.end)
      ).trim()
    : normalised;
  const { blocks } = questionParserService.parse(textWithoutKey);

  return blocks.map((block) => {
    const inline = inlineAnswerParserService.parse(block.blockText);
    const { options, questionBody } = optionParserService.parse(inline.body);
    const letters = inline.correctLetter
      ? [inline.correctLetter]
      : answerKey.answers[String(block.questionNumber)];
    const correctAnswerIndex =
      letters && letters.length > 0 ? LETTER_TO_INDEX[letters[0]] : null;
    return {
      questionNumber: block.questionNumber,
      questionBody,
      options,
      correctAnswerIndex,
      explanation: inline.explanation,
    };
  });
}

describe("Quiz parsing pipeline (regression for 0-parsed bug)", () => {
  const questions = runPipeline(RAW);

  it("parses every Quiz block", () => {
    expect(questions).toHaveLength(3);
    expect(questions.map((q) => q.questionNumber)).toEqual([1, 2, 3]);
  });

  it("recovers 4 clean options per question (no answer/explanation leakage)", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      const lastOption = q.options[3].text;
      expect(lastOption).not.toContain("Correct answer");
      expect(lastOption).not.toContain("Explanation");
    }
  });

  it("maps inline answers to the correct option index", () => {
    expect(questions[0].correctAnswerIndex).toBe(2); // C
    expect(questions[1].correctAnswerIndex).toBe(2); // C
    expect(questions[2].correctAnswerIndex).toBe(1); // B
  });

  it("captures the explanation for each question", () => {
    expect(questions[0].explanation).toContain("IELTS Listening có 4 phần");
    expect(questions[2].explanation).toContain("xác định từ khóa");
  });

  it("does not bleed the trailing summary grid into the last question", () => {
    const last = questions[2];
    expect(last.questionBody).not.toContain("Gợi ý sử dụng");
    expect(last.explanation).not.toContain("Gợi ý sử dụng");
    expect(last.explanation).not.toMatch(/\bQuiz\b\s*\bAnswer\b/);
  });
});
