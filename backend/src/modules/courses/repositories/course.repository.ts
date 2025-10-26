import { databaseService } from '@/services/database.service';
import type { Course, CourseStatus, CourseLevel } from '@/../../generated/prisma';

export class CourseRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    title: string;
    description?: string;
    shortDescription?: string;
    price: number;
    category?: string;
    courseLevel?: string;
    courseSellerId: string;
  }): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        category: data.category,
        courseLevel: data.courseLevel as CourseLevel | undefined,
        courseSellerId: data.courseSellerId,
        status: 'DRAFT' as CourseStatus,
      },
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
        ratings: true,
        test: true,
      },
    });
  }

  async findByCourseSellerId(sellerId: string, status?: CourseStatus): Promise<Course[]> {
    const where: any = { courseSellerId: sellerId };
    if (status) {
      where.status = status;
    }
    return this.prisma.course.findMany({
      where,
      include: {
        lessons: {
          orderBy: {
            lessonOrder: 'asc',
          },
        },
        test: true,
        _count: {
          select: {
            lessons: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      shortDescription?: string;
      price?: number;
      category?: string;
      courseLevel?: CourseLevel;
    }
  ): Promise<Course> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.courseLevel !== undefined) updateData.courseLevel = data.courseLevel;
    
    return this.prisma.course.update({
      where: { id },
      data: updateData,
    });
  }

  async updateStatus(id: string, status: CourseStatus): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data: { status },
    });
  }

  async checkHasFinalTest(courseId: string): Promise<boolean> {
    const tests = await this.prisma.test.findMany({
      where: {
        courseTests: {
          some: {
            courseId,
          },
        },
        testType: 'FINAL',
      },
    });
    return tests.length > 0;
  }
}

