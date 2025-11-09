import { z } from 'zod';
import { CourseLevel, CourseStatus } from '@/../generated/prisma';

// Create Course DTO
export const createCourseDTO = z.object({
  body: z.object({
    title: z.string().min(1, 'Course name is required'),
    description: z.string().optional(),
    shortDescription: z.string().max(255, 'Short description must be at most 255 characters').optional(),
    price: z.number().min(0, 'Price must be non-negative'),
    category: z.string().optional(),
    courseLevel: z.enum(CourseLevel).optional(),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseDTO>;

// Update Course DTO
export const updateCourseDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    shortDescription: z.string().max(255).optional(),
    price: z.number().min(0).optional(),
    category: z.string().optional(),
    courseLevel: z.enum(CourseLevel).optional(),
  }),
});

export type UpdateCourseInput = z.infer<typeof updateCourseDTO>;

// Publish Course DTO
export const publishCourseDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
});

export type PublishCourseInput = z.infer<typeof publishCourseDTO>;

// Get Course by ID DTO
export const getCourseByIdDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
});

export type GetCourseByIdInput = z.infer<typeof getCourseByIdDTO>;

// Get Courses by Seller DTO
export const getCoursesBySellerDTO = z.object({
  params: z.object({
    sellerId: z.uuid({ message: 'Seller ID must be a valid UUID' }),
  }),
  query: z.object({
    status: z.enum(CourseStatus).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type GetCoursesBySellerInput = z.infer<typeof getCoursesBySellerDTO>;

