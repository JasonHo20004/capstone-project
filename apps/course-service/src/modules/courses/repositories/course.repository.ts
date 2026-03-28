// =============================================================================
// Course Repository - Database operations for courses
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type { Prisma, CourseStatus } from "../../../../generated/prisma/index.js";

export class CourseRepository {
  private prisma = databaseService.getClient();

  async findById(id: string) {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { moduleOrder: "asc" },
          include: {
            lessons: {
              orderBy: { lessonOrder: "asc" },
            },
          },
        },
        lessons: {
          orderBy: { lessonOrder: "asc" },
        },
        ratings: true,
      },
    });
  }

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }) {
    return await this.prisma.course.findMany({
      skip: options.skip,
      take: options.take,
      where: options.where,
      orderBy: options.orderBy || { createdAt: "desc" },
      include: {
        lessons: {
          select: { id: true },
        },
        _count: {
          select: { ratings: true },
        },
      },
    });
  }

  async count(where?: Prisma.CourseWhereInput) {
    return await this.prisma.course.count({ where });
  }

  async create(data: Prisma.CourseCreateInput) {
    return await this.prisma.course.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CourseUpdateInput) {
    return await this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.course.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: CourseStatus) {
    return await this.prisma.course.update({
      where: { id },
      data: { status },
    });
  }

  async findBySellerId(sellerId: string) {
    return await this.prisma.course.findMany({
      where: { courseSellerId: sellerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPublishedCourses(options: {
    skip?: number;
    take?: number;
    category?: string;
    level?: string;
    search?: string;
  }) {
    const where: Prisma.CourseWhereInput = {
      status: "ACTIVE",
    };

    if (options.category) {
      where.category = options.category;
    }

    if (options.level) {
      where.courseLevel = options.level as any;
    }

    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    return await this.prisma.course.findMany({
      skip: options.skip,
      take: options.take,
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findEnrolledByUserId(userId: string) {
    return await this.prisma.course.findMany({
      where: {
        userActivities: {
          some: { userId },
        },
      },
      include: {
        lessons: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createLesson(data: {
    title: string;
    description?: string;
    durationInSeconds?: number;
    lessonOrder?: number;
    materials?: string[];
    courseId: string;
    moduleId?: string;
    videoUrl?: string;
  }) {
    return await this.prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        durationInSeconds: data.durationInSeconds,
        lessonOrder: data.lessonOrder,
        materials: data.materials ?? [],
        courseId: data.courseId,
        moduleId: data.moduleId,
        ...(data.videoUrl ? {
          mediaAssets: {
            create: {
              assetType: "VIDEO",
              assetUrl: data.videoUrl,
            },
          },
        } : {}),
      },
      include: {
        mediaAssets: true,
      },
    });
  }

  async findLessonById(lessonId: string) {
    return await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        mediaAssets: true,
        comments: true,
      },
    });
  }

  async updateLesson(lessonId: string, data: {
    title?: string;
    description?: string;
    durationInSeconds?: number;
    lessonOrder?: number;
    materials?: string[];
    videoUrl?: string;
  }) {
    // If videoUrl is provided, delete old VIDEO asset and create new one
    if (data.videoUrl) {
      await this.prisma.mediaAsset.deleteMany({
        where: { lessonId, assetType: "VIDEO" },
      });
    }

    return await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.durationInSeconds !== undefined && { durationInSeconds: data.durationInSeconds }),
        ...(data.lessonOrder !== undefined && { lessonOrder: data.lessonOrder }),
        ...(data.materials !== undefined && { materials: data.materials }),
        ...(data.videoUrl ? {
          mediaAssets: {
            create: {
              assetType: "VIDEO",
              assetUrl: data.videoUrl,
            },
          },
        } : {}),
      },
      include: {
        mediaAssets: true,
      },
    });
  }
}
