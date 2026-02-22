import { IGradingStrategy } from "./grading-strategy.interface.js";

/**
 * Expected answerData format:
 * { correctOptions: ["A", "C"], isMultiSelect: true }
 * 
 * Expected studentAnswer format:
 * ["A", "C"] // or "B" if single select
 */
export class IeltsMultipleChoiceStrategy implements IGradingStrategy {
  evaluate(answerData: any, studentAnswer: any): number {
    if (!answerData || !answerData.correctOptions) return 0;

    const correct = answerData.correctOptions as string[];
    
    if (answerData.isMultiSelect) {
      if (!Array.isArray(studentAnswer)) return 0;
      
      // Check if arrays match exactly regardless of order
      const correctSet = new Set(correct);
      const studentSet = new Set(studentAnswer);
      
      if (correctSet.size !== studentSet.size) return 0;
      
      // Every submitted answer must be in the correct set
      for (const ans of studentSet) {
        if (!correctSet.has(ans)) return 0;
      }
      return 1; // 1 point for getting all multi-select options right
    } else {
      // Single choice
      const studentStr = typeof studentAnswer === 'string' ? studentAnswer : studentAnswer[0];
      return correct.includes(studentStr) ? 1 : 0;
    }
  }
}
