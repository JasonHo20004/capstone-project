import { TestRepository } from '@/modules/tests/repositories/test.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import type { Test, Question } from '@/../generated/prisma';

export class TestService {
  private testRepository = new TestRepository();
  private courseRepository = new CourseRepository();

  async createTest(data: {
    courseId: string;
    title: string;
    durationInMinutes?: number;
    maxAttempts?: number;
    testType?: string;
    englishTestTypeId: string;
  }): Promise<Test> {
    // Check if course exists
    const course = await this.courseRepository.findById(data.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Create the test
    const test = await this.testRepository.create({
      title: data.title,
      durationInMinutes: data.durationInMinutes,
      maxAttempts: data.maxAttempts,
      testType: data.testType,
      englishTestTypeId: data.englishTestTypeId,
    });

    // Link test to course
    await this.testRepository.linkToCourse(data.courseId, test.id);

    return test;
  }

  async addQuestion(data: {
    testId: string;
    questionText: string;
    questionType: string;
    options?: string[];
    correctAnswerIndex?: number;
    correctAnswer?: string;
    questionOrder?: number;
  }): Promise<Question> {
    // Validate answer format based on question type
    if (data.questionType === 'MULTIPLE_CHOICE') {
      if (!data.options || data.options.length === 0) {
        throw new Error('Invalid answer format, please re-enter');
      }
      if (data.correctAnswerIndex === undefined) {
        throw new Error('Invalid answer format, please re-enter');
      }
    } else if (data.questionType === 'ESSAY') {
      if (!data.correctAnswer) {
        throw new Error('Invalid answer format, please re-enter');
      }
    }

    try {
      return await this.testRepository.addQuestion(data.testId, data);
    } catch (error) {
      throw new Error('Could not save question, please try again');
    }
  }

  async getTestById(testId: string): Promise<Test | null> {
    return this.testRepository.findById(testId);
  }

  async getTestsByCourse(courseId: string, testType?: string): Promise<Test[]> {
    return this.testRepository.findByCourseId(courseId, testType);
  }
}

