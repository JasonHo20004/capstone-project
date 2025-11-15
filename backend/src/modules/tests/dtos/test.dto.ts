import { z } from 'zod';
import { QuestionType, SkillType } from '@/../generated/prisma';

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

// Get Test by ID DTO
export const getTestByIdDTO = z.object({
  params: z.object({
    testId: z.uuid({ message: 'Test ID must be a valid UUID' }),
  }),
});

export type GetTestByIdInput = z.infer<typeof getTestByIdDTO>;

// Section DTOs
export const createSectionDTO = z.object({
  params: z.object({
    testId: z.uuid({ message: 'Test ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().min(1, 'Section title is required'),
    skill: z.enum(SkillType),
    durationInSeconds: z.number().positive().optional(),
    totalQuestions: z.number().int().positive().optional(),
    totalScore: z.number().positive().optional(),
  }),
});

export type CreateSectionInput = z.infer<typeof createSectionDTO>;

export const getSectionsByTestIdDTO = z.object({
  params: z.object({
    testId: z.uuid({ message: 'Test ID must be a valid UUID' }),
  }),
});

export type GetSectionsByTestIdInput = z.infer<typeof getSectionsByTestIdDTO>;

export const getSectionByIdDTO = z.object({
  params: z.object({
    sectionId: z.uuid({ message: 'Section ID must be a valid UUID' }),
  }),
});

export type GetSectionByIdInput = z.infer<typeof getSectionByIdDTO>;

// Passage DTOs
export const addPassageToSectionDTO = z.object({
  params: z.object({
    sectionId: z.uuid({ message: 'Section ID must be a valid UUID' }),
  }),
  body: z.object({
    content: z.string().min(1, 'Passage content is required'),
    passageOrder: z.number().int().positive().optional(),
  }),
});

export type AddPassageToSectionInput = z.infer<typeof addPassageToSectionDTO>;

export const getPassagesBySectionIdDTO = z.object({
  params: z.object({
    sectionId: z.uuid({ message: 'Section ID must be a valid UUID' }),
  }),
});

export type GetPassagesBySectionIdInput = z.infer<typeof getPassagesBySectionIdDTO>;

// Question DTOs
export const addQuestionToSectionDTO = z.object({
  params: z.object({
    sectionId: z.uuid({ message: 'Section ID must be a valid UUID' }),
  }),
  body: z.object({
    passageId: z.uuid({ message: 'Passage ID must be a valid UUID' }),
    mediaId: z.uuid({ message: 'Media ID must be a valid UUID' }),
    questionText: z.string().min(1, 'Question text is required'),
    questionType: z.enum(QuestionType),
    options: z.array(z.string()).optional(),
    correctAnswerIndex: z.number().int().nonnegative().optional(),
    correctAnswer: z.string().optional(),
    wordLimit: z.number().int().positive().optional(),
    imageUrl: z.string().optional(),
    questionOrder: z.number().int().positive().optional(),
  }),
});

export type AddQuestionToSectionInput = z.infer<typeof addQuestionToSectionDTO>;

export const getQuestionsBySectionIdDTO = z.object({
  params: z.object({
    sectionId: z.uuid({ message: 'Section ID must be a valid UUID' }),
  }),
});

export type GetQuestionsBySectionIdInput = z.infer<typeof getQuestionsBySectionIdDTO>;

export const getQuestionByIdDTO = z.object({
  params: z.object({
    questionId: z.uuid({ message: 'Question ID must be a valid UUID' }),
  }),
});

export type GetQuestionByIdInput = z.infer<typeof getQuestionByIdDTO>;

