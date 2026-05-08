// =============================================================================
// Notification Outbox Cron - Replays failed notification events every 60s
// =============================================================================

import { EventBusService, EventNames } from "@capstone/common";
import { databaseService } from "../services/database.service.js";

const POLL_INTERVAL_MS = 60_000;

async function processOutbox(): Promise<void> {
  const prisma = databaseService.getClient();
  const eventBus = EventBusService.getInstance("course-service");

  const pending = await prisma.notificationOutbox.findMany({
    where: { status: "PENDING", retryCount: { lt: 5 } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  if (!pending.length) return;

  for (const item of pending) {
    try {
      await eventBus.publish(EventNames.NOTIFICATION_CREATED, item.payload);
      await prisma.notificationOutbox.update({
        where: { id: item.id },
        data: { status: "SENT", processedAt: new Date() },
      });
    } catch {
      const nextRetry = item.retryCount + 1;
      await prisma.notificationOutbox.update({
        where: { id: item.id },
        data: {
          retryCount: nextRetry,
          status: nextRetry >= 5 ? "FAILED" : "PENDING",
        },
      });
    }
  }
}

export function startNotificationCron(): void {
  setInterval(async () => {
    try {
      await processOutbox();
    } catch (err) {
      console.error("[Course Service] Notification cron error:", err);
    }
  }, POLL_INTERVAL_MS);

  console.log("⏰ [Course Service] Notification outbox cron started (60s interval)");
}
