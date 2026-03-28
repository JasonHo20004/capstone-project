// =============================================================================
// Notification Client - HTTP client to communicate with Notification Service
// =============================================================================

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006";

interface CreateNotificationInput {
  userId: string;
  title: string;
  content: string;
  type: string;
  contractId?: string;
  courseId?: string;
  metadata?: Record<string, unknown>;
}

interface CreateBulkNotificationInput {
  userIds: string[];
  title: string;
  content: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export class NotificationClient {
  private static instance: NotificationClient;

  public static getInstance(): NotificationClient {
    if (!NotificationClient.instance) {
      NotificationClient.instance = new NotificationClient();
    }
    return NotificationClient.instance;
  }

  /**
   * Send a notification to a single user (fire-and-forget)
   */
  async createNotification(data: CreateNotificationInput): Promise<void> {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/internal/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.warn(`[Course Service] Notification create failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`[Course Service] Error sending notification:`, error);
    }
  }

  /**
   * Send notifications to multiple users (fire-and-forget)
   */
  async createBulkNotifications(data: CreateBulkNotificationInput): Promise<void> {
    if (!data.userIds.length) return;

    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/internal/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.warn(`[Course Service] Bulk notification create failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`[Course Service] Error sending bulk notifications:`, error);
    }
  }
}

export const notificationClient = NotificationClient.getInstance();
