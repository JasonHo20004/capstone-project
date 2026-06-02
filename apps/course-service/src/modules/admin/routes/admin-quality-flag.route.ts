// =============================================================================
// Admin Quality-Flag Routes
//
// Lets an admin flag an already-published (ACTIVE) course as "Chưa đạt yêu cầu",
// record the seller's fix confirmation, and remove the flag. The whole lifecycle
// is stored as CourseReviewHistory rows (see quality-flag.helper.ts) — no schema
// changes. A 48h sweeper (notification.cron.ts) auto-reverts unconfirmed flags
// to DRAFT without refunding/revoking existing buyers.
// =============================================================================

import { Router, Request, Response } from "express";
import { authenticateToken, requireAdmin, asyncHandler } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import { notificationClient } from "../../../clients/notification.client.js";
import {
  QF,
  FLAG_TTL_MS,
  deriveQualityFlag,
} from "../helpers/quality-flag.helper.js";
import type { CourseStatus } from "../../../../generated/prisma/index.js";

const router: ReturnType<typeof Router> = Router();

const MIN_REASON_LEN = 10;

function formatDeadline(deadlineAt: Date): string {
  return deadlineAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

function buildFlagEmailHtml(courseTitle: string, reason: string, deadlineAt: Date): string {
  return `
    <p>Xin chào,</p>
    <p>Khoá học <strong>"${courseTitle}"</strong> của bạn đã bị quản trị viên đánh dấu
    <strong>"Chưa đạt yêu cầu"</strong> và cần được chỉnh sửa.</p>
    <p><strong>Lý do / nội dung cần chỉnh sửa:</strong><br/>${reason}</p>
    <p><strong>Hạn chót: ${formatDeadline(deadlineAt)}</strong> (48 giờ kể từ khi bị đánh cờ).</p>
    <p>Sau khi đã chỉnh sửa xong, vui lòng <strong>gửi email xác nhận đã sửa</strong> cho quản trị viên.
    Quản trị viên sẽ đọc email và xác nhận thủ công trong hệ thống.</p>
    <p><strong>Lưu ý:</strong> Nếu quản trị viên không ghi nhận xác nhận chỉnh sửa của bạn trong vòng 48 giờ,
    khoá học sẽ <strong>tự động chuyển về trạng thái Bản nháp (Draft)</strong>.</p>
    <p>Khi ở trạng thái Draft, khoá học sẽ <strong>không còn được bán/công khai cho học viên mới</strong>
    và <strong>không tạo doanh thu mới</strong>. Học viên đã mua trước đó vẫn tiếp tục học bình thường.</p>
  `;
}

/**
 * Notify the seller (in-app + email) that their course was flagged.
 * Fire-and-forget — notification failures must not block the flag action.
 */
async function notifySellerFlagged(
  sellerId: string,
  courseId: string,
  courseTitle: string,
  reason: string,
  deadlineAt: Date
): Promise<void> {
  const seller = await identityClient.getUserBasicInfo(sellerId);

  await notificationClient.createNotification({
    userId: sellerId,
    title: "Khoá học bị đánh dấu chưa đạt yêu cầu",
    content: `Khoá học "${courseTitle}" cần chỉnh sửa. Lý do: ${reason}. Hạn xác nhận: ${formatDeadline(deadlineAt)}. Nếu không có xác nhận trong 48h, khoá học sẽ tự động chuyển về Draft.`,
    type: "COURSE_QUALITY_FLAGGED",
    courseId,
    metadata: { reason, deadlineAt },
  });

  if (seller?.email) {
    await notificationClient.sendEmail({
      to: seller.email,
      subject: `[Cần chỉnh sửa] Khoá học "${courseTitle}" chưa đạt yêu cầu`,
      html: buildFlagEmailHtml(courseTitle, reason, deadlineAt),
    });
  }
}

// POST /api/admin/courses/:id/quality-flag  body: { reason }
// Flag an ACTIVE course as "Chưa đạt yêu cầu". Course stays ACTIVE; a 48h timer
// starts (deadline derived from the QF_OPEN row's createdAt).
router.post(
  "/courses/:id/quality-flag",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const courseId = req.params.id as string;
    const adminId = req.user!.userId as string;
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";

    if (reason.length < MIN_REASON_LEN) {
      res.status(400).json({
        success: false,
        message: `Cần nhập lý do/yêu cầu chỉnh sửa (ít nhất ${MIN_REASON_LEN} ký tự).`,
      });
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { reviewHistory: true },
    });
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    if (course.status !== ("ACTIVE" as CourseStatus)) {
      res.status(400).json({
        success: false,
        message: "Chỉ có thể đánh cờ khoá học đang ở trạng thái Hoạt động (ACTIVE).",
      });
      return;
    }
    if (deriveQualityFlag(course.reviewHistory)) {
      res.status(409).json({
        success: false,
        message: "Khoá học đang có cờ 'Chưa đạt yêu cầu'. Hãy xử lý cờ hiện tại trước.",
      });
      return;
    }

    await prisma.courseReviewHistory.create({
      data: {
        courseId,
        fromStatus: "ACTIVE" as CourseStatus,
        toStatus: "ACTIVE" as CourseStatus,
        actorId: adminId,
        actorRole: "admin",
        reason: `${QF.OPEN}|${reason}`,
      },
    });

    const deadlineAt = new Date(Date.now() + FLAG_TTL_MS);
    try {
      await notifySellerFlagged(course.courseSellerId, courseId, course.title, reason, deadlineAt);
    } catch (err) {
      console.error("[Admin] Failed to notify seller of quality flag:", err);
    }

    res.json({
      success: true,
      message: "Đã đánh dấu khoá học là 'Chưa đạt yêu cầu' và thông báo cho seller.",
      data: { reason, flaggedAt: new Date(), deadlineAt, confirmed: false },
    });
  })
);

