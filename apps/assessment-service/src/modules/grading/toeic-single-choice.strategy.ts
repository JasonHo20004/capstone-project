import { IGradingStrategy } from "./grading-strategy.interface.js";

/**
 * Handles: TOEIC_SINGLE_CHOICE (Parts 1, 2, 3, 4, 5, 7)
 *
 * answerData:    { correctOption: "C" }
 * studentAnswer: "C"
 */
export class ToeicSingleChoiceStrategy implements IGradingStrategy {
  evaluate(answerData: any, studentAnswer: any): number {
    if (!answerData?.correctOption) return 0;
    const correct = String(answerData.correctOption).trim().toUpperCase();
    const submitted = String(studentAnswer || "").trim().toUpperCase();
    return correct === submitted ? 1 : 0;
  }
}
