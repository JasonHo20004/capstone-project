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
    englishTestTypeId: string;
  }): Promise<Test> {
    // Check if course exists
    const course = await this.courseRepository.findById(data.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Ensure the course does not already have a final test
    if (course.finalTestId) {
      throw new Error('Course already has a final test');
    }

    // Create the test with testType = FINAL
    const createData: {
      title: string;
      englishTestTypeId: string;
      testType: string;
      durationInMinutes?: number;
      maxAttempts?: number;
    } = {
      title: data.title,
      englishTestTypeId: data.englishTestTypeId,
      testType: 'FINAL',
    };

    if (data.durationInMinutes !== undefined) {
      createData.durationInMinutes = data.durationInMinutes;
    }
    if (data.maxAttempts !== undefined) {
      createData.maxAttempts = data.maxAttempts;
    }

    const test = await this.testRepository.create(createData);

    // Link test to course and set as the course's final test
    await this.testRepository.linkToCourse(data.courseId, test.id);
    await this.courseRepository.setFinalTestId(data.courseId, test.id);

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

  async getTestsByCourse(courseId: string): Promise<Test[]> {
    return this.testRepository.findByCourseId(courseId);
  }
}

