import { LessonRepository } from '@/modules/courses/repositories/lesson.repository';
import { MediaAssetRepository } from '@/modules/courses/repositories/media-asset.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import type { Lesson, MediaType } from '@/../generated/prisma';

export class LessonService {
  private lessonRepository = new LessonRepository();
  private mediaAssetRepository = new MediaAssetRepository();
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

    // Create lesson
    const createData: {
      title: string;
      description?: string;
      lessonOrder?: number;
      durationInSeconds?: number;
      courseId: string;
    } = {
      title: data.title,
      courseId: data.courseId,
    };
    
    if (data.description !== undefined) createData.description = data.description;
    if (data.lessonOrder !== undefined) createData.lessonOrder = data.lessonOrder;
    if (data.durationInSeconds !== undefined) createData.durationInSeconds = data.durationInSeconds;
    
    const lesson = await this.lessonRepository.create(createData);

    // Create media asset for the video if provided
    if (data.videoUrl) {
      const mediaAssetData: {
        assetType: MediaType;
        assetUrl: string;
        lessonId: string;
      } = {
        assetType: 'VIDEO' as MediaType,
        assetUrl: data.videoUrl,
        lessonId: lesson.id,
      };

      await this.mediaAssetRepository.create(mediaAssetData);
    }

    // Return lesson with media assets
    return this.lessonRepository.findById(lesson.id) as Promise<Lesson>;
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

