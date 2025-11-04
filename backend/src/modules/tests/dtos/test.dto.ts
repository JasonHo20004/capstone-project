import { z } from 'zod';
import { QuestionType } from '@/../generated/prisma';

// Create Test DTO
export const createTestDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().min(1, 'Test title is required'),
    durationInMinutes: z.number().optional(),
    maxAttempts: z.number().optional(),
    englishTestTypeId: z.uuid({ message: 'English Test Type ID must be a valid UUID' }),
  }),
});

export type CreateTestInput = z.infer<typeof createTestDTO>;

// Add Question to Test DTO
export const addQuestionDTO = z.object({
  params: z.object({
    testId: z.uuid({ message: 'Test ID must be a valid UUID' }),
  }),
  body: z.object({
    questionText: z.string().min(1, 'Question text is required'),
    questionType: z.nativeEnum(QuestionType),
    options: z.array(z.string()).optional(),
    correctAnswerIndex: z.number().optional(),
    correctAnswer: z.string().optional(),
    questionOrder: z.number().optional(),
  }),
});

export type AddQuestionInput = z.infer<typeof addQuestionDTO>;

// Get Test by ID DTO
export const getTestByIdDTO = z.object({
  params: z.object({
    testId: z.uuid({ message: 'Test ID must be a valid UUID' }),
  }),
});

export type GetTestByIdInput = z.infer<typeof getTestByIdDTO>;

