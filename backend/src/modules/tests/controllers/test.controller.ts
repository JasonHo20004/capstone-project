import type { Request, Response, NextFunction } from 'express';
import { TestService } from '@/modules/tests/services/test.service';
import type {
  CreateTestInput,
  AddQuestionInput,
  GetTestByIdInput,
} from '../dtos/test.dto';

export class TestController {
  private testService = new TestService();

  public createTest = async (
    req: Request<CreateTestInput['params'], {}, CreateTestInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const testData = req.body;

      const createTestData: {
        courseId: string;
        title: string;
        englishTestTypeId: string;
        durationInMinutes?: number;
        maxAttempts?: number;
      } = {
        courseId,
        title: testData.title,
        englishTestTypeId: testData.englishTestTypeId,
      };

      if (testData.durationInMinutes !== undefined) {
        createTestData.durationInMinutes = testData.durationInMinutes;
      }
      if (testData.maxAttempts !== undefined) {
        createTestData.maxAttempts = testData.maxAttempts;
      }

      const newTest = await this.testService.createTest(createTestData);

      res.status(201).json({
        success: true,
        message: 'Test created successfully',
        data: newTest,
      });
    } catch (error) {
      next(error);
    }
  };

  public addQuestion = async (
    req: Request<AddQuestionInput['params'], {}, AddQuestionInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { testId } = req.params;
      const questionData = req.body;

      // Validate required fields based on question type
      if (questionData.questionType === 'MULTIPLE_CHOICE') {
        if (!questionData.options || questionData.options.length === 0) {
          res.status(400).json({
            success: false,
            message: 'Invalid answer format, please re-enter',
          });
          return;
        }
      } else if (questionData.questionType === 'ESSAY') {
        if (!questionData.correctAnswer) {
          res.status(400).json({
            success: false,
            message: 'Invalid answer format, please re-enter',
          });
          return;
        }
      }

      const addQuestionData: {
        testId: string;
        questionText: string;
        questionType: string;
        options?: string[];
        correctAnswerIndex?: number;
        correctAnswer?: string;
        questionOrder?: number;
      } = {
        testId,
        questionText: questionData.questionText,
        questionType: questionData.questionType,
      };

      if (questionData.options !== undefined) {
        addQuestionData.options = questionData.options;
      }
      if (questionData.correctAnswerIndex !== undefined) {
        addQuestionData.correctAnswerIndex = questionData.correctAnswerIndex;
      }
      if (questionData.correctAnswer !== undefined) {
        addQuestionData.correctAnswer = questionData.correctAnswer;
      }
      if (questionData.questionOrder !== undefined) {
        addQuestionData.questionOrder = questionData.questionOrder;
      }

      const newQuestion = await this.testService.addQuestion(addQuestionData);

      res.status(201).json({
        success: true,
        message: 'Question added successfully',
        data: newQuestion,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid answer format')) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  public getTestById = async (
    req: Request<GetTestByIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { testId } = req.params;

      const test = await this.testService.getTestById(testId);

      if (!test) {
        res.status(404).json({
          success: false,
          message: 'Test not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Test retrieved successfully',
        data: test,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTestsByCourse = async (
    req: Request<{ courseId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const tests = await this.testService.getTestsByCourse(courseId);

      res.status(200).json({
        success: true,
        message: 'Tests retrieved successfully',
        data: tests,
        count: tests.length,
      });
    } catch (error) {
      next(error);
    }
  };
}

