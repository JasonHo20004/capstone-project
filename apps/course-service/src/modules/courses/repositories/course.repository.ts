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
      status: "PUBLISHED",
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
}
