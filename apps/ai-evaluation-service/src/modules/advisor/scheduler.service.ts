// =============================================================================
// AI Advisor — Proactive Scheduler
// Cron-based triggers for idle detection and daily reminders.
// Uses node-cron (already available in Node.js ecosystem).
// =============================================================================

import cron from "node-cron";
import { databaseService } from "../../services/database.service.js";
import { advisorService, sseConnections } from "./advisor.service.js";
import { isProactiveAllowed } from "./action-registry.js";

class SchedulerService {
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // ─── Trigger 1: Idle check — runs every hour ────────────────────────────
    // Checks users who are currently connected via SSE but haven't been active in 4h
    cron.schedule("0 * * * *", async () => {
      console.log("[Scheduler] Running idle check...");
      await this.checkIdleUsers();
    });

    // ─── Trigger 2: Daily morning reminder — runs at 8:00 AM (Vietnam time = UTC+7 = 1:00 AM UTC)
    cron.schedule("0 1 * * *", async () => {
      console.log("[Scheduler] Running daily reminder push...");
      await this.sendDailyReminders();
    });

    console.log("✅ [Scheduler] AI Advisor proactive scheduler started");
  }

  /**
   * Check users currently connected via SSE for 4h+ idle time.
   * Only fires for users with an active SSE connection (they're in the app).
   */
  private async checkIdleUsers(): Promise<void> {
    const prisma = databaseService.getClient();
    const connectedUserIds = Array.from(sseConnections.keys());

    if (connectedUserIds.length === 0) return;

    const profiles = await prisma.userLearningProfile.findMany({
      where: { userId: { in: connectedUserIds } },
    });

    const now = Date.now();
    const IDLE_THRESHOLD_MS = 4 * 60 * 60 * 1000; // 4 hours

    for (const profile of profiles) {
      const personality = profile.learningPersonality as Record<string, unknown>;
      const lastActive = personality.last_active_at as string | undefined;

      if (!lastActive) continue;

      const idleMs = now - new Date(lastActive).getTime();
      if (idleMs < IDLE_THRESHOLD_MS) continue;

      const advisorConfig = profile.advisorConfig as Record<string, unknown>;
      if (!isProactiveAllowed(advisorConfig)) continue;

      // Fire proactive check for this idle user
      await advisorService.proactiveCheck(profile.userId, "idle_4h");
    }
  }

  /**
   * Send daily morning reminders to users who haven't studied today.
   * Only sends if user has an active SSE connection.
   */
  private async sendDailyReminders(): Promise<void> {
    const prisma = databaseService.getClient();
    const connectedUserIds = Array.from(sseConnections.keys());

    if (connectedUserIds.length === 0) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const profiles = await prisma.userLearningProfile.findMany({
      where: { userId: { in: connectedUserIds } },
    });

    for (const profile of profiles) {
      const personality = profile.learningPersonality as Record<string, unknown>;
      const lastActive = personality.last_active_at as string | undefined;

      // If user already studied today, skip
      if (lastActive && new Date(lastActive) >= todayStart) continue;

      const advisorConfig = profile.advisorConfig as Record<string, unknown>;
      if (!isProactiveAllowed(advisorConfig)) continue;

      await advisorService.proactiveCheck(profile.userId, "daily_reminder");
    }
  }

  stop(): void {
    this.isRunning = false;
    cron.getTasks().forEach((task) => task.stop());
  }
}

export const schedulerService = new SchedulerService();
