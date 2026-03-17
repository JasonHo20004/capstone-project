import { z } from "zod";

export const CreateTestSchema = z.object({
  title: z.string().min(3).max(100),
  durationInMinutes: z.number().int().positive().optional(),
  totalScore: z.number().optional(),
  passingScore: z.number().optional(),
  maxAttempts: z.number().int().optional(),
  englishTestTypeId: z.string().uuid(),
  testSkills: z.array(z.enum(["READING", "LISTENING", "WRITING", "SPEAKING"])).optional(),
  sections: z.array(
    z.object({
      title: z.string(),
      skill: z.enum(["READING", "LISTENING", "WRITING", "SPEAKING"]).optional(),
      durationInSeconds: z.number().optional(),
      mediaUrl: z.string().optional(),
      imageUrl: z.string().optional(),
      passageContent: z.string().optional(),
      questions: z.array(
        z.object({
          questionText: z.string().optional(),
          questionType: z.enum([
            "MULTIPLE_CHOICE", "ESSAY", "FILL_IN_THE_BLANK",
            "GAP_FILL", "MATCHING", "TRUE_FALSE_NOT_GIVEN",
            "TOEIC_SINGLE_CHOICE", "TOEIC_TEXT_COMPLETION",
            "IELTS_WRITING_TASK1", "IELTS_WRITING_TASK2",
            "IELTS_SPEAKING", "TOEIC_WRITING", "TOEIC_SPEAKING",
          ]),
          options: z.array(z.string()).optional().default([]),
          content: z.record(z.string(), z.any()).optional(),
          answer: z.record(z.string(), z.any()).optional(),
          explanation: z.string().optional(),
          questionOrder: z.number().int().optional(),
          imageUrl: z.string().optional(),
        })
      ).optional().default([]),
    })
  ).optional().default([]),
});

export type CreateTestDto = z.infer<typeof CreateTestSchema>;
