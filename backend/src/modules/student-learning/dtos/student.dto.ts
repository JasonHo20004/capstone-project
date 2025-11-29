import { z } from "zod";


export const getLessonForPlayerDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
    lessonId: z.string().uuid("Invalid lesson ID format"),
  }),
});

export type GetLessonForPlayerInput = z.infer<typeof getLessonForPlayerDTO>;


export const getCourseSyllabusDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
  }),
});

export type GetCourseSyllabusInput = z.infer<typeof getCourseSyllabusDTO>;


export const getCourseContextDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
  }),
});

export type GetCourseContextInput = z.infer<typeof getCourseContextDTO>;


export const getLessonCommentsDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
    lessonId: z.string().uuid("Invalid lesson ID format"),
  }),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
});

export type GetLessonCommentsInput = z.infer<typeof getLessonCommentsDTO>;

export const createLessonCommentDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
    lessonId: z.string().uuid("Invalid lesson ID format"),
  }),
  body: z.object({
    content: z.string().min(1, "Comment content is required").max(2000, "Comment is too long"),
    parentCommentId: z.string().uuid("Invalid parent comment ID format").optional(),
  }),
});

export type CreateLessonCommentInput = z.infer<typeof createLessonCommentDTO>;


export const getCourseRatingsDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
  }),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
});

export type GetCourseRatingsInput = z.infer<typeof getCourseRatingsDTO>;

export const createCourseRatingDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
  }),
  body: z.object({
    score: z.number().min(1, "Score must be at least 1").max(5, "Score must be at most 5"),
    content: z.string().max(2000, "Review content is too long").optional(),
  }),
});

export type CreateCourseRatingInput = z.infer<typeof createCourseRatingDTO>;


export const getEnrolledCoursesDTO = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export type GetEnrolledCoursesInput = z.infer<typeof getEnrolledCoursesDTO>;

export const markLessonCompleteDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
    lessonId: z.string().uuid("Invalid lesson ID format"),
  }),
});

export type MarkLessonCompleteInput = z.infer<typeof markLessonCompleteDTO>;

