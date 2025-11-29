import { z } from "zod";
import { CourseLevel, CourseStatus } from "@/../generated/prisma";

// Create Course DTO
// Note: Uses z.coerce for multipart/form-data support
// The thumbnail image file is handled by multer middleware and accessed via req.file
export const createCourseDTO = z.object({
  body: z.object({
    title: z.string().min(1, "Course name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be non-negative"),
    category: z.string().optional(),
    courseLevel: z.enum(CourseLevel).optional(),
    thumbnailUrl: z.string().url().optional(),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseDTO>;

// Update Course DTO
// Note: Uses z.coerce for multipart/form-data support
// The thumbnail image file is handled by multer middleware and accessed via req.file
export const updateCourseDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: "Course ID must be a valid UUID" }),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    category: z.string().optional(),
    courseLevel: z.enum(CourseLevel).optional(),
    thumbnailUrl: z.string().url().optional(),
  }),
});

export type UpdateCourseInput = z.infer<typeof updateCourseDTO>;

// Publish Course DTO
export const publishCourseDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: "Course ID must be a valid UUID" }),
  }),
});

export type PublishCourseInput = z.infer<typeof publishCourseDTO>;

// Get Course by ID DTO
export const getCourseByIdDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: "Course ID must be a valid UUID" }),
  }),
});

export type GetCourseByIdInput = z.infer<typeof getCourseByIdDTO>;

// Get Courses by Seller DTO
export const getCoursesBySellerDTO = z.object({
  params: z.object({
    sellerId: z.uuid({ message: "Seller ID must be a valid UUID" }),
  }),
  query: z.object({
    status: z.enum(CourseStatus).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type GetCoursesBySellerInput = z.infer<typeof getCoursesBySellerDTO>;

// Get All Courses DTO
export const getCoursesDTO = z.object({
  query: z
    .object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      category: z.string().optional(),
      minPrice: z.string().optional(),
      maxPrice: z.string().optional(),
      courseLevel: z.enum(CourseLevel).optional(),
      status: z.enum(CourseStatus).default(CourseStatus.PUBLISHED).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      enrollmentStatus: z.enum(["enrolled", "not_enrolled"]).optional(),
    })
    .refine(
      (data) => {
        if (data.minPrice !== undefined && data.maxPrice !== undefined) {
          return data.minPrice <= data.maxPrice;
        }
        return true;
      },
      {
        message: "Min price cannot be greater than Max price",
        path: ["minPrice"],
      }
    ),
});

export type GetCoursesInput = z.infer<typeof getCoursesDTO>;
