import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import type { Course, CourseLevel } from '@/../../generated/prisma';

export class CourseService {
  private courseRepository = new CourseRepository();

  async createCourse(data: {
    title: string;
    description?: string;
    shortDescription?: string;
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
      shortDescription?: string;
      price?: number;
      category?: string;
      courseLevel?: string;
    }
  ): Promise<Course> {
    const updateData: {
      title?: string;
      description?: string;
      shortDescription?: string;
      price?: number;
      category?: string;
      courseLevel?: CourseLevel;
    } = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.courseLevel !== undefined) updateData.courseLevel = data.courseLevel as CourseLevel;
    
    return this.courseRepository.update(courseId, updateData);
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    return this.courseRepository.findById(courseId);
  }

  async getCoursesBySeller(sellerId: string): Promise<Course[]> {
    return this.courseRepository.findByCourseSellerId(sellerId);
  }
}

