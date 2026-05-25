// =============================================================================
// Course Routes - Express routes for course operations
// =============================================================================

import { Router, Request, Response } from "express";
import multer from "multer";
import { CourseController } from "../controllers/course.controller.js";
import { ModuleController } from "../controllers/module.controller.js";
import { authenticateToken, requireSeller, optionalAuth, validate, asyncHandler } from "@capstone/common";
import { uploadLimiter, createCourseLimiter, reportLimiter } from "../../../middleware/rateLimiter.middleware.js";
import { createCourseSchema, updateCourseSchema, getCoursesQuerySchema } from "../dtos/course.dto.js";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import { notificationClient } from "../../../clients/notification.client.js";

const router: ReturnType<typeof Router> = Router();
const courseController = new CourseController();
const moduleController = new ModuleController();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 1024 } }); // 1GB

// Public routes
router.get("/published", optionalAuth, validate(getCoursesQuerySchema), courseController.getPublished);

// Enrolled courses - must be before /:id
router.get("/enrolled", authenticateToken, courseController.getEnrolled);

router.get("/:id", optionalAuth, courseController.getById);

// Seller routes - must be before /:id to avoid "seller" matching as id
router.get("/seller/my-courses", authenticateToken, requireSeller, courseController.getMyCourses);
router.get("/seller/me", authenticateToken, requireSeller, courseController.getMyCourses);
router.post("/seller/sync-course-tests", authenticateToken, requireSeller, courseController.syncMyCourseTests);
router.get("/seller/:sellerId", optionalAuth, validate(getCoursesQuerySchema), courseController.getBySellerId);
// POST/PATCH accept multipart so seller can upload `thumbnail`. Multer must run
// BEFORE zod validate so req.body is populated from the form.
router.post(
  "/",
  authenticateToken,
  requireSeller,
  createCourseLimiter,
  upload.single("thumbnail"),
  validate(createCourseSchema),
  courseController.create
);
router.patch(
  "/:id",
  authenticateToken,
  requireSeller,
  upload.single("thumbnail"),
  validate(updateCourseSchema),
  courseController.update
);
router.post("/:id/publish", authenticateToken, requireSeller, courseController.publish);
router.get("/:id/review-history", authenticateToken, requireSeller, courseController.getReviewHistory);
router.put("/:id/final-test", authenticateToken, requireSeller, courseController.setFinalTest);
router.delete("/:id/final-test", authenticateToken, requireSeller, courseController.removeFinalTest);
router.delete("/:id", authenticateToken, requireSeller, courseController.delete);

// Lesson routes (uses multer to parse FormData for creation)
router.get("/:id/lessons/:lessonId", authenticateToken, courseController.getLessonById);
router.post("/:id/lessons", authenticateToken, requireSeller, uploadLimiter, upload.single('video'), courseController.createLesson);
router.patch("/:id/lessons/:lessonId", authenticateToken, requireSeller, upload.single('video'), courseController.updateLesson);
router.delete("/:id/lessons/:lessonId", authenticateToken, requireSeller, courseController.deleteLesson);

// Comment routes for lessons
router.get(
  "/:id/lessons/:lessonId/comments",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id as string;
    const lessonId = req.params.lessonId as string;
    const requesterId = req.user!.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const prisma = databaseService.getClient();

    // Get course to know the seller (owner can see hidden comments to moderate).
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseSellerId: true },
    });
    const isCourseOwner = course?.courseSellerId === requesterId;

    // Hide auto-moderated comments from non-owners. The owner still sees them
    // (with a hiddenAt flag) so they can decide whether to keep or delete.
    const baseWhere = { lessonId } as const;
    const where = isCourseOwner ? baseWhere : { ...baseWhere, hiddenAt: null };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    // Enrich comments with user info from Identity Service
    const userIds = [...new Set(comments.map((c) => c.userId))];
    const usersMap = await identityClient.getUsersBasicInfo(userIds);

    const enrichedComments = comments.map((c) => {
      const user = usersMap.get(c.userId);
      return {
        ...c,
        user: user ? { fullName: user.fullName, profilePicture: user.profilePicture } : null,
      };
    });

    res.json({
      success: true,
      data: { comments: enrichedComments, total, page, limit, courseSellerId: course?.courseSellerId },
    });
  })
);

