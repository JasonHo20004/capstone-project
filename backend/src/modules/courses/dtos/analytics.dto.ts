import { z } from 'zod';

export const getCompletionAnalyticsDTO = z.object({
  params: z.object({
    courseId: z.uuid({ message: 'Course ID must be a valid UUID' }),
  }),
  query: z.object({
    export: z.enum(['csv', 'pdf']).optional(),
  }),
});

export type GetCompletionAnalyticsInput = z.infer<typeof getCompletionAnalyticsDTO>;

