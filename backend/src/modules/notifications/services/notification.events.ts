import { EventEmitter } from "events";

export const notificationEvents = new EventEmitter();

export const IN_APP_NOTIFICATION_CREATED_EVENT = "in-app-notification-created";

export interface InAppNotificationPayload {
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
  metadata: unknown;
}


