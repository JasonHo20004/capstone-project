import { z } from "zod";

export const CreatePracticeTestSchema = z.object({
  title: z.string().min(3).max(255),
  examType: z.enum(["IELTS", "TOEFL", "TOEIC"]).optional(),
  duration: z.number().int().positive(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  sections: z.array(
    z.object({
      name: z.string().min(1),
      orderIndex: z.number().int(),
      parts: z.array(
        z.object({
          name: z.string().min(1),
          content: z.string().optional(),
          mediaUrl: z.string().url().optional(),
          orderIndex: z.number().int(),
          questionGroups: z.array(
            z.object({
              instructions: z.string().optional(),
              imageUrls: z.array(z.string().url()).optional(),
              orderIndex: z.number().int(),
              questions: z.array(
                z.object({
                  type: z.enum(["MULTIPLE_CHOICE", "GAP_FILL", "MATCHING", "TRUE_FALSE_NOT_GIVEN", "TOEIC_SINGLE_CHOICE", "TOEIC_TEXT_COMPLETION"]),
                  content: z.record(z.string(), z.any()), // JSON
                  answer: z.record(z.string(), z.any()),   // JSON
                  explanation: z.string().optional(),
                  orderIndex: z.number().int()
                })
              )
            })
          )
        })
      )
    })
  )
});

export type CreatePracticeTestDto = z.infer<typeof CreatePracticeTestSchema>;