router.post(
  "/:id/lessons/:lessonId/comments",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id as string;
    const lessonId = req.params.lessonId as string;
    const userId = req.user!.userId as string;
    const { content, parentCommentId } = req.body;
    const prisma = databaseService.getClient();

    if (!content || typeof content !== "string" || !content.trim()) {
      res.status(400).json({ success: false, message: "Content is required" });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        lessonId,
        parentCommentId: parentCommentId || null,
      },
    });

    res.status(201).json({ success: true, data: comment });

    // Fire-and-forget notifications
    (async () => {
      try {
        const [course, lesson] = await Promise.all([
          prisma.course.findUnique({ where: { id: courseId }, select: { courseSellerId: true, title: true } }),
          prisma.lesson.findUnique({ where: { id: lessonId }, select: { title: true } }),
        ]);

        // Notify seller about new comment on their course
        if (course && course.courseSellerId !== userId) {
          notificationClient.createNotification({
            userId: course.courseSellerId,
            title: "Bình luận mới trên khóa học",
            content: `Có người đã bình luận trong bài học "${lesson?.title || ""}" của khóa học "${course.title}"`,
            type: "course_comment",
            courseId,
            metadata: { lessonId, commentId: comment.id },
          });
        }

        // Notify parent comment author about the reply
        if (parentCommentId) {
          const parentComment = await prisma.comment.findUnique({
            where: { id: parentCommentId },
            select: { userId: true },
          });
          if (parentComment && parentComment.userId !== userId) {
            notificationClient.createNotification({
              userId: parentComment.userId,
              title: "Có người trả lời bình luận của bạn",
              content: `Có người đã trả lời bình luận của bạn trong bài học "${lesson?.title || ""}"`,
              type: "comment_reply",
              courseId,
              metadata: { lessonId, commentId: comment.id, parentCommentId },
            });
          }
        }
      } catch (err) {
        console.error("[Course Service] Error sending comment notifications:", err);
      }
    })();
  })
);

// Threshold of distinct reports that auto-hides a comment until admin
// resolution. Kept low (3) for a small platform — bump as traffic grows.
const COMMENT_AUTO_HIDE_THRESHOLD = 3;
// Edit-history cap to bound row size when one user edits a comment many times.
const COMMENT_EDIT_HISTORY_MAX = 10;

// PATCH /api/courses/:id/lessons/:lessonId/comments/:commentId
// Author-only edit. Course owner CANNOT edit student comments (that would
// enable gaslighting — they can only delete via the seller moderation
// endpoint we added earlier).
router.patch(
  "/:id/lessons/:lessonId/comments/:commentId",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;
    const userId = req.user!.userId as string;
    const { content } = req.body as { content?: string };

    const trimmed = typeof content === "string" ? content.trim() : "";
    if (trimmed.length < 1 || trimmed.length > 2000) {
      res.status(400).json({ success: false, message: "Nội dung từ 1 đến 2000 ký tự" });
      return;
    }

    const prisma = databaseService.getClient();
    const existing = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Bình luận không tồn tại" });
      return;
    }
    if (existing.userId !== userId) {
      res.status(403).json({ success: false, message: "Chỉ tác giả mới được sửa bình luận" });
      return;
    }
    if (existing.content === trimmed) {
      // No-op edit — return success without bumping editedAt to avoid
      // flagging a comment as "edited" when nothing actually changed.
      res.json({ success: true, data: existing, unchanged: true });
      return;
    }

    // Push previous version onto editHistory (chronological, capped).
    const history: Array<{ content: string; editedAt: string }> =
      Array.isArray((existing as any).editHistory) ? ((existing as any).editHistory as any) : [];
    history.push({
      content: existing.content,
      editedAt: ((existing as any).editedAt ?? existing.createdAt).toISOString
        ? ((existing as any).editedAt ?? existing.createdAt).toISOString()
        : new Date((existing as any).editedAt ?? existing.createdAt).toISOString(),
    });
    const trimmedHistory = history.slice(-COMMENT_EDIT_HISTORY_MAX);

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: trimmed,
        editedAt: new Date(),
        editHistory: trimmedHistory as any,
      },
    });

    res.json({ success: true, data: updated });
  })
);

