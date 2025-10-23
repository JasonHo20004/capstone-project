import { z } from 'zod';

export const createNotificationTypeSchema = z.object({
  name: z.string().min(1),
  isLocked: z.boolean().optional().default(false)
});
export type CreateNotificationTypeDto = z.input<typeof createNotificationTypeSchema>;

export const updateNotificationTypeSchema = z.object({
  name: z.string().min(1).optional(),
  isLocked: z.boolean().optional()
});
export type UpdateNotificationTypeDto = z.input<typeof updateNotificationTypeSchema>;

export const notificationTypeResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  isLocked: z.boolean()
});
export type NotificationTypeResponseDto = z.infer<typeof notificationTypeResponseSchema>;
