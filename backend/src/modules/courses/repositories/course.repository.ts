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

  async findByCourseSellerId(
    sellerId: string,
    status?: CourseStatus,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Course[]> {
    const where: any = { courseSellerId: sellerId };
    if (status) {
      where.status = status;
    }

    const queryOptions: any = {
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
    };

    // Add pagination if provided
    if (options?.page && options?.limit) {
      queryOptions.skip = (options.page - 1) * options.limit;
      queryOptions.take = options.limit;
    }

    // Add sorting
    const orderBy: any = {};
    if (options?.sortBy) {
      const validSortFields = ['createdAt', 'price', 'ratingCount', 'averageRating', 'title'];
      const sortField = validSortFields.includes(options.sortBy) ? options.sortBy : 'createdAt';
      orderBy[sortField] = options.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }
    queryOptions.orderBy = orderBy;

    return this.prisma.course.findMany(queryOptions);
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

  /**
   * Tìm courses với các filters và pagination
   * Method này được sử dụng chung cho cả findAllWithPagination và có thể mở rộng cho findByCourseSellerId
   */
  private buildWhereClause(params: {
    sellerId?: string;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    courseLevel?: CourseLevel;
    status?: CourseStatus;
  }): any {
    const where: any = {};

    if (params.sellerId) {
      where.courseSellerId = params.sellerId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.category) {
      where.category = params.category;
    }

    if (params.courseLevel) {
      where.courseLevel = params.courseLevel;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) {
        where.price.gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        where.price.lte = params.maxPrice;
      }
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): any {
    const orderBy: any = {};
    const validSortFields = ['createdAt', 'price', 'ratingCount', 'averageRating', 'title'];
    const sortField = sortBy && validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    orderBy[sortField] = sortOrder;
    return orderBy;
  }

  async findAllWithPagination(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    courseLevel?: CourseLevel;
    status?: CourseStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ courses: Course[]; total: number }> {
    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const where = this.buildWhereClause(params);
    const orderBy = this.buildOrderBy(sortBy, sortOrder);
    
    // Chỉ áp dụng pagination nếu có page và limit
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const queryOptions: any = {
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            ratings: true,
            lessons: true,
          },
        },
      },
    };

    if (skip !== undefined) {
      queryOptions.skip = skip;
    }
    if (take !== undefined) {
      queryOptions.take = take;
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany(queryOptions),
      this.prisma.course.count({ where }),
    ]);

    return { courses, total };
  }
}