import { databaseService } from '@/services/database.service';
import type { Test, Question, TestType } from '@/../generated/prisma';

export class TestRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    title: string;
    durationInMinutes?: number;
    maxAttempts?: number;
    englishTestTypeId: string;
    testType?: TestType;
    questions?: Question[];
  }): Promise<Test> {
    const createData: any = {
      title: data.title,
      englishTestTypeId: data.englishTestTypeId,
    };
    if (data.durationInMinutes !== undefined) createData.durationInMinutes = data.durationInMinutes;
    if (data.maxAttempts !== undefined) createData.maxAttempts = data.maxAttempts;
    if (data.testType !== undefined) createData.testType = data.testType;

    return this.prisma.test.create({
      data: {
        ...createData,
        questions: data.questions
          ? {
              create: data.questions,
            }
          : undefined,
      },
      include: {
        questions: true,
      },
    });
  }

  async findById(id: string): Promise<Test | null> {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            questionOrder: 'asc',
          },
        },
        sections: true,
      },
    });
  }

  async findByCourseId(courseId: string): Promise<Test[]> {
    const where: any = {
      courseTests: {
        some: {
          courseId,
        },
      },
    };

    return this.prisma.test.findMany({
      where,
      include: {
        questions: true,
      },
    });
  }

  async linkToCourse(courseId: string, testId: string): Promise<void> {
    await this.prisma.courseTest.create({
      data: {
        courseId,
        testId,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      durationInMinutes?: number;
      maxAttempts?: number;
    }
  ): Promise<Test> {
    return this.prisma.test.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.test.delete({
      where: { id },
    });
  }
}
