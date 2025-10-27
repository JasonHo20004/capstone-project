import { LessonRepository } from '@/modules/courses/repositories/lesson.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import type { Lesson } from '@/../../generated/prisma';

export class LessonService {
  private lessonRepository = new LessonRepository();
  private courseRepository = new CourseRepository();

  async createLesson(data: {
    courseId: string;
    title: string;
    description?: string;
    lessonOrder?: number;
    durationInSeconds?: number;
    videoUrl?: string;
  }): Promise<Lesson> {
    // Check if course exists
    const course = await this.courseRepository.findById(data.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (data.videoUrl === undefined) {
      throw new Error('Could not upload video, please try again');
    }

    const createData: {
      title: string;
      description?: string;
      videoUrl: string;
      lessonOrder?: number;
      durationInSeconds?: number;
      courseId: string;
    } = {
      title: data.title,
      videoUrl: data.videoUrl,
      courseId: data.courseId,
    };
    
    if (data.description !== undefined) createData.description = data.description;
    if (data.lessonOrder !== undefined) createData.lessonOrder = data.lessonOrder;
    if (data.durationInSeconds !== undefined) createData.durationInSeconds = data.durationInSeconds;
    
    return this.lessonRepository.create(createData);
  }

  async updateLesson(
    lessonId: string,
    data: {
      title?: string;
      description?: string;
      lessonOrder?: number;
      durationInSeconds?: number;
    }
  ): Promise<Lesson> {
    const updateData: {
      title?: string;
      description?: string;
      lessonOrder?: number;
      durationInSeconds?: number;
    } = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.lessonOrder !== undefined) updateData.lessonOrder = data.lessonOrder;
    if (data.durationInSeconds !== undefined) updateData.durationInSeconds = data.durationInSeconds;
    
    return this.lessonRepository.update(lessonId, updateData);
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    return this.lessonRepository.findById(lessonId);
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return this.lessonRepository.findByCourseId(courseId);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    await this.lessonRepository.delete(lessonId);
  }
}

