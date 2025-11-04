import { databaseService } from '@/services/database.service';
import type { Test, Question } from '@/../generated/prisma';

export class TestRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    title: string;
    durationInMinutes?: number;
    maxAttempts?: number;
    englishTestTypeId: string;
    questions?: Question[];
  }): Promise<Test> {
    const createData: any = {
      title: data.title,
      englishTestTypeId: data.englishTestTypeId,
    };
    if (data.durationInMinutes !== undefined) createData.durationInMinutes = data.durationInMinutes;
    if (data.maxAttempts !== undefined) createData.maxAttempts = data.maxAttempts;

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

  async addQuestion(
    testId: string,
    questionData: {
      questionText: string;
      questionType: string;
      options?: string[];
      correctAnswerIndex?: number;
      correctAnswer?: string;
      questionOrder?: number;
    }
  ): Promise<Question> {
    const createData: any = {
      testId,
      questionText: questionData.questionText,
      questionType: questionData.questionType as any,
      options: questionData.options ?? [],
    };
    if (questionData.correctAnswerIndex !== undefined) createData.correctAnswerIndex = questionData.correctAnswerIndex;
    if (questionData.correctAnswer !== undefined) createData.correctAnswer = questionData.correctAnswer;
    if (questionData.questionOrder !== undefined) createData.questionOrder = questionData.questionOrder;

    return this.prisma.question.create({
      data: createData,
    });
  }
}

