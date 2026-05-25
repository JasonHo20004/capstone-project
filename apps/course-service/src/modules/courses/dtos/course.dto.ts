// =============================================================================
// Course DTOs - Data Transfer Objects for Courses
// =============================================================================

import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    category: z.string().optional(),
    courseLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    thumbnailUrl: z.string().url().optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    category: z.string().optional(),
    courseLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    thumbnailUrl: z.string().url().optional(),
    status: z.enum(["DRAFT", "PENDING", "ACTIVE", "INACTIVE"]).optional(),
  }),
});

export const getCoursesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    category: z.string().optional(),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    status: z.enum(["PENDING", "ACTIVE", "DRAFT", "INACTIVE", "REFUSE"]).optional(),
    sellerId: z.string().uuid().optional(),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>["body"];
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>["body"];
export type GetCoursesQuery = z.infer<typeof getCoursesQuerySchema>["query"];

export interface CourseResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  courseLevel: string | null;
  courseSellerId: string;
  sellerName?: string;
  thumbnailUrl: string | null;
  status: string;
  ratingCount: number | null;
  lessonCount: number;
  createdAt: Date;
  submittedAt?: Date | null;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  rejectionReason?: string | null;
  reviewedById?: string | null;
}
