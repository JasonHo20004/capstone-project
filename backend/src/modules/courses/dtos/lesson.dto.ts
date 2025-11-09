import { z } from 'zod';

// Note: This DTO only validates the non-file fields.
// The video file is handled by multer middleware and accessed via req.file
export const createLessonDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().min(1, 'Lesson title is required'),
    description: z.string().optional(),
    lessonOrder: z.coerce.number().int().optional(),
    durationInSeconds: z.coerce.number().optional(),
    videoDescription: z.string().optional(),
  }),
});

export type CreateLessonInput = z.infer<typeof createLessonDTO>;

// Update Lesson DTO
export const updateLessonDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
    lessonId: z.uuid({ message: 'Lesson ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    lessonOrder: z.coerce.number().int().optional(),
    durationInSeconds: z.coerce.number().optional(),
  }),
});

export type UpdateLessonInput = z.infer<typeof updateLessonDTO>;

// Get Lesson by ID DTO
export const getLessonByIdDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
    lessonId: z.uuid({ message: 'Lesson ID must be a valid UUID' }),
  }),
});

export type GetLessonByIdInput = z.infer<typeof getLessonByIdDTO>;

