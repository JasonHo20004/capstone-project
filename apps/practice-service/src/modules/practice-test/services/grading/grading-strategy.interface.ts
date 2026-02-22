import { QuestionType } from "../../../../../generated/prisma/index.js";

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  score: number; // For future fractional scores, e.g., 0.5
  studentAnswer: string | string[] | any;
  explanation?: string;
}

export interface IGradingStrategy {
  /**
   * Evaluates a student's answer against the correct answer payload.
   * @param answerData The `answer` JSONB field from the database for this question
   * @param studentAnswer The payload submitted by the student
   */
  evaluate(answerData: any, studentAnswer: any): number; // Returns score (usually 0 or 1)
}
