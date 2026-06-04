// =============================================================================
// Admin Course Routes - Admin management of courses
// =============================================================================

import { Router, Request, Response } from "express";
import multer from "multer";
import { authenticateToken, requireAdmin, asyncHandler, EventNames, CoursePublishedEvent, CourseRejectedEvent } from "@capstone/common";
import { getEventBus } from "../../../server.js";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import { paymentClient } from "../../../clients/payment.client.js";
import { s3Service } from "../../../services/s3.service.js";
import { CourseRepository } from "../../courses/repositories/course.repository.js";
import { deriveQualityFlag } from "../helpers/quality-flag.helper.js";
import type { CourseStatus } from "../../../../generated/prisma/index.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB — same ceiling as seller upload
});
const courseRepository = new CourseRepository();

const REVOKE_STATUSES = new Set<CourseStatus>([
  "REFUSE" as CourseStatus,
  "INACTIVE" as CourseStatus,
]);

const router: ReturnType<typeof Router> = Router();

// GET /api/admin/courses - List all courses (admin view)
router.get(
  "/courses",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const query = req.query as any;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const search = query.search as string | undefined;
    const status = query.status as string | undefined;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { lessons: { select: { id: true } } },
      }),
      prisma.course.count({ where }),
    ]);

    // Enrich with seller names
    const sellerIds = [...new Set(courses.map((c) => c.courseSellerId))];
    const sellers = await identityClient.getUsersBasicInfo(sellerIds);

    const data = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      sellerName: sellers.get(course.courseSellerId)?.fullName,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: course.lessons.length,
      createdAt: course.createdAt,
    }));

    res.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  })
);

// GET /api/admin/courses/:id - Get course detail (admin view)
router.get(
  "/courses/:id",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const course = await prisma.course.findUnique({
      where: { id: req.params.id as string },
      include: {
        lessons: true,
        modules: true,
        reviewHistory: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const seller = await identityClient.getUserBasicInfo(course.courseSellerId);
    const qualityFlag = deriveQualityFlag(course.reviewHistory);

    res.json({
      success: true,
      data: {
        ...course,
        price: Number(course.price),
        sellerName: seller?.fullName,
        qualityFlag,
      },
    });
  })
);

// PUT /api/admin/courses/:id - Update course (admin - status changes, etc.)
router.put(
  "/courses/:id",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id } = req.params as { id: string };
    const { status, title, description, price, courseLevel, rejectionReason } = req.body;
    const adminId = req.user!.userId;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status as CourseStatus;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (courseLevel) updateData.courseLevel = courseLevel;

    const isApproval = updateData.status === "ACTIVE" && existing.status !== "ACTIVE";
    const isRejection = updateData.status === "REFUSE" && existing.status !== "REFUSE";

    // Require an explicit reason for rejection so the seller knows what to fix.
    // We accept the field as either `rejectionReason` (new) or pass nothing,
    // in which case we reject the request with 400.
    if (isRejection) {
      const reason = typeof rejectionReason === "string" ? rejectionReason.trim() : "";
      if (reason.length < 10) {
        res.status(400).json({
          success: false,
          message: "Cần nhập lý do từ chối (ít nhất 10 ký tự) để seller biết cách chỉnh sửa.",
        });
        return;
      }
      updateData.rejectionReason = reason;
      updateData.rejectedAt = new Date();
      updateData.reviewedById = adminId;
    }

    if (isApproval) {
      updateData.approvedAt = new Date();
      updateData.reviewedById = adminId;
      // Clear any stale rejection metadata from a prior bounce so the seller's
      // UI doesn't keep flashing a "rejected" banner after re-approval.
      updateData.rejectionReason = null;
      updateData.rejectedAt = null;
    }

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: { lessons: { select: { id: true } } },
    }) as any;

    // Append an audit-log row for every status transition the admin causes
    // (approval, rejection, manual ACTIVE→INACTIVE, etc.). Best-effort — a
    // history write failure shouldn't roll back the status change.
    if (updateData.status && updateData.status !== existing.status) {
      try {
        await (prisma as any).courseReviewHistory.create({
          data: {
            courseId: id,
            fromStatus: existing.status as CourseStatus,
            toStatus: updateData.status as CourseStatus,
            actorId: adminId,
            actorRole: "admin",
            reason: isRejection ? updateData.rejectionReason : null,
          },
        });
      } catch (err) {
        console.error("[Admin] Failed to write course review history:", err);
      }
    }

    // Emit RabbitMQ Event if course was just approved to ACTIVE
    if (isApproval) {
      const payload: CoursePublishedEvent = {
        courseId: course.id,
        sellerId: course.courseSellerId,
        title: course.title,
        price: Number(course.price)
      };

      const eventBus = getEventBus();
      if (eventBus) {
        console.log(`🐰 [CourseService] Publishing ${EventNames.COURSE_PUBLISHED}`);
        eventBus.publish(EventNames.COURSE_PUBLISHED, payload).catch(err => {
          console.error("Failed to publish COURSE_PUBLISHED via RabbitMQ:", err);
        });
      }
    }

    // Emit COURSE_REJECTED so the notification service can ping the seller.
    if (isRejection) {
      const payload: CourseRejectedEvent = {
        courseId: course.id,
        sellerId: course.courseSellerId,
        title: course.title,
        reason: updateData.rejectionReason,
        rejectedAt: updateData.rejectedAt,
        reviewerId: adminId,
      };
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish(EventNames.COURSE_REJECTED, payload).catch(err => {
          console.error("Failed to publish COURSE_REJECTED via RabbitMQ:", err);
        });
      }
    }

    // Course moved to REFUSE/INACTIVE → revoke buyer access + refund earnings.
    if (
      updateData.status &&
      REVOKE_STATUSES.has(updateData.status as CourseStatus) &&
      !REVOKE_STATUSES.has(existing.status as CourseStatus)
    ) {
      const reason = `course status changed to ${updateData.status}`;
      try {
        const refund = await paymentClient.refundCourse(id, reason);
        console.log(
          `💸 [CourseService] Refunded ${refund.refunded} earnings ` +
            `(${refund.totalRefunded}đ to ${refund.buyers} buyers) for course ${id}`
        );
      } catch (err) {
        console.error(
          `⚠️ [CourseService] refundCourse failed for ${id}, status change kept:`,
          err
        );
      }

      const deleted = await prisma.userActivity.deleteMany({ where: { courseId: id } });
      console.log(
        `🚫 [CourseService] Revoked access for ${deleted.count} learners on course ${id}`
      );
    }

    res.json({
      success: true,
      data: {
        ...course,
        price: Number(course.price),
        lessonCount: course.lessons.length,
      },
    });
  })
);

