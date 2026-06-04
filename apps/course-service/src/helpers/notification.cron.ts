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

// ── Progress-reminder ("behind on your course", Duolingo-style) config ───────
const DAY_MS = 86_400_000;
// Remind a learner who hasn't completed any lesson in this many days.
const PROGRESS_REMINDER_INACTIVITY_DAYS = Number(process.env.PROGRESS_REMINDER_INACTIVITY_DAYS ?? 3);
// Don't re-remind the same enrollment more often than this (keeps the 60s cron
// from spamming). Equal to the inactivity window by default.
const PROGRESS_REMINDER_REPEAT_DAYS = Number(process.env.PROGRESS_REMINDER_REPEAT_DAYS ?? 3);
// The reminder sweep is far heavier than the outbox poll, so throttle it to run
// at most this often regardless of the 60s tick.
const PROGRESS_REMINDER_SWEEP_INTERVAL_MS = Number(
  process.env.PROGRESS_REMINDER_SWEEP_INTERVAL_MS ?? 6 * 60 * 60 * 1000
);
// Hard cap per sweep so a backlog can't blast thousands of emails at once.
const PROGRESS_REMINDER_MAX_PER_SWEEP = Number(process.env.PROGRESS_REMINDER_MAX_PER_SWEEP ?? 200);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Timestamp of the last progress-reminder sweep (in-memory; resets on restart).
let lastReminderSweepAt = 0;

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

