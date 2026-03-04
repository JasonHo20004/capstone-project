

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  score: number;
  studentAnswer: any;
  explanation?: string;
}

export interface IGradingStrategy {
  /**
   * Evaluates a student's answer against the correct answer payload.
   * @param answerData The `answer` JSONB field from the database
   * @param studentAnswer The payload submitted by the student
   * @returns Score (usually 0 or 1; GAP_FILL returns correctGaps count)
   */
  evaluate(answerData: any, studentAnswer: any): number;
}
