import { z } from "zod";

// Shared question shape used by both sectioned tests and the simpler flat-list
// `FINAL` test produced by sellers from the course UI.
const QuestionSchema = z.object({
  questionText: z.string().optional(),
  questionType: z.enum([
    "MULTIPLE_CHOICE", "ESSAY", "FILL_IN_THE_BLANK",
    "GAP_FILL", "MATCHING", "TRUE_FALSE_NOT_GIVEN",
    "TOEIC_SINGLE_CHOICE", "TOEIC_TEXT_COMPLETION",
    "IELTS_WRITING_TASK1", "IELTS_WRITING_TASK2",
    "IELTS_SPEAKING", "TOEIC_WRITING", "TOEIC_SPEAKING",
  ]),
  options: z.array(z.string()).optional().default([]),
  /** Index into `options` for multiple-choice. Persisted into `answer` JSON. */
  correctAnswerIndex: z.number().int().min(0).optional(),
  content: z.record(z.string(), z.any()).optional(),
  answer: z.record(z.string(), z.any()).optional(),
  /** Where the answer is justified in the passage/transcript (Study4-style reference). */
  answerReference: z.record(z.string(), z.any()).optional().nullable(),
  explanation: z.string().optional(),
  questionOrder: z.number().int().optional(),
  imageUrl: z.string().optional(),
});

export const CreateTestSchema = z.object({
  title: z.string().min(3).max(100),
  durationInMinutes: z.number().int().positive().optional(),
  totalScore: z.number().optional(),
  passingScore: z.number().optional(),
  maxAttempts: z.number().int().optional(),
  englishTestTypeId: z.string().uuid(),
  testSkills: z.array(z.enum(["READING", "LISTENING", "WRITING", "SPEAKING"])).optional(),
  /** Only "FINAL" recognised by the seller-facing flow today. */
  testType: z.enum(["FINAL"]).optional(),
  /** Lifecycle status — default DRAFT. Seller UI sends PUBLISHED on commit. */
  status: z.string().optional(),
  sections: z.array(
    z.object({
      title: z.string(),
      skill: z.enum(["READING", "LISTENING", "WRITING", "SPEAKING"]).optional(),
      durationInSeconds: z.number().optional(),
      mediaUrl: z.string().optional(),
      audioTranscript: z.string().optional(),
      audioSegments: z
        .array(z.object({ start: z.number(), end: z.number(), text: z.string() }))
        .optional(),
      imageUrl: z.string().optional(),
      passageContent: z.string().optional(),
      questions: z.array(QuestionSchema).optional().default([]),
    })
  ).optional().default([]),
  /**
   * Flat question list for simple final tests (no sections). The service wraps
   * them in a default section so storage shape stays consistent.
   */
  questions: z.array(QuestionSchema).optional(),
});

export type CreateTestDto = z.infer<typeof CreateTestSchema>;
export type CreateTestQuestion = z.infer<typeof QuestionSchema>;
