// =============================================================================
// Notification DTOs - Data Transfer Objects with Zod Validation
// =============================================================================

import { z } from "zod";

// ============== In-App Notification DTOs ==============

export const createNotificationSchema = {
  body: z.object({
    userId: z.string().uuid(),
    title: z.string().min(1, "Title is required").max(255),
    content: z.string().min(1, "Content is required"),
    type: z.string().min(1).max(50),
    contractId: z.string().uuid().optional(),
    courseId: z.string().uuid().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
};

export const createBulkNotificationSchema = {
  body: z.object({
    userIds: z.array(z.string().uuid()).min(1, "At least one user ID required"),
    title: z.string().min(1, "Title is required").max(255),
    content: z.string().min(1, "Content is required"),
    type: z.string().min(1).max(50),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
};

export const getNotificationSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const listNotificationsSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    type: z.string().optional(),
    isRead: z.coerce.boolean().optional(),
    isArchived: z.coerce.boolean().optional(),
  }),
};

export const markAsReadSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const markAllAsReadSchema = {
  body: z.object({
    type: z.string().optional(), // Optionally filter by type
  }),
};

export const archiveNotificationSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

// ============== Notification Type DTOs ==============

export const createNotificationTypeSchema = {
  body: z.object({
    name: z.string().min(1).max(50),
    isLocked: z.boolean().default(false),
  }),
};

export const updateNotificationTypeSchema = {
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    isLocked: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};

// ============== Type Exports ==============

export type CreateNotificationInput = z.infer<typeof createNotificationSchema.body>;
export type CreateBulkNotificationInput = z.infer<typeof createBulkNotificationSchema.body>;
export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema.query>;
export type CreateNotificationTypeInput = z.infer<typeof createNotificationTypeSchema.body>;
export type UpdateNotificationTypeInput = z.infer<typeof updateNotificationTypeSchema.body>;

// ============== Response Interfaces ==============

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  readAt: Date | null;
  archivedAt: Date | null;
  contractId: string | null;
  courseId: string | null;
  metadata: Record<string, unknown> | null;
}

export interface NotificationTypeResponse {
  id: string;
  name: string;
  isLocked: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}
