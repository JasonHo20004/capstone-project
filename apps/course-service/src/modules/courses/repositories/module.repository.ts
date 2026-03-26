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
    return await this.prisma.module.create({
      data,
      include: {
        lessons: true,
      },
    });
  }

  async update(id: string, data: Prisma.ModuleUncheckedUpdateInput) {
    return await this.prisma.module.update({
      where: { id },
      data,
      include: {
        lessons: {
          orderBy: { lessonOrder: "asc" },
        },
      },
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
