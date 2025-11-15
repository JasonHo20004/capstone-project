import z from 'zod'
import { QuestionType } from "@/../generated/prisma";
const includedUserDTO = z.object({
  fullName: z.string(),
  email: z.email(),
});
const includedQuestionDTO = z.object({
  questionText: z.string().nullable(),
  questionType: z.enum(QuestionType),
});
const includedQuestionUserAnswerDTO = z.object({
  id:z.uuid(),
  questionText: z.string().nullable(),
  questionType: z.enum(QuestionType),
  questionOrder:z.number().int().nullable(),
  options:z.array(z.string()),
  correctAnswer:z.string().nullable(),
  correctAnswerIndex:z.number().int().nullable(),
});

export const answerQuestionResponseDTO = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  questionId: z.uuid(),
  practiceSessionId: z.uuid(),
  selectedOptionIndex: z.number().int().nullable(),
  answerText: z.string().nullable(),
  question: includedQuestionDTO,
  user: includedUserDTO,
});
export const userAnswerSubmitResponseDTO = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  questionId: z.uuid(),
  practiceSessionId: z.uuid(),
  selectedOptionIndex: z.number().int().nullable(),
  answerText: z.string().nullable(),
  question: includedQuestionUserAnswerDTO,
  user: includedUserDTO,
})
export type AnswerQuestionResponse = z.infer<typeof answerQuestionResponseDTO>;
export type UserAnswerSubmitResponse = z.infer<typeof userAnswerSubmitResponseDTO>;