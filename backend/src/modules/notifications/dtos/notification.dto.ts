import { z } from 'zod';

// Create
export const createNotificationSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  notificationTypeId: z.uuid(),
  seen: z.boolean().optional()
});
export type CreateNotificationDto = z.input<typeof createNotificationSchema>;

// Update
export const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  notificationTypeId: z.uuid().optional(),
  seen: z.boolean().optional()
});
export type UpdateNotificationDto = z.input<typeof updateNotificationSchema>;

// Response shapes
export const notificationResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string(),
  createdAt: z.iso.date(),
  seen: z.boolean(),
  notificationTypeId: z.uuid(),
  notificationType: z
    .object({
      id: z.uuid(),
      name: z.string(),
      isLocked: z.boolean()
    })
    .optional()
});
export type NotificationResponseDto = z.infer<typeof notificationResponseSchema>;

export const notificationWithUsersSchema = notificationResponseSchema.extend({
  users: z
    .array(
      z.object({
        id: z.uuid(),
        fullName: z.string(),
        email: z.email()
      })
    )
    .optional()
});
export type NotificationWithUsersDto = z.infer<typeof notificationWithUsersSchema>;