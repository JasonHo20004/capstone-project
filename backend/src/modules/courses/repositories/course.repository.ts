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
    const createData: any = {
      title: data.title,
      price: data.price,
      courseSellerId: data.courseSellerId,
      status: 'DRAFT' as CourseStatus,
    };
    
    if (data.description !== undefined) createData.description = data.description;
    if (data.shortDescription !== undefined) createData.shortDescription = data.shortDescription;
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
  
}
