// =============================================================================
// SummaryTableStripperService — Unit Tests
// =============================================================================
import { describe, it, expect } from "vitest";
import { SummaryTableStripperService } from "./summary-table-stripper.service.js";

const stripper = new SummaryTableStripperService();

describe("SummaryTableStripperService", () => {
  it("strips a trailing Quiz/Answer grid and its footer note", () => {
    const text = [
      "Question 15: Lỗi phổ biến?",
      "A. x",
      "Correct answer: B",
      "",
      "Quiz",
      "Answer",
      "Quiz",
      "Answer",
      "1",
      "C",
      "6",
      "B",
      "2",
      "C",
      "7",
      "B",
      "Gợi ý sử dụng: dùng làm quiz nhanh.",
    ].join("\n");

    const result = stripper.strip(text);

    expect(result).toContain("Question 15");
    expect(result).toContain("Correct answer: B");
    expect(result).not.toContain("Gợi ý sử dụng");
    expect(result.split("\n").filter((l) => l.trim() === "Quiz")).toHaveLength(0);
  });

  it("leaves text without a grid unchanged", () => {
    const text = "Question 1: x\nA. a\nB. b\nCorrect answer: A";
    expect(stripper.strip(text)).toBe(text);
  });

  it("does not strip a normal '1. A' answer-key block", () => {
    const text = "Answer Key:\n1. A\n2. B\n3. C\n4. D";
    expect(stripper.strip(text)).toBe(text);
  });
});