// Branded, email-client-safe HTML (table layout + inline styles). Encouraging,
// Duolingo-style nudge with a progress bar and a "resume course" CTA button.
function renderProgressReminderEmail(p: {
  fullName: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  inactiveDays: number;
  courseUrl: string;
}): string {
  const pct = Math.max(0, Math.min(100, p.progressPercentage));

  return `
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Tiếp tục khóa học của bạn nhé!</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(15,23,42,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#4f46e5;padding:22px 32px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.2px;">English Learning Platform</span>
                </td>
              </tr>
              <!-- Emoji + title -->
              <tr>
                <td align="center" style="padding:32px 32px 0;">
                  <div style="width:64px;height:64px;line-height:64px;border-radius:50%;background:#eef2ff;color:#4f46e5;font-size:34px;">📚</div>
                  <h1 style="margin:18px 0 0;font-size:22px;font-weight:700;color:#0f172a;">Đừng bỏ dở giữa chừng nhé!</h1>
                </td>
              </tr>
              <!-- Greeting -->
              <tr>
                <td style="padding:16px 32px 0;font-size:15px;line-height:1.6;color:#334155;">
                  Xin chào <strong>${p.fullName || "bạn"}</strong>, đã <strong>${p.inactiveDays} ngày</strong> bạn chưa học bài mới trong khóa <strong>"${p.courseTitle}"</strong>. Chỉ cần vài phút mỗi ngày để giữ nhịp và sớm hoàn thành thôi! 🔥
                </td>
              </tr>
              <!-- Progress card -->
              <tr>
                <td style="padding:24px 32px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                    <tr>
                      <td style="padding:18px 20px;">
                        <div style="font-size:13px;color:#64748b;margin-bottom:10px;">
                          Tiến độ của bạn: <strong style="color:#0f172a;">${p.completedLessons}/${p.totalLessons} bài</strong> (${pct}%)
                        </div>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e2e8f0;border-radius:999px;height:12px;">
                          <tr>
                            <td width="${pct}%" style="background:#4f46e5;border-radius:999px;height:12px;line-height:12px;font-size:0;">&nbsp;</td>
                            <td style="font-size:0;line-height:12px;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- CTA -->
              <tr>
                <td align="center" style="padding:28px 32px 0;">
                  <a href="${p.courseUrl}" target="_blank" rel="noopener"
                     style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:10px;">
                    Tiếp tục học ngay
                  </a>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:28px 32px 32px;">
                  <div style="border-top:1px solid #e2e8f0;padding-top:18px;font-size:12px;line-height:1.6;color:#94a3b8;">
                    Bạn nhận được email này vì đang theo học một khóa trên nền tảng. Đây là email tự động, vui lòng không trả lời trực tiếp.<br/>
                    © English Learning Platform — Đội ngũ hỗ trợ.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

/**
 * "Behind on your course" sweeper (Duolingo-style). For each still-valid
 * enrollment whose learner hasn't completed a lesson in
 * PROGRESS_REMINDER_INACTIVITY_DAYS and hasn't finished the course, send an
 * in-app notification + email and stamp lastProgressReminderAt so we don't
 * re-nag before PROGRESS_REMINDER_REPEAT_DAYS. Only ACTIVE courses with lessons
 * qualify. Capped at PROGRESS_REMINDER_MAX_PER_SWEEP per run.
 */
async function sweepProgressReminders(): Promise<void> {
  const prisma = databaseService.getClient();
  const now = Date.now();
  const nowDate = new Date();
  const inactivityCutoff = new Date(now - PROGRESS_REMINDER_INACTIVITY_DAYS * DAY_MS);
  const repeatCutoff = new Date(now - PROGRESS_REMINDER_REPEAT_DAYS * DAY_MS);

  // Candidate enrollments: still valid (not expired) AND either never reminded
  // or last reminded before the repeat window. Over-fetch then dedup in code.
  const candidates = await prisma.userActivity.findMany({
    where: {
      AND: [
        { OR: [{ expiresAt: null }, { expiresAt: { gt: nowDate } }] },
        { OR: [{ lastProgressReminderAt: null }, { lastProgressReminderAt: { lte: repeatCutoff } }] },
      ],
    },
    select: { id: true, userId: true, courseId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: PROGRESS_REMINDER_MAX_PER_SWEEP * 3,
  });
  if (!candidates.length) return;

  // One enrollment per (userId, courseId) — keep the most recent (already sorted).
  const seen = new Set<string>();
  const enrollments: typeof candidates = [];
  for (const c of candidates) {
    const key = `${c.userId}:${c.courseId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    enrollments.push(c);
  }

  // Load referenced courses — only ACTIVE ones with lessons get reminders.
  const courseIds = [...new Set(enrollments.map((e) => e.courseId))];
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds }, status: "ACTIVE" as CourseStatus },
    select: { id: true, title: true, lessons: { select: { id: true } } },
  });
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  interface ReminderTarget {
    userId: string;
    courseId: string;
    courseTitle: string;
    completed: number;
    total: number;
    inactiveDays: number;
  }
  const targets: ReminderTarget[] = [];

  for (const e of enrollments) {
    if (targets.length >= PROGRESS_REMINDER_MAX_PER_SWEEP) break;
    const course = courseMap.get(e.courseId);
    if (!course) continue; // course not ACTIVE / not found
    const total = course.lessons.length;
    if (total === 0) continue;

    const userLessons = await prisma.userLesson.findMany({
      where: { userId: e.userId, lessonId: { in: course.lessons.map((l) => l.id) } },
      select: { completedAt: true },
    });
    const completed = userLessons.length;
    if (completed >= total) continue; // already finished — no nudge

    // Last study activity = most recent lesson completion, else enrollment date
    // (covers learners who bought but never started a single lesson).
    let lastActivity = e.createdAt;
    for (const ul of userLessons) {
      if (ul.completedAt > lastActivity) lastActivity = ul.completedAt;
    }
    if (lastActivity > inactivityCutoff) continue; // studied recently — skip

    targets.push({
      userId: e.userId,
      courseId: e.courseId,
      courseTitle: course.title,
      completed,
      total,
      inactiveDays: Math.max(1, Math.floor((now - lastActivity.getTime()) / DAY_MS)),
    });
  }
  if (!targets.length) return;

  // Batch-fetch contact info for everyone who needs a nudge.
  const usersMap = await identityClient.getUsersBasicInfo([...new Set(targets.map((t) => t.userId))]);

  let sent = 0;
  for (const t of targets) {
    const user = usersMap.get(t.userId);
    const fullName = user?.fullName || "bạn";
    const progressPercentage = Math.round((t.completed / t.total) * 100);
    const courseUrl = `${FRONTEND_URL}/courses/${t.courseId}`;

    // In-app notification (fire-and-forget; client swallows transport errors).
    await notificationClient.createNotification({
      userId: t.userId,
      title: "Đừng bỏ dở khóa học nhé! 📚",
      content: `Bạn đã hoàn thành ${t.completed}/${t.total} bài của "${t.courseTitle}" và đã ${t.inactiveDays} ngày chưa học bài mới. Quay lại học tiếp để giữ nhịp nào!`,
      type: "COURSE_PROGRESS_REMINDER",
      courseId: t.courseId,
      metadata: {
        completedLessons: t.completed,
        totalLessons: t.total,
        progressPercentage,
        inactiveDays: t.inactiveDays,
      },
    });

    // Email (best-effort) — only when we have an address.
    if (user?.email) {
      await notificationClient.sendEmail({
        to: user.email,
        subject: `Tiếp tục khóa học "${t.courseTitle}" nhé! 🔥`,
        html: renderProgressReminderEmail({
          fullName,
          courseTitle: t.courseTitle,
          completedLessons: t.completed,
          totalLessons: t.total,
          progressPercentage,
          inactiveDays: t.inactiveDays,
          courseUrl,
        }),
      });
    }

    // Stamp ALL enrollments for this user+course so the repeat window applies
    // no matter which row we picked.
    await prisma.userActivity.updateMany({
      where: { userId: t.userId, courseId: t.courseId },
      data: { lastProgressReminderAt: nowDate },
    });
    sent++;
  }

  console.log(`📚 [Course Service] Progress reminders sent: ${sent}`);
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

    // Progress reminders run on a slower cadence than the 60s outbox poll.
    if (Date.now() - lastReminderSweepAt >= PROGRESS_REMINDER_SWEEP_INTERVAL_MS) {
      lastReminderSweepAt = Date.now();
      try {
        await sweepProgressReminders();
      } catch (err) {
        console.error("[Course Service] Progress-reminder sweeper error:", err);
      }
    }
  }, POLL_INTERVAL_MS);

  console.log(
    "⏰ [Course Service] Notification outbox + quality-flag + progress-reminder cron started (60s interval)"
  );
}
