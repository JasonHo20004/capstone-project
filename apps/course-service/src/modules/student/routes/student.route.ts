// =============================================================================
// Student Learning Routes - Express Router Configuration
// =============================================================================

import { Router, type Request, type Response } from "express";
import { authenticateToken, asyncHandler } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import { notificationClient } from "../../../clients/notification.client.js";
import { reportLimiter } from "../../../middleware/rateLimiter.middleware.js";

// Thresholds kept in sync with the legacy /courses/:id endpoints.
const COMMENT_AUTO_HIDE_THRESHOLD = 3;
const COMMENT_EDIT_HISTORY_MAX = 10;

const router: Router = Router();

// GET /student/courses/:courseId/context
router.get(
  "/courses/:courseId/context",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const userId = req.user!.userId as string;
    const prisma = databaseService.getClient();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: { orderBy: { lessonOrder: "asc" } },
      },
    });

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const hasAccess = await prisma.userActivity.findFirst({
      where: { userId, courseId },
    });

    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    const completedLessons = await prisma.userLesson.findMany({
      where: {
        userId,
        lessonId: { in: course.lessons.map((l: { id: string }) => l.id) },
      },
    });

    const completedIds = new Set(completedLessons.map((cl: { lessonId: string }) => cl.lessonId));

    const syllabus = course.lessons.map((lesson: { id: string; title: string; description: string | null; lessonOrder: number | null; durationInSeconds: number | null }) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      lessonOrder: lesson.lessonOrder,
      durationInSeconds: lesson.durationInSeconds,
      isCompleted: completedIds.has(lesson.id),
    }));

    const totalLessons = syllabus.length;
    const completedCount = completedLessons.length;

    // Fetch instructor info from identity service (best-effort)
    const instructor = await identityClient.getUserBasicInfo(course.courseSellerId).catch(() => null);

    res.json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          description: course.description ?? null,
          category: course.category ?? null,
          courseLevel: course.courseLevel ?? null,
          totalLessons,
          totalRatings: course.ratingCount ?? 0,
          instructor: {
            id: instructor?.id ?? course.courseSellerId,
            fullName: instructor?.fullName ?? "Giảng viên",
            profilePicture: instructor?.profilePicture ?? null,
          },
        },
        progress: {
          completedLessons: completedCount,
          totalLessons,
          progressPercentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        },
        syllabus,
      },
    });
  })
);

// GET /student/courses/:courseId/lessons/:lessonId
router.get(
  "/courses/:courseId/lessons/:lessonId",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const lessonId = req.params.lessonId as string;
    const userId = req.user!.userId as string;
    const prisma = databaseService.getClient();

    const hasAccess = await prisma.userActivity.findFirst({
      where: { userId, courseId },
    });

    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, courseId },
      include: { mediaAssets: true },
    });

    if (!lesson) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }

    const userLesson = await prisma.userLesson.findUnique({
      where: { lessonId_userId: { lessonId, userId } },
    });

    res.json({
      success: true,
      data: { ...lesson, isCompleted: !!userLesson },
    });
  })
);

// ── Certificate helpers ────────────────────────────────────────────────────────

function generateCertNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `CERT-${year}-${rand}`;
}

async function tryIssueCertificate(
  prisma: any,
  userId: string,
  courseId: string,
  userName: string,
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { select: { id: true } } },
  });
  if (!course) return null;

  const totalLessons = course.lessons.length;
  if (totalLessons === 0) return null;

  const completedCount = await prisma.userLesson.count({
    where: { userId, lessonId: { in: course.lessons.map((l: { id: string }) => l.id) } },
  });

  // Only issue when ALL lessons done and course has no finalTest
  // (courses with a finalTest issue the cert via POST .../certificate/issue after passing)
  if (completedCount < totalLessons || course.finalTestId) return null;

  return prisma.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      certificateNumber: generateCertNumber(),
      userId,
      courseId,
      userName,
      courseName: course.title,
      courseLevel: course.courseLevel ?? null,
    },
    update: {},
  });
}

// POST /student/courses/:courseId/lessons/:lessonId/complete
router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const lessonId = req.params.lessonId as string;
    const userId = req.user!.userId as string;
    const userName: string = (req.user as any)?.fullName ?? (req.user as any)?.name ?? "Học viên";
    const prisma = databaseService.getClient();

    const hasAccess = await prisma.userActivity.findFirst({
      where: { userId, courseId },
    });

    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    await prisma.userLesson.upsert({
      where: { lessonId_userId: { lessonId, userId } },
      create: { lessonId, userId },
      update: {},
    });

    // Auto-issue certificate if this was the last lesson (no finalTest courses)
    const cert = await tryIssueCertificate(prisma, userId, courseId, userName);

    res.json({
      success: true,
      message: "Lesson marked as complete",
      data: { certificateIssued: !!cert, certificate: cert ?? null },
    });
  })
);

// GET /student/courses/:courseId/lessons/:lessonId/comments
router.get(
  "/courses/:courseId/lessons/:lessonId/comments",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const lessonId = req.params.lessonId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const prisma = databaseService.getClient();

    // Students never see auto-hidden comments — keeps abusive content out of
    // the public thread until admin resolves the reports.
    const where = { lessonId, hiddenAt: null };
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    // Enrich with user info
    const userIds = [...new Set(comments.map((c) => c.userId))];
    const usersMap = await identityClient.getUsersBasicInfo(userIds);

    const enrichedComments = comments.map((c) => {
      const user = usersMap.get(c.userId);
      return {
        ...c,
        user: user ? { fullName: user.fullName, profilePicture: user.profilePicture } : null,
      };
    });

    res.json({ success: true, data: { comments: enrichedComments, total, page, limit } });
  })
);

