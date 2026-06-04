import { IGradingStrategy } from "./grading-strategy.interface.js";

/**
 * Handles: MULTIPLE_CHOICE, TRUE_FALSE_NOT_GIVEN
 *
 * answerData:    { correctOptions: ["A"], isMultiSelect: false }
 * studentAnswer: "A"   (or ["A", "C"] for multi-select)
 */
export class IeltsMultipleChoiceStrategy implements IGradingStrategy {
  evaluate(answerData: any, studentAnswer: any): number {
    if (!answerData?.correctOptions) return 0;

    const correct = answerData.correctOptions as string[];

    if (answerData.isMultiSelect) {
      if (!Array.isArray(studentAnswer)) return 0;
      const correctSet = new Set(correct);
      const studentSet = new Set<string>(studentAnswer);
      if (correctSet.size !== studentSet.size) return 0;
      for (const ans of studentSet) {
        if (!correctSet.has(ans)) return 0;
      }
      return 1;
    } else {
      const studentStr =
        typeof studentAnswer === "string" ? studentAnswer : studentAnswer?.[0];
      return correct.includes(studentStr) ? 1 : 0;
    }
  }
}
