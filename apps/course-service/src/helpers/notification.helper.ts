// =============================================================================
// Notification Helper - Reliable notification delivery with outbox fallback
// =============================================================================

import { EventBusService, EventNames } from "@capstone/common";
import type { NotificationEvent } from "@capstone/common";
import { databaseService } from "../services/database.service.js";

const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;

export type NotificationInput = {
  userId: string;
  title: string;
  content: string;
  type: string;
  courseId?: string;
  metadata?: Record<string, unknown>;
};

async function tryPublishToRabbitMQ(event: NotificationEvent): Promise<void> {
  const eventBus = EventBusService.getInstance("course-service");

  let lastError: unknown;
  for (let i = 0; i <= RETRY_DELAYS_MS.length; i++) {
    try {
      await eventBus.publish(EventNames.NOTIFICATION_CREATED, event);
      return;
    } catch (err) {
      lastError = err;
      if (i < RETRY_DELAYS_MS.length) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[i]));
      }
    }
  }
  throw lastError;
}

async function saveToOutbox(event: NotificationEvent): Promise<void> {
  const prisma = databaseService.getClient();
  await prisma.notificationOutbox.create({
    data: {
      eventType: EventNames.NOTIFICATION_CREATED,
      payload: event as unknown as Parameters<typeof prisma.notificationOutbox.create>[0]["data"]["payload"],
    },
  });
}

export async function publishNotification(input: NotificationInput): Promise<void> {
  const event: NotificationEvent = {
    userId: input.userId,
    type: input.type,
    title: input.title,
    content: input.content,
    metadata: input.metadata,
  };

  try {
    await tryPublishToRabbitMQ(event);
  } catch (err) {
    console.warn("[Course Service] RabbitMQ notification failed after retries, saving to outbox:", err);
    try {
      await saveToOutbox(event);
    } catch (outboxErr) {
      console.error("[Course Service] Failed to save notification to outbox:", outboxErr);
    }
  }
}

export async function publishBulkNotification(
  userIds: string[],
  input: Omit<NotificationInput, "userId">
): Promise<void> {
  if (!userIds.length) return;
  await Promise.allSettled(
    userIds.map((userId) => publishNotification({ ...input, userId }))
  );
}
