import { databaseService } from '@/services/database.service';
import type { Test, Question } from '@/../generated/prisma';

export class TestRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    title: string;
    durationInMinutes?: number;
    maxAttempts?: number;
    testType?: string;
    englishTestTypeId: string;
    questions?: Question[];
  }): Promise<Test> {
    return this.prisma.test.create({
      data: {
        title: data.title,
        durationInMinutes: data.durationInMinutes,
        maxAttempts: data.maxAttempts,
        testType: data.testType as any,
        englishTestTypeId: data.englishTestTypeId,
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

  async findByCourseId(courseId: string, testType?: string): Promise<Test[]> {
    const where: any = {
      courseTests: {
        some: {
          courseId,
        },
      },
    };
    if (testType) {
      where.testType = testType;
    }

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
    return this.prisma.question.create({
      data: {
        testId,
        questionText: questionData.questionText,
        questionType: questionData.questionType as any,
        options: questionData.options || [],
        correctAnswerIndex: questionData.correctAnswerIndex,
        correctAnswer: questionData.correctAnswer,
        questionOrder: questionData.questionOrder,
      },
    });
  }
}