// POST /api/admin/courses/:id/quality-flag/confirm
// Record that the admin received the seller's fix confirmation. Cancels the
// 48h auto-draft (the sweeper ignores confirmed flags). Flag stays active until
// the admin removes it.
router.post(
  "/courses/:id/quality-flag/confirm",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const courseId = req.params.id as string;
    const adminId = req.user!.userId as string;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { reviewHistory: true },
    });
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const flag = deriveQualityFlag(course.reviewHistory);
    if (!flag) {
      res.status(400).json({ success: false, message: "Khoá học không có cờ 'Chưa đạt yêu cầu' đang mở." });
      return;
    }
    if (flag.confirmed) {
      res.status(400).json({ success: false, message: "Đã ghi nhận xác nhận chỉnh sửa trước đó." });
      return;
    }

    await prisma.courseReviewHistory.create({
      data: {
        courseId,
        fromStatus: "ACTIVE" as CourseStatus,
        toStatus: "ACTIVE" as CourseStatus,
        actorId: adminId,
        actorRole: "admin",
        reason: QF.CONFIRMED,
      },
    });

    res.json({
      success: true,
      message: "Đã ghi nhận xác nhận chỉnh sửa. Khoá học sẽ không tự động chuyển về Draft.",
    });
  })
);

// DELETE /api/admin/courses/:id/quality-flag
// Remove the flag after re-checking the course. Cancels the timer. Course stays
// ACTIVE.
router.delete(
  "/courses/:id/quality-flag",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const courseId = req.params.id as string;
    const adminId = req.user!.userId as string;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { reviewHistory: true },
    });
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const flag = deriveQualityFlag(course.reviewHistory);
    if (!flag) {
      res.status(400).json({ success: false, message: "Khoá học không có cờ 'Chưa đạt yêu cầu' đang mở." });
      return;
    }

    await prisma.courseReviewHistory.create({
      data: {
        courseId,
        fromStatus: "ACTIVE" as CourseStatus,
        toStatus: "ACTIVE" as CourseStatus,
        actorId: adminId,
        actorRole: "admin",
        reason: QF.CLEARED,
      },
    });

    // Optional courtesy notice to the seller that the course passed re-check.
    try {
      await notificationClient.createNotification({
        userId: course.courseSellerId,
        title: "Khoá học đã được xác nhận đạt yêu cầu",
        content: `Khoá học "${course.title}" đã được quản trị viên xác nhận đạt yêu cầu. Cờ 'Chưa đạt yêu cầu' đã được gỡ.`,
        type: "COURSE_QUALITY_FLAG_CLEARED",
        courseId,
      });
    } catch (err) {
      console.error("[Admin] Failed to notify seller of flag removal:", err);
    }

    res.json({ success: true, message: "Đã gỡ cờ 'Chưa đạt yêu cầu'." });
  })
);

export default router;
