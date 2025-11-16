import { z } from 'zod';

export const getCourseRatingsDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
  query: z.object({
    starRating: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export type GetCourseRatingsInput = z.infer<typeof getCourseRatingsDTO>;

export const replyToRatingDTO = z.object({
  params: z.object({
    ratingId: z.uuid({ message: 'Rating ID must be a valid UUID' }),
  }),
  body: z.object({
    replyContent: z.string().min(1, 'Reply content is required'),
  }),
});

export type ReplyToRatingInput = z.infer<typeof replyToRatingDTO>;

export const reportRatingDTO = z.object({
  params: z.object({
    ratingId: z.uuid({ message: 'Rating ID must be a valid UUID' }),
  }),
});

export type ReportRatingInput = z.infer<typeof reportRatingDTO>;