// DELETE /api/admin/courses/:id - Delete course (admin)
router.delete(
  "/courses/:id",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id } = req.params as { id: string };

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    await prisma.course.update({
      where: { id },
      data: { status: "INACTIVE" as CourseStatus },
    });

    // Same revoke + refund flow as PUT when status transitions to INACTIVE.
    if (!REVOKE_STATUSES.has(existing.status as CourseStatus)) {
      try {
        const refund = await paymentClient.refundCourse(id, "course deleted by admin");
        console.log(
          `💸 [CourseService] Refunded ${refund.refunded} earnings ` +
            `(${refund.totalRefunded}đ to ${refund.buyers} buyers) for course ${id}`
        );
      } catch (err) {
        console.error(`⚠️ [CourseService] refundCourse failed for ${id}:`, err);
      }
      const deleted = await prisma.userActivity.deleteMany({ where: { courseId: id } });
      console.log(
        `🚫 [CourseService] Revoked access for ${deleted.count} learners on course ${id}`
      );
    }

    res.json({ success: true, message: "Course deleted" });
  })
);

// ─── LESSONS ───────────────────────────────────────────────────────────
// Admin lesson CRUD bypasses the seller-ownership check so platform staff can
// moderate any course's lessons without owning them.

// GET /api/admin/courses/:id/lessons
router.get(
  "/courses/:id/lessons",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id } = req.params as { id: string };

    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      orderBy: [{ moduleId: "asc" }, { lessonOrder: "asc" }],
      include: { mediaAssets: true },
    });

    res.json({ success: true, data: lessons });
  })
);

// GET /api/admin/courses/:id/lessons/:lessonId
router.get(
  "/courses/:id/lessons/:lessonId",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id, lessonId } = req.params as { id: string; lessonId: string };

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, courseId: id },
      include: { mediaAssets: true, comments: true },
    });
    if (!lesson) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }

    res.json({ success: true, data: lesson });
  })
);

// POST /api/admin/courses/:id/lessons - Create lesson (JSON body, no video here)
router.post(
  "/courses/:id/lessons",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { title, description, durationInSeconds, lessonOrder, moduleId, testId } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ success: false, message: "title is required" });
      return;
    }

    const lesson = await courseRepository.createLesson({
      title,
      description,
      durationInSeconds: durationInSeconds ? Number(durationInSeconds) : undefined,
      lessonOrder: lessonOrder ? Number(lessonOrder) : undefined,
      courseId: id,
      moduleId: moduleId || undefined,
      testId: typeof testId === "string" && testId.length > 0 ? testId : undefined,
    });

    res.status(201).json({ success: true, data: lesson });
  })
);