// POST /api/courses/:id/lessons/:lessonId/comments/:commentId/report
// Any authenticated user can flag a comment. Rate-limited + unique
// (commentId, reporterId) keeps brigading low-effort. Auto-hides the
// comment when distinct report count reaches COMMENT_AUTO_HIDE_THRESHOLD.
router.post(
  "/:id/lessons/:lessonId/comments/:commentId/report",
  authenticateToken,
  reportLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;
    const reporterId = req.user!.userId as string;
    const { reasonType, note } = req.body as { reasonType?: string; note?: string };

    const ALLOWED = new Set(["SPAM", "ABUSE", "SCAM", "MISINFORMATION", "OFF_TOPIC", "OTHER"]);
    if (!reasonType || !ALLOWED.has(reasonType)) {
      res.status(400).json({ success: false, message: "Chọn lý do báo cáo hợp lệ" });
      return;
    }

    const prisma = databaseService.getClient();
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, lessonId: true },
    });
    if (!comment) {
      res.status(404).json({ success: false, message: "Bình luận không tồn tại" });
      return;
    }
    if (comment.userId === reporterId) {
      res.status(400).json({ success: false, message: "Không thể tự báo cáo bình luận của mình" });
      return;
    }

    try {
      await (prisma as any).commentReport.create({
        data: {
          commentId,
          reporterId,
          reasonType,
          note: typeof note === "string" && note.trim() ? note.trim().slice(0, 500) : null,
        },
      });
    } catch (err: any) {
      // Unique violation = user already reported this comment.
      if (err?.code === "P2002") {
        res.status(409).json({ success: false, message: "Bạn đã báo cáo bình luận này rồi" });
        return;
      }
      throw err;
    }

    // Count distinct PENDING reports against this comment — if we just
    // crossed the auto-hide threshold, stamp hiddenAt.
    const pendingCount = await (prisma as any).commentReport.count({
      where: { commentId, status: "PENDING" },
    });
    let autoHidden = false;
    if (pendingCount >= COMMENT_AUTO_HIDE_THRESHOLD) {
      const before = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { hiddenAt: true },
      });
      if (!(before as any)?.hiddenAt) {
        await prisma.comment.update({
          where: { id: commentId },
          data: {
            hiddenAt: new Date(),
            hiddenReason: `Tự động ẩn sau ${pendingCount} báo cáo từ người dùng`,
          } as any,
        });
        autoHidden = true;
      }
    }

    res.status(201).json({
      success: true,
      message: autoHidden
        ? "Đã ghi nhận báo cáo. Bình luận đã được ẩn để chờ admin xử lý."
        : "Đã ghi nhận báo cáo. Cám ơn bạn đã giúp giữ cộng đồng lành mạnh.",
      data: { autoHidden, totalReports: pendingCount },
    });
  })
);

// Admin routes
router.get("/", authenticateToken, validate(getCoursesQuerySchema), courseController.getMany);

// Module routes (under /courses/:courseId/modules)
router.get("/:courseId/modules", optionalAuth, moduleController.getModules);
router.post("/:courseId/modules", authenticateToken, requireSeller, moduleController.createModule);
router.put("/:courseId/modules/:moduleId", authenticateToken, requireSeller, moduleController.updateModule);
router.delete("/:courseId/modules/:moduleId", authenticateToken, requireSeller, moduleController.deleteModule);

export default router;
