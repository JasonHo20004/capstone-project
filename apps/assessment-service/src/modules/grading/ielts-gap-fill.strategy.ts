import { IGradingStrategy } from "./grading-strategy.interface.js";

/**
 * Handles: GAP_FILL, MATCHING
 *
 * answerData:    { "1": ["colour", "color"], "2": ["$50"] }
 * studentAnswer: { "1": "colour", "2": "wrong" }
 */
export class IeltsGapFillStrategy implements IGradingStrategy {
  evaluate(answerData: any, studentAnswer: any): number {
    if (!studentAnswer || typeof studentAnswer !== "object") return 0;

    let correctGaps = 0;
    for (const [gapId, acceptableAnswers] of Object.entries(answerData)) {
      const studentResponse = studentAnswer[gapId];
      if (
        studentResponse &&
        Array.isArray(acceptableAnswers) &&
        this.isMatch(studentResponse, acceptableAnswers)
      ) {
        correctGaps++;
      }
    }
    return correctGaps; // Each gap is 1 point
  }

  private isMatch(studentRes: string, acceptable: string[]): boolean {
    const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, " ");
    return acceptable.some((ans) => normalize(ans) === normalize(studentRes));
  }
}
