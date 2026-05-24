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
    /** Optional quiz lesson — UUID of a Test in assessment-service. */
    testId?: string;
  }) {
    return await this.prisma.$transaction(async (tx) => {
      if (data.lessonOrder !== undefined) {
        const conflict = await tx.lesson.findFirst({
          where: {
            moduleId: data.moduleId ?? null,
            lessonOrder: data.lessonOrder,
            ...(data.moduleId ? {} : { courseId: data.courseId }),
          },
          select: { id: true },
        });

        if (conflict) {
          if (data.moduleId) {
            await tx.$executeRaw`
              UPDATE lessons SET lesson_order = lesson_order + 1
              WHERE module_id = ${data.moduleId}::uuid AND lesson_order >= ${data.lessonOrder}
            `;
          } else {
            await tx.$executeRaw`
              UPDATE lessons SET lesson_order = lesson_order + 1
              WHERE course_id = ${data.courseId}::uuid AND module_id IS NULL AND lesson_order >= ${data.lessonOrder}
            `;
          }
        }
      }

      return await tx.lesson.create({
        data: {
          title: data.title,
          description: data.description,
          durationInSeconds: data.durationInSeconds,
          lessonOrder: data.lessonOrder,
          materials: data.materials ?? [],
          courseId: data.courseId,
          moduleId: data.moduleId,
          testId: data.testId,
          ...(data.videoUrl ? {
            mediaAssets: {
              create: {
                assetType: "VIDEO",
                assetUrl: data.videoUrl,
              },
            },
          } : {}),
        },
        include: { mediaAssets: true },
      });
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
    /** Set to a UUID to link a Test, or `null` to clear the link. */
    testId?: string | null;
  }) {
    return await this.prisma.$transaction(async (tx) => {
      let deletedVideoUrls: string[] = [];

      // 1. Shift conflicting siblings before the update so we don't trip
      //    the @@unique([moduleId, lessonOrder]) constraint.
      if (data.lessonOrder !== undefined) {
        const current = await tx.lesson.findUnique({
          where: { id: lessonId },
          select: { moduleId: true, courseId: true, lessonOrder: true },
        });
        if (current && current.lessonOrder !== data.lessonOrder) {
          const targetOrder = data.lessonOrder;
          const conflict = await tx.lesson.findFirst({
            where: {
              moduleId: current.moduleId,
              lessonOrder: targetOrder,
              NOT: { id: lessonId },
              ...(current.moduleId ? {} : { courseId: current.courseId }),
            },
            select: { id: true },
          });
          if (conflict) {
            if (current.moduleId) {
              await tx.$executeRaw`
                UPDATE lessons SET lesson_order = lesson_order + 1
                WHERE module_id = ${current.moduleId}::uuid
                  AND lesson_order >= ${targetOrder}
                  AND id <> ${lessonId}::uuid
              `;
            } else {
              await tx.$executeRaw`
                UPDATE lessons SET lesson_order = lesson_order + 1
                WHERE course_id = ${current.courseId}::uuid
                  AND module_id IS NULL
                  AND lesson_order >= ${targetOrder}
                  AND id <> ${lessonId}::uuid
              `;
            }
          }
        }
      }

      // 2. Capture OLD video asset URLs before deleting so the caller can
      //    remove the matching S3 objects.
      if (data.videoUrl) {
        const oldAssets = await tx.mediaAsset.findMany({
          where: { lessonId, assetType: "VIDEO" },
          select: { assetUrl: true },
        });
        deletedVideoUrls = oldAssets.map((a) => a.assetUrl);
        await tx.mediaAsset.deleteMany({
          where: { lessonId, assetType: "VIDEO" },
        });
      }

      // 3. Update the lesson row.
      const lesson = await tx.lesson.update({
        where: { id: lessonId },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.durationInSeconds !== undefined && { durationInSeconds: data.durationInSeconds }),
          ...(data.lessonOrder !== undefined && { lessonOrder: data.lessonOrder }),
          ...(data.materials !== undefined && { materials: data.materials }),
          ...(data.testId !== undefined && { testId: data.testId }),
          ...(data.videoUrl ? {
            mediaAssets: {
              create: {
                assetType: "VIDEO",
                assetUrl: data.videoUrl,
              },
            },
          } : {}),
        },
        include: { mediaAssets: true },
      });

      return { lesson, deletedVideoUrls };
    });
  }

  async deleteLesson(lessonId: string): Promise<{ deletedVideoUrls: string[] }> {
    return await this.prisma.$transaction(async (tx) => {
      const oldAssets = await tx.mediaAsset.findMany({
        where: { lessonId, assetType: "VIDEO" },
        select: { assetUrl: true },
      });

      await tx.mediaAsset.deleteMany({ where: { lessonId } });
      await tx.lesson.delete({ where: { id: lessonId } });

      return { deletedVideoUrls: oldAssets.map((a) => a.assetUrl) };
    });
  }
}