// POST /student/courses/:courseId/lessons/:lessonId/comments
router.post(
  "/courses/:courseId/lessons/:lessonId/comments",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const lessonId = req.params.lessonId as string;
    const userId = req.user!.userId as string;
    const { content, parentCommentId } = req.body;
    const prisma = databaseService.getClient();

    const comment = await prisma.comment.create({
      data: {
        content,
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

// GET /student/courses/:courseId/ratings
router.get(
  "/courses/:courseId/ratings",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const prisma = databaseService.getClient();

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { courseId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rating.count({ where: { courseId } }),
    ]);

    const avgResult = await prisma.rating.aggregate({
      where: { courseId },
      _avg: { score: true },
    });

    res.json({
      success: true,
      data: ratings,
      averageScore: avgResult._avg?.score || 0,
      pagination: { total, page, limit },
    });
  })
);

// GET /student/courses/:courseId/final-test
// Returns final test info + eligibility (all lessons completed?)
router.get(
  "/courses/:courseId/final-test",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const userId = req.user!.userId as string;
    const prisma = databaseService.getClient();

    // Check access
    const hasAccess = await prisma.userActivity.findFirst({
      where: { userId, courseId },
    });

    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    // Get course with lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: true },
    });

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    if (!course.finalTestId) {
      res.json({
        success: true,
        data: { hasFinalTest: false, finalTestId: null, isEligible: false },
      });
      return;
    }

    // Check how many lessons are completed
    const totalLessons = course.lessons.length;
    const completedCount = await prisma.userLesson.count({
      where: {
        userId,
        lessonId: { in: course.lessons.map((l: { id: string }) => l.id) },
      },
    });

    const isEligible = totalLessons > 0 && completedCount >= totalLessons;

    res.json({
      success: true,
      data: {
        hasFinalTest: true,
        finalTestId: course.finalTestId,
        isEligible,
        totalLessons,
        completedLessons: completedCount,
      },
    });
  })
);

// PATCH /student/courses/:courseId/lessons/:lessonId/comments/:commentId
// Author-only edit — even the course seller cannot edit student comments
// (that would let them gaslight learners).
router.patch(
  "/courses/:courseId/lessons/:lessonId/comments/:commentId",
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
      res.json({ success: true, data: existing, unchanged: true });
      return;
    }

    const prevHistory: Array<{ content: string; editedAt: string }> =
      Array.isArray((existing as any).editHistory) ? ((existing as any).editHistory as any) : [];
    const prevTimestamp = ((existing as any).editedAt ?? existing.createdAt) as Date;
    prevHistory.push({
      content: existing.content,
      editedAt: prevTimestamp instanceof Date ? prevTimestamp.toISOString() : new Date(prevTimestamp).toISOString(),
    });
    const trimmedHistory = prevHistory.slice(-COMMENT_EDIT_HISTORY_MAX);

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

// POST /student/courses/:courseId/lessons/:lessonId/comments/:commentId/report
router.post(
  "/courses/:courseId/lessons/:lessonId/comments/:commentId/report",
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
      if (err?.code === "P2002") {
        res.status(409).json({ success: false, message: "Bạn đã báo cáo bình luận này rồi" });
        return;
      }
      throw err;
    }

    const pendingCount = await (prisma as any).commentReport.count({
      where: { commentId, status: "PENDING" },
    });
    let autoHidden = false;
    if (pendingCount >= COMMENT_AUTO_HIDE_THRESHOLD) {
      const before = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { hiddenAt: true } as any,
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

// GET /student/courses/:courseId/certificate
// Returns the certificate if it exists, or { data: null } if the student has
// not earned it yet. A not-yet-issued certificate is a normal state (the
// student simply hasn't finished the course), NOT an error — so we respond 200
// with a null payload instead of 404 to avoid noisy "Certificate not found"
// errors every time a student opens a course they're still studying.
router.get(
  "/courses/:courseId/certificate",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const userId = req.user!.userId as string;
    const prisma = databaseService.getClient();

    const cert = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    res.json({ success: true, data: cert ?? null });
  })
);

// POST /student/courses/:courseId/certificate/issue
// Manually issue a certificate — used for courses with a finalTest after the
// student passes (the assessment-service doesn't write into this DB, so the
// frontend calls this endpoint after receiving a passing score).
router.post(
  "/courses/:courseId/certificate/issue",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const userId = req.user!.userId as string;
    const userName: string = (req.user as any)?.fullName ?? (req.user as any)?.name ?? "Học viên";
    const prisma = databaseService.getClient();

    const hasAccess = await prisma.userActivity.findFirst({
      where: { userId, courseId },
    });
    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    // Verify all lessons are completed
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: { select: { id: true } } },
    });
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const totalLessons = course.lessons.length;
    const completedCount = await prisma.userLesson.count({
      where: { userId, lessonId: { in: course.lessons.map((l: { id: string }) => l.id) } },
    });

    if (totalLessons > 0 && completedCount < totalLessons) {
      res.status(400).json({ success: false, message: "Not all lessons completed yet" });
      return;
    }

    const cert = await prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        certificateNumber: generateCertNumber(),
        userId,
        courseId,
        userName,
        courseName: course.title,
        courseLevel: course.courseLevel ?? null,
      },
      update: {},
    });

    res.status(201).json({ success: true, data: cert });
  })
);

export default router;
