// =============================================================================
// Module Repository - Database operations for course modules
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type { Prisma } from "../../../../generated/prisma/index.js";

export class ModuleRepository {
  private prisma = databaseService.getClient();

  async findById(id: string) {
    return await this.prisma.module.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { lessonOrder: "asc" },
        },
      },
    });
  }

  async findByCourseId(courseId: string) {
    return await this.prisma.module.findMany({
      where: { courseId },
      orderBy: { moduleOrder: "asc" },
      include: {
        lessons: {
          orderBy: { lessonOrder: "asc" },
          include: {
            mediaAssets: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.ModuleUncheckedCreateInput) {
    return await this.prisma.$transaction(async (tx) => {
      const targetOrder = data.moduleOrder as number;
      const courseId = data.courseId as string;

      const conflict = await tx.module.findFirst({
        where: { courseId, moduleOrder: targetOrder },
        select: { id: true },
      });

      if (conflict) {
        await tx.$executeRaw`
          UPDATE modules SET module_order = module_order + 1
          WHERE course_id = ${courseId}::uuid AND module_order >= ${targetOrder}
        `;
      }

      return await tx.module.create({
        data,
        include: { lessons: true },
      });
    });
  }

  async update(id: string, data: Prisma.ModuleUncheckedUpdateInput) {
    return await this.prisma.$transaction(async (tx) => {
      if (data.moduleOrder !== undefined) {
        const current = await tx.module.findUnique({ where: { id }, select: { courseId: true } });
        if (current) {
          const targetOrder = data.moduleOrder as number;
          const conflict = await tx.module.findFirst({
            where: { courseId: current.courseId, moduleOrder: targetOrder, NOT: { id } },
            select: { id: true },
          });
          if (conflict) {
            await tx.$executeRaw`
              UPDATE modules SET module_order = module_order + 1
              WHERE course_id = ${current.courseId}::uuid AND module_order >= ${targetOrder}
            `;
          }
        }
      }

      return await tx.module.update({
        where: { id },
        data,
        include: {
          lessons: { orderBy: { lessonOrder: "asc" } },
        },
      });
    });
  }

  /**
   * Delete a module and gracefully demote its lessons to "unassigned" without
   * violating the @@unique([moduleId, lessonOrder]) constraint.
   *
   * SetNull cascade on lesson.module would otherwise produce multiple rows with
   * (moduleId=null, lessonOrder=N) which conflict if other unassigned lessons
   * already exist with the same order.
   */
  async delete(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      const mod = await tx.module.findUnique({
        where: { id },
        select: {
          courseId: true,
          lessons: { select: { id: true }, orderBy: { lessonOrder: "asc" } },
        },
      });
      if (!mod) throw new Error("Module not found");

      const orphanIds = mod.lessons.map((l) => l.id);

      if (orphanIds.length > 0) {
        // Find current max lessonOrder among unassigned lessons in this course.
        const maxRow = await tx.lesson.findFirst({
          where: { courseId: mod.courseId, moduleId: null },
          orderBy: { lessonOrder: "desc" },
          select: { lessonOrder: true },
        });
        let nextOrder = (maxRow?.lessonOrder ?? 0) + 1;

        // Detach + renumber each orphan one-by-one so we don't violate the
        // composite uniqueness midway through a bulk update.
        for (const lessonId of orphanIds) {
          await tx.lesson.update({
            where: { id: lessonId },
            data: { moduleId: null, lessonOrder: nextOrder },
          });
          nextOrder += 1;
        }
      }

      return await tx.module.delete({ where: { id } });
    });
  }

  async count(courseId: string) {
    return await this.prisma.module.count({
      where: { courseId },
    });
  }
}
