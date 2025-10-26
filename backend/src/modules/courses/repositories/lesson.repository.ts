import { databaseService } from '@/services/database.service';
import type { Lesson } from '@/../../generated/prisma';

export class LessonRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    title: string;
    description?: string;
    videoUrl?: string;
    lessonOrder?: number;
    durationInSeconds?: number;
    courseId: string;
  }): Promise<Lesson> {
    return this.prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        lessonOrder: data.lessonOrder,
        durationInSeconds: data.durationInSeconds,
        courseId: data.courseId,
      },
    });
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
  }

  async findByCourseId(courseId: string): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: {
        lessonOrder: 'asc',
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      videoUrl?: string;
      lessonOrder?: number;
      durationInSeconds?: number;
    }
  ): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lesson.delete({
      where: { id },
    });
  }
}

