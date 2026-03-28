// =============================================================================
// Student Learning Routes - Express Router Configuration
// =============================================================================

import { Router, type Request, type Response } from "express";
import { authenticateToken, asyncHandler } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import { notificationClient } from "../../../clients/notification.client.js";

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

    res.json({
      success: true,
      data: {
        courseId: course.id,
        courseTitle: course.title,
        totalLessons,
        completedLessons: completedCount,
        progressPercent: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
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

// POST /student/courses/:courseId/lessons/:lessonId/complete
router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
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

    await prisma.userLesson.upsert({
      where: { lessonId_userId: { lessonId, userId } },
      create: { lessonId, userId },
      update: {},
    });

    res.json({ success: true, message: "Lesson marked as complete" });
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

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { lessonId },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where: { lessonId } }),
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

export default router;
