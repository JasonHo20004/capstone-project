import { IGradingStrategy } from "./grading-strategy.interface.js";

/**
 * Expected answerData format:
 * { correctOption: "C" }
 * 
 * Expected studentAnswer format:
 * "C"
 */
export class ToeicSingleChoiceStrategy implements IGradingStrategy {
  evaluate(answerData: any, studentAnswer: any): number {
    if (!answerData || !answerData.correctOption) return 0;
    
    // In TOEIC, parts 1, 2, 3, 4, 5, 7 are simple single-choice selections (A, B, C, D)
    const correct = String(answerData.correctOption).trim().toUpperCase();
    const submitted = String(studentAnswer || "").trim().toUpperCase();

    return correct === submitted ? 1 : 0;
  }
}
