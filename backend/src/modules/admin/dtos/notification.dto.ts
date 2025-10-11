import { z } from "zod";

// Get user notifications DTO
export const getUserNotificationsDTO = z.object({
  params: z.object({
    userId: z.uuid({ message: 'User ID must be a valid UUID' })
  }),
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    unreadOnly: z.string().optional().transform(val => val === 'true'),
    type: z.string().optional()
  })
});

export type GetUserNotificationsInput = z.infer<typeof getUserNotificationsDTO>;

// Mark notification as read DTO
export const markNotificationReadDTO = z.object({
  params: z.object({
    notificationId: z.uuid({ message: 'Notification ID must be a valid UUID' })
  })
});

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadDTO>;

// Mark all notifications as read DTO
export const markAllNotificationsReadDTO = z.object({
  params: z.object({
    userId: z.uuid({ message: 'User ID must be a valid UUID' })
  })
});

export type MarkAllNotificationsReadInput = z.infer<typeof markAllNotificationsReadDTO>;

// Archive notification DTO
export const archiveNotificationDTO = z.object({
  params: z.object({
    notificationId: z.uuid({ message: 'Notification ID must be a valid UUID' })
  })
});

export type ArchiveNotificationInput = z.infer<typeof archiveNotificationDTO>;

// Get notification stats DTO
export const getNotificationStatsDTO = z.object({
  params: z.object({
    userId: z.uuid({ message: 'User ID must be a valid UUID' })
  })
});

export type GetNotificationStatsInput = z.infer<typeof getNotificationStatsDTO>;
