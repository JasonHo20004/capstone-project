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

  async delete(id: string) {
    return await this.prisma.module.delete({
      where: { id },
    });
  }

  async count(courseId: string) {
    return await this.prisma.module.count({
      where: { courseId },
    });
  }
}
