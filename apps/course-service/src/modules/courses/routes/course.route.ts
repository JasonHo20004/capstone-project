// =============================================================================
// Course Routes - Express routes for course operations
// =============================================================================

import { Router, Request, Response } from "express";
import multer from "multer";
import { CourseController } from "../controllers/course.controller.js";
import { ModuleController } from "../controllers/module.controller.js";
import { authenticateToken, requireSeller, optionalAuth, validate, asyncHandler } from "@capstone/common";
import { uploadLimiter, createCourseLimiter } from "../../../middleware/rateLimiter.middleware.js";
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
router.get("/seller/:sellerId", optionalAuth, validate(getCoursesQuerySchema), courseController.getBySellerId);
router.post("/", authenticateToken, requireSeller, createCourseLimiter, validate(createCourseSchema), courseController.create);
router.patch("/:id", authenticateToken, requireSeller, validate(updateCourseSchema), courseController.update);
router.post("/:id/publish", authenticateToken, requireSeller, courseController.publish);
router.put("/:id/final-test", authenticateToken, requireSeller, courseController.setFinalTest);
router.delete("/:id/final-test", authenticateToken, requireSeller, courseController.removeFinalTest);
router.delete("/:id", authenticateToken, requireSeller, courseController.delete);

// Lesson routes (uses multer to parse FormData for creation)
router.get("/:id/lessons/:lessonId", optionalAuth, courseController.getLessonById);
router.post("/:id/lessons", authenticateToken, requireSeller, uploadLimiter, upload.single('video'), courseController.createLesson);
router.patch("/:id/lessons/:lessonId", authenticateToken, requireSeller, upload.single('video'), courseController.updateLesson);

// Comment routes for lessons
router.get(
  "/:id/lessons/:lessonId/comments",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id as string;
    const lessonId = req.params.lessonId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const prisma = databaseService.getClient();

    // Get course to know the seller
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { courseSellerId: true } });

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { lessonId },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where: { lessonId } }),
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

// Admin routes
router.get("/", authenticateToken, validate(getCoursesQuerySchema), courseController.getMany);

// Module routes (under /courses/:courseId/modules)
router.get("/:courseId/modules", optionalAuth, moduleController.getModules);
router.post("/:courseId/modules", authenticateToken, requireSeller, moduleController.createModule);
router.put("/:courseId/modules/:moduleId", authenticateToken, requireSeller, moduleController.updateModule);
router.delete("/:courseId/modules/:moduleId", authenticateToken, requireSeller, moduleController.deleteModule);

export default router;
