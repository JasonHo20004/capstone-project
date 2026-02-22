import { IGradingStrategy } from "./grading-strategy.interface.js";

/**
 * Expected answerData format:
 * { "1": ["colour", "color"], "2": ["$50", "fifty dollars"] }
 * 
 * Expected studentAnswer format:
 * { "1": "colour", "2": "50 dollars" }
 */
export class IeltsGapFillStrategy implements IGradingStrategy {
  evaluate(answerData: any, studentAnswer: any): number {
    if (!studentAnswer || typeof studentAnswer !== "object") return 0;
    
    let totalGaps = 0;
    let correctGaps = 0;

    // Iterate through all gaps defined in the correct answer payload
    for (const [gapId, acceptableAnswers] of Object.entries(answerData)) {
      totalGaps++;
      const studentResponse = studentAnswer[gapId];

      if (
        studentResponse &&
        Array.isArray(acceptableAnswers) &&
        this.isMatch(studentResponse, acceptableAnswers)
      ) {
        correctGaps++;
      }
    }

    // In IELTS, each gap is usually worth 1 point.
    // However, if a single database "Question" record represents a group of 5 gaps, 
    // it will return 5 points here.
    return correctGaps;
  }

  private isMatch(studentRes: string, acceptable: string[]): boolean {
    const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedRes = normalize(studentRes);
    return acceptable.some(ans => normalize(ans) === normalizedRes);
  }
}
