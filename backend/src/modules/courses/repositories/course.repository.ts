import { databaseService } from '@/services/database.service';
import type { Course, CourseStatus, CourseLevel } from '@/../generated/prisma';

export class CourseRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    title: string;
    description?: string;
    price: number;
    category?: string;
    courseLevel?: string;
    courseSellerId: string;
  }): Promise<Course> {
    const createData: any = {
      title: data.title,
      price: data.price,
      courseSellerId: data.courseSellerId,
      status: 'DRAFT' as CourseStatus,
    };
    
    if (data.description !== undefined) createData.description = data.description;
    if (data.category !== undefined) createData.category = data.category;
    if (data.courseLevel !== undefined) createData.courseLevel = data.courseLevel as CourseLevel;

    return this.prisma.course.create({ data: createData });
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
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      category?: string;
      courseLevel?: CourseLevel;
    }
  ): Promise<Course> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
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
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { finalTestId: true },
    });
    return !!course?.finalTestId;
  }

  async setFinalTestId(courseId: string, testId: string): Promise<Course> {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { finalTestId: testId },
    });
  }

  async findCourseAvailableById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id, status: "ACTIVE" },
    });
  }

  async hasLessons(courseId: string): Promise<boolean> {
    const lessonCount = await this.prisma.lesson.count({
      where: { courseId },
    });
    return lessonCount > 0;
  }
}