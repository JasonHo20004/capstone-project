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

      const newTest = await this.testService.createTest({
        courseId,
        ...testData,
      });

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

      const newQuestion = await this.testService.addQuestion({
        testId,
        ...questionData,
      });

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

