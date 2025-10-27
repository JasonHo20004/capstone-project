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
    const createData: any = {
      title: data.title,
      courseId: data.courseId,
    };
    
    if (data.description !== undefined) createData.description = data.description;
    if (data.videoUrl !== undefined) createData.videoUrl = data.videoUrl;
    if (data.lessonOrder !== undefined) createData.lessonOrder = data.lessonOrder;
    if (data.durationInSeconds !== undefined) createData.durationInSeconds = data.durationInSeconds;
    
    return this.prisma.lesson.create({ data: createData });
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
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
    if (data.lessonOrder !== undefined) updateData.lessonOrder = data.lessonOrder;
    if (data.durationInSeconds !== undefined) updateData.durationInSeconds = data.durationInSeconds;
    
    return this.prisma.lesson.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lesson.delete({
      where: { id },
    });
  }
}

