import { TestRepository } from '@/modules/tests/repositories/test.repository';
import { SectionRepository } from '@/modules/tests/repositories/section.repository';
import { QuestionRepository } from '@/modules/tests/repositories/question.repository';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import type { Test, Question } from '@/../generated/prisma';

export class TestService {
  private testRepository = new TestRepository();
  private sectionRepository = new SectionRepository();
  private questionRepository = new QuestionRepository();
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

    if (course.finalTestId) {
      throw new Error('Course already has a final test');
    }

    const createData: {
      title: string;
      englishTestTypeId: string;
      testType: 'FINAL';
      durationInMinutes?: number;
      maxAttempts?: number;
    } = {
      title: data.title,
      englishTestTypeId: data.englishTestTypeId,
      testType: 'FINAL' as const,
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

  async addQuestionToSection(data: {
    sectionId: string;
    passageId: string;
    mediaId: string;
    questionText: string;
    questionType: string;
    options?: string[];
    correctAnswerIndex?: number;
    correctAnswer?: string;
    wordLimit?: number;
    imageUrl?: string;
    questionOrder?: number;
  }): Promise<Question> {
    try {
      return await this.questionRepository.create(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Could not save question, please try again');
    }
  }

  async getTestById(testId: string): Promise<Test | null> {
    return this.testRepository.findById(testId);
  }

  async getTestsByCourse(courseId: string): Promise<Test[]> {
    return this.testRepository.findByCourseId(courseId);
  }

  // Section management
  async createSection(data: {
    testId: string;
    title: string;
    skill: string;
    durationInSeconds?: number;
    totalQuestions?: number;
    totalScore?: number;
  }) {
    // Verify test exists
    const test = await this.testRepository.findById(data.testId);
    if (!test) {
      throw new Error('Test not found');
    }

    return this.sectionRepository.create(data);
  }

  async getSectionsByTestId(testId: string) {
    return this.sectionRepository.findByTestId(testId);
  }

  async getSectionById(sectionId: string) {
    return this.sectionRepository.findById(sectionId);
  }

  // Passage management
  async addPassageToSection(data: {
    sectionId: string;
    content: string;
    passageOrder?: number;
  }) {
    // Verify section exists
    const section = await this.sectionRepository.findById(data.sectionId);
    if (!section) {
      throw new Error('Section not found');
    }

    return this.sectionRepository.addPassage(data.sectionId, data);
  }

  async getPassagesBySectionId(sectionId: string) {
    return this.sectionRepository.getPassagesBySectionId(sectionId);
  }

  // Question management
  async getQuestionsBySectionId(sectionId: string) {
    return this.questionRepository.findBySectionId(sectionId);
  }

  async getQuestionsByPassageId(passageId: string) {
    return this.questionRepository.findByPassageId(passageId);
  }

  async getQuestionById(questionId: string) {
    return this.questionRepository.findById(questionId);
  }
}

