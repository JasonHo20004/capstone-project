// =============================================================================
// Admin Moderation Routes — review and resolve user-flagged comments.
// =============================================================================

import { Router, Request, Response } from "express";
import { authenticateToken, requireAdmin, asyncHandler } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";

const router: ReturnType<typeof Router> = Router();

// GET /api/admin/moderation/reports?status=PENDING|RESOLVED_REMOVED|RESOLVED_KEPT|DISMISSED&page=&limit=
// Lists reports, newest first. Defaults to PENDING.
router.get(
  "/reports",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const statusParam = (req.query.status as string | undefined)?.toUpperCase();
    const status =
      statusParam === "RESOLVED_REMOVED" ||
      statusParam === "RESOLVED_KEPT" ||
      statusParam === "DISMISSED" ||
      statusParam === "PENDING"
        ? statusParam
        : "PENDING";

    const where = { status };
    const [reports, total] = await Promise.all([
      (prisma as any).commentReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          comment: {
            select: {
              id: true,
              content: true,
              userId: true,
              createdAt: true,
              hiddenAt: true,
              hiddenReason: true,
              lessonId: true,
              parentCommentId: true,
              lesson: {
                select: {
                  id: true,
                  title: true,
                  course: { select: { id: true, title: true, courseSellerId: true } },
                },
              },
            },
          },
        },
      }),
      (prisma as any).commentReport.count({ where }),
    ]);

    // Batched user enrichment to avoid N+1 against identity-service.
    const userIds = [
      ...new Set(
        (reports as any[]).flatMap((r) => [r.reporterId, r.comment.userId])
      ),
    ];
    const usersMap = await identityClient.getUsersBasicInfo(userIds);

    const enriched = (reports as any[]).map((r) => ({
      id: r.id,
      commentId: r.commentId,
      reasonType: r.reasonType,
      note: r.note,
      status: r.status,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
      resolutionNote: r.resolutionNote,
      reporter: {
        id: r.reporterId,
        fullName: usersMap.get(r.reporterId)?.fullName ?? "Người dùng",
      },
      comment: {
        id: r.comment.id,
        content: r.comment.content,
        createdAt: r.comment.createdAt,
        hiddenAt: r.comment.hiddenAt,
        author: {
          id: r.comment.userId,
          fullName: usersMap.get(r.comment.userId)?.fullName ?? "Người dùng",
        },
        lesson: {
          id: r.comment.lesson.id,
          title: r.comment.lesson.title,
          course: r.comment.lesson.course,
        },
      },
    }));

    res.json({
      success: true,
      data: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  })
);

// GET /api/admin/moderation/reports/summary — counts per status for the queue badge.
router.get(
  "/reports/summary",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const [pending, kept, removed, dismissed] = await Promise.all([
      (prisma as any).commentReport.count({ where: { status: "PENDING" } }),
      (prisma as any).commentReport.count({ where: { status: "RESOLVED_KEPT" } }),
      (prisma as any).commentReport.count({ where: { status: "RESOLVED_REMOVED" } }),
      (prisma as any).commentReport.count({ where: { status: "DISMISSED" } }),
    ]);
    res.json({ success: true, data: { pending, kept, removed, dismissed } });
  })
);

// POST /api/admin/moderation/reports/:id/resolve
// body: { action: "remove" | "keep" | "dismiss", note?: string }
//   - remove: delete the comment + mark ALL pending reports for it as RESOLVED_REMOVED
//   - keep: comment stays (unhide if it was auto-hidden) + mark this report RESOLVED_KEPT
//   - dismiss: this single report is spam/invalid → DISMISSED, others stay
router.post(
  "/reports/:id/resolve",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const reportId = req.params.id as string;
    const adminId = req.user!.userId as string;
    const { action, note } = req.body as { action?: string; note?: string };

    if (action !== "remove" && action !== "keep" && action !== "dismiss") {
      res.status(400).json({ success: false, message: "action phải là remove | keep | dismiss" });
      return;
    }

    const report = await (prisma as any).commentReport.findUnique({
      where: { id: reportId },
      select: { id: true, commentId: true, status: true },
    });
    if (!report) {
      res.status(404).json({ success: false, message: "Báo cáo không tồn tại" });
      return;
    }
    if (report.status !== "PENDING") {
      res.status(400).json({ success: false, message: `Báo cáo đã ở trạng thái ${report.status}` });
      return;
    }

    const trimmedNote = typeof note === "string" && note.trim() ? note.trim().slice(0, 500) : null;
    const now = new Date();

    if (action === "remove") {
      await prisma.$transaction([
        (prisma as any).commentReport.updateMany({
          where: { commentId: report.commentId, status: "PENDING" },
          data: {
            status: "RESOLVED_REMOVED",
            resolvedById: adminId,
            resolvedAt: now,
            resolutionNote: trimmedNote,
          },
        }),
        prisma.comment.delete({ where: { id: report.commentId } }),
      ]);
      res.json({ success: true, message: "Đã xoá bình luận và đóng các báo cáo liên quan" });
      return;
    }

    if (action === "keep") {
      await prisma.$transaction([
        prisma.comment.update({
          where: { id: report.commentId },
          data: { hiddenAt: null, hiddenReason: null } as any,
        }),
        (prisma as any).commentReport.updateMany({
          where: { commentId: report.commentId, status: "PENDING" },
          data: {
            status: "RESOLVED_KEPT",
            resolvedById: adminId,
            resolvedAt: now,
            resolutionNote: trimmedNote,
          },
        }),
      ]);
      res.json({ success: true, message: "Giữ bình luận và đóng các báo cáo liên quan" });
      return;
    }

    await (prisma as any).commentReport.update({
      where: { id: reportId },
      data: {
        status: "DISMISSED",
        resolvedById: adminId,
        resolvedAt: now,
        resolutionNote: trimmedNote,
      },
    });
    res.json({ success: true, message: "Đã bỏ qua báo cáo này" });
  })
);

export default router;
