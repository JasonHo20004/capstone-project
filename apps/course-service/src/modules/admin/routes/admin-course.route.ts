// =============================================================================
// Admin Course Routes - Admin management of courses
// =============================================================================

import { Router, Request, Response } from "express";
import { authenticateToken, requireAdmin, asyncHandler } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { identityClient } from "../../../clients/identity.client.js";
import type { CourseStatus } from "../../../../generated/prisma/index.js";

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

    res.json({ success: true, message: "Course deleted" });
  })
);

export default router;
