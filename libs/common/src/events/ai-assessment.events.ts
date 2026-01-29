// AI Assessment Events - For AI-powered grading workflows

export interface AssessmentSubmittedEvent {
  submissionId: string;
  userId: string;
  testId: string;
  type: "SPEAKING" | "WRITING" | "LISTENING";
  contentUrl?: string; // URL to audio file or essay text
  textContent?: string;
}

export interface AiGradingCompletedEvent {
  submissionId: string;
  userId: string;
  score: number;
  feedback: string;
  detailedAnalysis?: any;
}

export interface AiGradingFailedEvent {
  submissionId: string;
  userId: string;
  reason: string;
}
