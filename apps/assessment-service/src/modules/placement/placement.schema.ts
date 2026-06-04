import { z } from "zod";

export const generateExamSchema = z.object({
  userId: z.string().uuid(),
});

export const submitExamSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  answers: z.array(
    z.object({
      question_id: z.string().uuid(),
      question_index: z.number().int().min(0),
      selected_option: z.enum(["A", "B", "C"]).optional(),
      selected_order: z.string().regex(/^[ABC]{3}$/).optional(),
      time_spent: z.number().int().min(0).default(0),
    })
  ),
});

export type SubmitExamInput = z.infer<typeof submitExamSchema>;
