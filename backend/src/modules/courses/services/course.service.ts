import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { LessonRepository } from '@/modules/courses/repositories/lesson.repository';
import { TestRepository } from '@/modules/tests/repositories/test.repository';
import type { Course } from '@/../../generated/prisma';

export class CourseService {
  private courseRepository = new CourseRepository();
  private lessonRepository = new LessonRepository();
  private testRepository = new TestRepository();

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
    return this.courseRepository.update(courseId, data);
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    return this.courseRepository.findById(courseId);
  }

  async getCoursesBySeller(sellerId: string): Promise<Course[]> {
    return this.courseRepository.findByCourseSellerId(sellerId);
  }
}

