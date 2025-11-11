import z from "zod";
import { QuestionType } from "@/../generated/prisma";
// request
export const startSessionDTO = z.object({
  body: z.object({
    testId: z.uuid({
      message: "Test ID must be a valid UUID",
    }),
    sectionIds: z.array(z.uuid()).optional(),
  }),
});

export const answerQuestionDTO = z.object({
  body: z.object({
    questionId: z.uuid({ message: "Test ID must be a valid UUID" }),
    selectedOptionIndex: z.number().int().nullable().optional(),
    answerText: z.string().nullable().optional(),
  }),
  params: z.object({
    sessionId: z.uuid({ message: "Session ID must be a valid UUID" }),
  }),
});

export type StartSessionInput = z.infer<typeof startSessionDTO>;
export type AnswerQuestionInput = z.infer<typeof answerQuestionDTO>;
//response
const includedUserDTO = z.object({
  fullName: z.string(),
  email: z.email(),
});
const includedTestDTO = z.object({
  title: z.string(),
  durationInMinutes: z.number().int().nullable(),
});

const includedQuestionDTO = z.object({
  questionText: z.string().nullable(),
  questionType: z.enum(QuestionType)
});
export const createSessionResponseDTO = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  testId: z.uuid(),
  selectedSections: z.array(z.string()),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  user: includedUserDTO,
  test: includedTestDTO,
});

export const answerQuestionResponseDTO = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  questionId: z.uuid(),
  practiceSessionId: z.uuid(),
  selectedOptionIndex: z.number().int().nullable(),
  answerText: z.string().nullable(),
  question:includedQuestionDTO,
  user: includedUserDTO,
});
export type CreateSessionResponse = z.infer<typeof createSessionResponseDTO>;
export type AnswerQuestionResponse = z.infer<typeof answerQuestionResponseDTO>