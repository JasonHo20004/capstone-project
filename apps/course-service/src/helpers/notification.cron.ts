// =============================================================================
// Notification Outbox Cron - Replays failed notification events every 60s
// =============================================================================

import { EventBusService, EventNames } from "@capstone/common";
import { databaseService } from "../services/database.service.js";
import { identityClient } from "../clients/identity.client.js";
import { notificationClient } from "../clients/notification.client.js";
import { SYSTEM_ACTOR_ID } from "../constants.js";
import {
  QF,
  FLAG_TTL_MS,
  deriveQualityFlag,
} from "../modules/admin/helpers/quality-flag.helper.js";
import type { CourseStatus } from "../../generated/prisma/index.js";

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

/**
 * Notify seller (in-app + email) and the flagging admin (in-app) that a course
 * was auto-reverted to DRAFT after 48h without a recorded fix confirmation.
 */
async function notifyAutoDrafted(
  sellerId: string,
  adminId: string,
  courseId: string,
  courseTitle: string
): Promise<void> {
  const content = `Khoá học "${courseTitle}" đã tự động chuyển về Bản nháp (Draft) do không có xác nhận chỉnh sửa được ghi nhận trong vòng 48 giờ. Khoá học không còn được bán cho học viên mới; học viên đã mua vẫn học bình thường.`;

  await notificationClient.createNotification({
    userId: sellerId,
    title: "Khoá học đã tự động chuyển về Draft",
    content,
    type: "COURSE_AUTO_DRAFTED",
    courseId,
  });

  // Notify the admin who raised the flag (best-effort).
  if (adminId && adminId !== SYSTEM_ACTOR_ID) {
    await notificationClient.createNotification({
      userId: adminId,
      title: "Khoá học bị đánh cờ đã tự động chuyển về Draft",
      content: `Khoá học "${courseTitle}" đã tự động chuyển về Draft vì chưa có xác nhận chỉnh sửa trong 48 giờ.`,
      type: "COURSE_AUTO_DRAFTED",
      courseId,
    });
  }

  const seller = await identityClient.getUserBasicInfo(sellerId);
  if (seller?.email) {
    await notificationClient.sendEmail({
      to: seller.email,
      subject: `[Tự động] Khoá học "${courseTitle}" đã chuyển về Bản nháp`,
      html: `<p>Xin chào,</p><p>${content}</p><p>Vui lòng chỉnh sửa và gửi lại khoá học để được duyệt.</p>`,
    });
  }
}

/**
 * Quality-flag sweeper: revert ACTIVE courses to DRAFT when their flag has been
 * open (unconfirmed) for >= 48h. Does NOT refund or revoke existing buyers —
 * existing students keep access; only new sales/visibility stop.
 */
async function sweepExpiredQualityFlags(): Promise<void> {
  const prisma = databaseService.getClient();
  const cutoff = new Date(Date.now() - FLAG_TTL_MS);

  // Candidate open-flag rows past the 48h deadline.
  const openRows = await prisma.courseReviewHistory.findMany({
    where: { reason: { startsWith: QF.OPEN }, createdAt: { lte: cutoff } },
    select: { courseId: true },
  });
  if (!openRows.length) return;

  const courseIds = [...new Set(openRows.map((r) => r.courseId))];

  for (const courseId of courseIds) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { reviewHistory: true },
    });
    if (!course || course.status !== ("ACTIVE" as CourseStatus)) continue;

    const flag = deriveQualityFlag(course.reviewHistory);
    if (!flag || flag.confirmed || flag.deadlineAt > new Date()) continue;

    try {
      await prisma.$transaction([
        prisma.course.update({
          where: { id: courseId },
          data: { status: "DRAFT" as CourseStatus },
        }),
        prisma.courseReviewHistory.create({
          data: {
            courseId,
            fromStatus: "ACTIVE" as CourseStatus,
            toStatus: "DRAFT" as CourseStatus,
            actorId: SYSTEM_ACTOR_ID,
            actorRole: "system",
            reason: `${QF.AUTODRAFT}|Tự động chuyển Draft: không có xác nhận chỉnh sửa trong 48 giờ`,
          },
        }),
      ]);
      console.log(`🚩 [Course Service] Auto-drafted course ${courseId} (quality flag expired)`);

      try {
        await notifyAutoDrafted(course.courseSellerId, flag.flaggedById, courseId, course.title);
      } catch (err) {
        console.error("[Course Service] Failed to notify auto-draft:", err);
      }
    } catch (err) {
      console.error(`[Course Service] Auto-draft failed for course ${courseId}:`, err);
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
    try {
      await sweepExpiredQualityFlags();
    } catch (err) {
      console.error("[Course Service] Quality-flag sweeper error:", err);
    }
  }, POLL_INTERVAL_MS);

  console.log("⏰ [Course Service] Notification outbox + quality-flag cron started (60s interval)");
}
