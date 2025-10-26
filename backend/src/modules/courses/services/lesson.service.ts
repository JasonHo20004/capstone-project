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

    // Handle the case where req.file is missing (upload failed)
    if (data.videoUrl === undefined) {
      throw new Error('Could not upload video, please try again');
    }

    return this.lessonRepository.create({
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      lessonOrder: data.lessonOrder,
      durationInSeconds: data.durationInSeconds,
      courseId: data.courseId,
    });
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
    return this.lessonRepository.update(lessonId, data);
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