// PUT /api/admin/courses/:id/lessons/:lessonId - Update lesson
router.put(
  "/courses/:id/lessons/:lessonId",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id, lessonId } = req.params as { id: string; lessonId: string };
    const {
      title,
      description,
      durationInSeconds,
      lessonOrder,
      materials,
      testId,
      mediaAssets,
    } = req.body as {
      title?: string;
      description?: string;
      durationInSeconds?: number;
      lessonOrder?: number;
      materials?: string[];
      testId?: string | null;
      mediaAssets?: { assetType?: string; assetUrl?: string }[];
    };

    const existing = await prisma.lesson.findFirst({
      where: { id: lessonId, courseId: id },
      select: { id: true },
    });
    if (!existing) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }

    // Frontend sends new video as mediaAssets[0].assetUrl with type VIDEO.
    const videoAsset = Array.isArray(mediaAssets)
      ? mediaAssets.find((m) => m.assetType === "VIDEO" && typeof m.assetUrl === "string")
      : undefined;

    const { lesson: updated, deletedVideoUrls } = await courseRepository.updateLesson(
      lessonId,
      {
        title: typeof title === "string" ? title : undefined,
        description: description !== undefined ? description : undefined,
        durationInSeconds: durationInSeconds !== undefined ? Number(durationInSeconds) : undefined,
        lessonOrder: lessonOrder !== undefined ? Number(lessonOrder) : undefined,
        materials: Array.isArray(materials) ? materials.map(String) : undefined,
        videoUrl: videoAsset?.assetUrl,
        testId:
          testId === null || testId === ""
            ? null
            : typeof testId === "string" && testId.length > 0
              ? testId
              : undefined,
      }
    );

    // Fire-and-forget cleanup of replaced S3 objects.
    deletedVideoUrls.forEach((url) => {
      s3Service.deleteFile(url).catch((err) =>
        console.error(`[AdminCourse] Failed to delete old video ${url}:`, err)
      );
    });

    res.json({ success: true, data: updated });
  })
);

// DELETE /api/admin/courses/:id/lessons/:lessonId - Delete lesson
router.delete(
  "/courses/:id/lessons/:lessonId",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id, lessonId } = req.params as { id: string; lessonId: string };

    const existing = await prisma.lesson.findFirst({
      where: { id: lessonId, courseId: id },
      select: { id: true },
    });
    if (!existing) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }

    const { deletedVideoUrls } = await courseRepository.deleteLesson(lessonId);

    deletedVideoUrls.forEach((url) => {
      s3Service.deleteFile(url).catch((err) =>
        console.error(`[AdminCourse] Failed to delete video ${url}:`, err)
      );
    });

    res.json({ success: true, data: { success: true } });
  })
);

// POST /api/admin/courses/:id/lessons/:lessonId/upload-video
// Uploads a video to S3 and returns the public URL. The frontend then PUTs
// the URL back via the update endpoint so we don't double-attach assets here.
router.post(
  "/courses/:id/lessons/:lessonId/upload-video",
  authenticateToken,
  requireAdmin,
  upload.single("video"),
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id, lessonId } = req.params as { id: string; lessonId: string };

    if (!req.file) {
      res.status(400).json({ success: false, message: "video file is required" });
      return;
    }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, courseId: id },
      select: { id: true },
    });
    if (!lesson) {
      res.status(404).json({ success: false, message: "Lesson not found" });
      return;
    }

    const url = await s3Service.uploadFile(req.file, "course-videos");
    res.json({ success: true, data: { url } });
  })
);

// DELETE /api/admin/courses/:id/lessons/:lessonId/comments/:commentId
router.delete(
  "/courses/:id/lessons/:lessonId/comments/:commentId",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id, lessonId, commentId } = req.params as {
      id: string;
      lessonId: string;
      commentId: string;
    };

    const comment = await prisma.comment.findFirst({
      where: { id: commentId, lessonId, lesson: { courseId: id } },
      select: { id: true },
    });
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    await prisma.comment.delete({ where: { id: commentId } });

    // Decrement the lesson's denormalised counter (only if >0 to avoid going negative).
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { commentCount: { decrement: 1 } },
    }).catch(() => {/* commentCount may be null on legacy rows — ignore */});

    res.json({ success: true, data: { success: true } });
  })
);

