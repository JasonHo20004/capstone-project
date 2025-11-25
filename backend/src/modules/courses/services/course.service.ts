import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import type { Course, CourseLevel, CourseStatus } from '@/../generated/prisma';
import { calculateAverageRating } from '@/utils/admin';

export class CourseService {
  private courseRepository = new CourseRepository();

  async createCourse(data: {
    title: string;
    description?: string;
    price: number;
    category?: string;
    courseLevel?: string;
    courseSellerId: string;
  }): Promise<Course> {
    return this.courseRepository.create(data);
  }

  async publishCourse(courseId: string): Promise<Course> {
    // Find the course
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if a test with TestType.FINAL exists for this course
    const hasFinalTest = await this.courseRepository.checkHasFinalTest(courseId);
    
    if (!hasFinalTest) {
      throw new Error('Course content is incomplete for publication. A final test is required.');
    }

    // Update course status to PUBLISHED
    return this.courseRepository.updateStatus(courseId, 'PUBLISHED');
  }

  async updateCourse(
    courseId: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      category?: string;
      courseLevel?: string;
    }
  ): Promise<Course> {
    const updateData: {
      title?: string;
      description?: string;
      price?: number;
      category?: string;
      courseLevel?: CourseLevel;
    } = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.courseLevel !== undefined) updateData.courseLevel = data.courseLevel as CourseLevel;
    
    return this.courseRepository.update(courseId, updateData);
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    const course: any = await this.courseRepository.findById(courseId);
    if (!course) return null;

    const ratings = (course.ratings ?? []) as { score: number }[];
    const averageRating = calculateAverageRating(ratings);
    const ratingCount =
      typeof course.ratingCount === 'number'
        ? course.ratingCount
        : Array.isArray(ratings)
        ? ratings.length
        : 0;

    return {
      ...course,
      averageRating,
      ratingCount,
    } as Course;
  }

  async getCoursesBySeller(sellerId: string): Promise<Course[]> {
    const courses: any[] = await this.courseRepository.findByCourseSellerId(
      sellerId,
    );

    return courses.map((course) => {
      const ratings = (course.ratings ?? []) as { score: number }[];
      const averageRating = calculateAverageRating(ratings);
      const ratingCount =
        typeof course.ratingCount === 'number'
          ? course.ratingCount
          : Array.isArray(ratings)
          ? ratings.length
          : 0;

      return {
        ...course,
        averageRating,
        ratingCount,
      } as Course;
    });
  }

  async getCourses(params: {
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
    userId?: string;
    enrollmentStatus?:string;
  }): Promise<{ courses: Course[]; total: number }> {
    return this.courseRepository.findAllWithPagination(params);
  }
}

