// =============================================================================
// Admin Course Routes - Admin management of courses
// =============================================================================

import { Router, Request, Response } from "express";
import { authenticateToken, requireAdmin, asyncHandler, EventNames, CoursePublishedEvent } from "@capstone/common";
import { getEventBus } from "../../../server.js";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import { paymentClient } from "../../../clients/payment.client.js";
import type { CourseStatus } from "../../../../generated/prisma/index.js";

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
      },
    });

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const seller = await identityClient.getUserBasicInfo(course.courseSellerId);

    res.json({
      success: true,
      data: {
        ...course,
        price: Number(course.price),
        sellerName: seller?.fullName,
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
    const { status, title, description, price, courseLevel } = req.body;

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

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: { lessons: { select: { id: true } } },
    }) as any;

    // 🔥 Emit RabbitMQ Event if course was just approved to ACTIVE
    if (updateData.status === "ACTIVE" && existing.status !== "ACTIVE") {
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