// ─── RATINGS ───────────────────────────────────────────────────────────
// GET /api/admin/courses/:id/ratings - List all ratings of a course
router.get(
  "/courses/:id/ratings",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id } = req.params as { id: string };

    const ratings = await prisma.rating.findMany({
      where: { courseId: id },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with reviewer names so admin can identify who wrote each review.
    const userIds = [...new Set(ratings.map((r) => r.userId))];
    const users = await identityClient.getUsersBasicInfo(userIds);

    const data = ratings.map((r) => ({
      ...r,
      score: Number(r.score),
      user: users.get(r.userId)
        ? {
            id: r.userId,
            fullName: users.get(r.userId)?.fullName,
          }
        : undefined,
    }));

    res.json({ success: true, data });
  })
);

// DELETE /api/admin/courses/:courseId/ratings/:ratingId - Remove a rating
router.delete(
  "/courses/:courseId/ratings/:ratingId",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { courseId, ratingId } = req.params as {
      courseId: string;
      ratingId: string;
    };

    const existing = await prisma.rating.findFirst({
      where: { id: ratingId, courseId },
    });
    if (!existing) {
      res.status(404).json({ success: false, message: "Rating not found" });
      return;
    }

    await prisma.rating.delete({ where: { id: ratingId } });

    // Recompute denormalised ratingCount on the course so list views stay accurate.
    const remaining = await prisma.rating.count({ where: { courseId } });
    await prisma.course.update({
      where: { id: courseId },
      data: { ratingCount: remaining },
    });

    res.json({ success: true, data: { success: true } });
  })
);

// ─── DASHBOARD ─────────────────────────────────────────────────────────
// GET /api/admin/dashboard - Admin dashboard aggregated stats
router.get(
  "/dashboard",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const prisma = databaseService.getClient();

    // 1. Course stats
    const [totalCourses, activeCourses, pendingCourses, coursesByStatus] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { status: "ACTIVE" as CourseStatus } }),
      prisma.course.count({ where: { status: "PENDING" as CourseStatus } }),
      prisma.course.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const courseStatusData = coursesByStatus.map((g) => ({
      name: g.status,
      value: g._count.id,
    }));

    // 2. Revenue from orders (last 6 months)
    const now = new Date();
    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const orders = await prisma.userActivity.count({
        where: {
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      });

      // Calculate revenue: sum of course prices for activities in this month
      const activities = await prisma.userActivity.findMany({
        where: { createdAt: { gte: monthStart, lt: monthEnd } },
        include: { course: { select: { price: true } } },
      });

      const revenue = activities.reduce(
        (sum: number, act: { course: { price: any } }) => sum + Number(act.course.price || 0),
        0
      );

      revenueData.push({
        month: `T${monthStart.getMonth() + 1}`,
        revenue,
        orders,
      });
    }

    const totalRevenue = revenueData.reduce((s, r) => s + r.revenue, 0);

    // 3. Top selling courses
    const topCourses = await prisma.course.findMany({
      where: { status: "ACTIVE" as CourseStatus },
      orderBy: { ratingCount: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        ratingCount: true,
        thumbnailUrl: true,
        courseSellerId: true,
        _count: { select: { lessons: true } },
      },
    });

    // Enrich top courses with seller names
    const sellerIds = [...new Set(topCourses.map((c) => c.courseSellerId))];
    const sellers = await identityClient.getUsersBasicInfo(sellerIds);

    const topCoursesData = topCourses.map((c) => ({
      id: c.id,
      title: c.title,
      price: Number(c.price),
      ratingCount: c.ratingCount,
      thumbnailUrl: c.thumbnailUrl,
      lessonCount: c._count.lessons,
      sellerName: sellers.get(c.courseSellerId)?.fullName || "Seller",
    }));

    // 4. User stats from identity-service
    const userStats = await identityClient.getUserStats();

    // 5. Revenue growth rate
    const courseGrowthPercent = (() => {
      const thisMonth = revenueData[revenueData.length - 1]?.revenue || 0;
      const lastMonth = revenueData[revenueData.length - 2]?.revenue || 0;
      if (lastMonth > 0) return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
      return thisMonth > 0 ? 100 : 0;
    })();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: userStats?.totalUsers ?? 0,
          totalCourses,
          activeCourses,
          pendingCourses,
          totalRevenue,
          pendingApplications: userStats?.pendingApplications ?? 0,
          monthlyGrowth: {
            users: userStats?.userGrowthPercent ?? 0,
            courses: courseGrowthPercent,
            revenue: courseGrowthPercent,
          },
        },
        revenueData,
        userGrowthData: userStats?.monthlyGrowth ?? [],
        courseStatusData,
        topCourses: topCoursesData,
        userBreakdown: {
          students: userStats?.totalStudents ?? 0,
          sellers: userStats?.totalSellers ?? 0,
          admins: userStats?.totalAdmins ?? 0,
        },
      },
    });
  })
);

export default router;
