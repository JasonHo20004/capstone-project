import { z } from "zod";


export const getLessonForPlayerDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
    lessonId: z.string().uuid("Định dạng ID bài học không hợp lệ"),
  }),
});

export type GetLessonForPlayerInput = z.infer<typeof getLessonForPlayerDTO>;


export const getCourseSyllabusDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
  }),
});

export type GetCourseSyllabusInput = z.infer<typeof getCourseSyllabusDTO>;


export const getCourseContextDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
  }),
});

export type GetCourseContextInput = z.infer<typeof getCourseContextDTO>;


export const getLessonCommentsDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
    lessonId: z.string().uuid("Định dạng ID bài học không hợp lệ"),
  }),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
});

export type GetLessonCommentsInput = z.infer<typeof getLessonCommentsDTO>;

export const createLessonCommentDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
    lessonId: z.string().uuid("Định dạng ID bài học không hợp lệ"),
  }),
  body: z.object({
    content: z.string().min(1, "Nội dung bình luận là bắt buộc").max(2000, "Bình luận quá dài"),
    parentCommentId: z.string().uuid("Định dạng ID bình luận cha không hợp lệ").optional(),
  }),
});

export type CreateLessonCommentInput = z.infer<typeof createLessonCommentDTO>;


export const getCourseRatingsDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
  }),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
});

export type GetCourseRatingsInput = z.infer<typeof getCourseRatingsDTO>;

export const createCourseRatingDTO = z.object({
  params: z.object({
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
  }),
  body: z.object({
    score: z.number().min(1, "Điểm đánh giá phải ít nhất là 1").max(5, "Điểm đánh giá tối đa là 5"),
    content: z.string().max(2000, "Nội dung đánh giá quá dài").optional(),
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
    courseId: z.string().uuid("Định dạng ID khóa học không hợp lệ"),
    lessonId: z.string().uuid("Định dạng ID bài học không hợp lệ"),
  }),
});

export type MarkLessonCompleteInput = z.infer<typeof markLessonCompleteDTO>;

