// =============================================================================
// AI Evaluation Service - Queue Types
// =============================================================================

export enum JobType {
  GRADE_WRITING = "GRADE_WRITING",
  GRADE_SPEAKING = "GRADE_SPEAKING",
}

export interface WritingJobData {
  type: JobType.GRADE_WRITING;
  evaluationId: string;
  userId: string;
  essayText: string;
  questionId?: string;
  sessionId?: string;
}

export interface SpeakingJobData {
  type: JobType.GRADE_SPEAKING;
  evaluationId: string;
  userId: string;
  audioUrl: string;
  questionId?: string;
  sessionId?: string;
}

export type EvaluationJobData = WritingJobData | SpeakingJobData;

// ─── AI Response Types ──────────────────────────────────────────────────────────

export interface WritingCriteriaScore {
  score: number;
  feedback: string;
}

export interface WritingEvaluationResult {
  overall_band: number;
  criteria: {
    task_achievement: WritingCriteriaScore;
    coherence: WritingCriteriaScore;
    lexical: WritingCriteriaScore;
    grammar: WritingCriteriaScore;
  };
  highlighted_errors: Array<{
    original: string;
    suggestion: string;
    type: "grammar" | "vocab" | "coherence";
  }>;
  overall_feedback: string;
}

export interface SpeakingEvaluationResult {
  overall_band: number;
  pronunciation_score: number;
  fluency_score: number;
  vocab_score: number;
  grammar_score: number;
  feedback: string;
}

// ─── Writing Assistant Types ────────────────────────────────────────────────────

export interface WritingAssistantRequest {
  lastSentence: string;
  prevSentence: string;
}

export interface WritingAssistantResponse {
  errors: Array<{
    text: string;
    suggestion: string;
    type: "grammar" | "vocab" | "coherence" | "spelling";
  }>;
  suggestions: Array<{
    text: string;
    improvement: string;
  }>;
}
