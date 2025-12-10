import type { Request, Response, NextFunction } from 'express';
import { TestService } from '@/modules/tests/services/test.service';
import type {
  CreateTestInput,
  GetTestByIdInput,
  CreateSectionInput,
  GetSectionsByTestIdInput,
  GetSectionByIdInput,
  AddPassageToSectionInput,
  GetPassagesBySectionIdInput,
  AddQuestionToSectionInput,
  GetQuestionsBySectionIdInput,
  GetQuestionByIdInput,
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
        message: 'Tạo bài kiểm tra thành công',
        data: newTest,
      });
    } catch (error) {
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
          message: 'Bài kiểm tra không tồn tại',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lấy bài kiểm tra thành công',
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
        message: 'Lấy danh sách bài kiểm tra thành công',
        data: tests,
        count: tests.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // Section management
  public createSection = async (
    req: Request<CreateSectionInput['params'], {}, CreateSectionInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { testId } = req.params;
      const sectionData = req.body;

      const createSectionData: {
        testId: string;
        title: string;
        skill: string;
        durationInSeconds?: number;
        totalQuestions?: number;
        totalScore?: number;
      } = {
        testId,
        title: sectionData.title,
        skill: sectionData.skill,
      };

      if (sectionData.durationInSeconds !== undefined) {
        createSectionData.durationInSeconds = sectionData.durationInSeconds;
      }
      if (sectionData.totalQuestions !== undefined) {
        createSectionData.totalQuestions = sectionData.totalQuestions;
      }
      if (sectionData.totalScore !== undefined) {
        createSectionData.totalScore = sectionData.totalScore;
      }

      const newSection = await this.testService.createSection(createSectionData);

      res.status(201).json({
        success: true,
        message: 'Tạo phần mới thành công',
        data: newSection,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Bài kiểm tra không tồn tại') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  public getSectionsByTestId = async (
    req: Request<GetSectionsByTestIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { testId } = req.params;
      const sections = await this.testService.getSectionsByTestId(testId);

      res.status(200).json({
        success: true,
        message: 'Lấy danh sách phần mới thành công',
        data: sections,
        count: sections.length,
      });
    } catch (error) {
      next(error);
    }
  };

  public getSectionById = async (
    req: Request<GetSectionByIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sectionId } = req.params;
      const section = await this.testService.getSectionById(sectionId);

      if (!section) {
        res.status(404).json({
          success: false,
          message: 'Phần không tồn tại',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lấy phần mới thành công',
        data: section,
      });
    } catch (error) {
      next(error);
    }
  };

  // Passage management
  public addPassageToSection = async (
    req: Request<AddPassageToSectionInput['params'], {}, AddPassageToSectionInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sectionId } = req.params;
      const passageData = req.body;

      const addPassageData: {
        sectionId: string;
        content: string;
        passageOrder?: number;
      } = {
        sectionId,
        content: passageData.content,
      };

      if (passageData.passageOrder !== undefined) {
        addPassageData.passageOrder = passageData.passageOrder;
      }

      const newPassage = await this.testService.addPassageToSection(addPassageData);

      res.status(201).json({
        success: true,
        message: 'Thêm đoạn mới thành công',
        data: newPassage,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Phần không tồn tại') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  public getPassagesBySectionId = async (
    req: Request<GetPassagesBySectionIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sectionId } = req.params;
      const passages = await this.testService.getPassagesBySectionId(sectionId);

      res.status(200).json({
        success: true,
        message: 'Lấy danh sách đoạn mới thành công',
        data: passages,
        count: passages.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // Question management
  public addQuestionToSection = async (
    req: Request<AddQuestionToSectionInput['params'], {}, AddQuestionToSectionInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sectionId } = req.params;
      const questionData = req.body;

      // Validate question type requirements
      if (questionData.questionType === 'MULTIPLE_CHOICE') {
        if (!questionData.options || questionData.options.length === 0) {
          res.status(400).json({
            success: false,
            message: 'Câu hỏi MULTIPLE_CHOICE phải có các lựa chọn',
          });
          return;
        }
        if (questionData.correctAnswerIndex === undefined) {
          res.status(400).json({
            success: false,
            message: 'Câu hỏi MULTIPLE_CHOICE phải có chỉ số đáp án đúng',
          });
          return;
        }
      } else if (questionData.questionType === 'ESSAY') {
        if (!questionData.wordLimit) {
          res.status(400).json({
            success: false,
            message: 'Câu hỏi ESSAY phải có giới hạn số từ',
          });
          return;
        }
      } else if (questionData.questionType === 'FILL_IN_THE_BLANK') {
        if (!questionData.correctAnswer) {
          res.status(400).json({
            success: false,
            message: 'Câu hỏi FILL_IN_THE_BLANK phải có đáp án đúng',
          });
          return;
        }
      }

      const addQuestionData: {
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
      } = {
        sectionId,
        passageId: questionData.passageId,
        mediaId: questionData.mediaId,
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
      if (questionData.wordLimit !== undefined) {
        addQuestionData.wordLimit = questionData.wordLimit;
      }
      if (questionData.imageUrl !== undefined) {
        addQuestionData.imageUrl = questionData.imageUrl;
      }
      if (questionData.questionOrder !== undefined) {
        addQuestionData.questionOrder = questionData.questionOrder;
      }

      const newQuestion = await this.testService.addQuestionToSection(addQuestionData);

      res.status(201).json({
        success: true,
        message: 'Thêm câu hỏi mới thành công',
        data: newQuestion,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('MULTIPLE_CHOICE') || 
            error.message.includes('ESSAY') || 
            error.message.includes('FILL_IN_THE_BLANK')) {
          res.status(400).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  public getQuestionsBySectionId = async (
    req: Request<GetQuestionsBySectionIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sectionId } = req.params;
      const questions = await this.testService.getQuestionsBySectionId(sectionId);

      res.status(200).json({
        success: true,
        message: 'Lấy danh sách câu hỏi thành công',
        data: questions,
        count: questions.length,
      });
    } catch (error) {
      next(error);
    }
  };

  public getQuestionById = async (
    req: Request<GetQuestionByIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { questionId } = req.params;
      const question = await this.testService.getQuestionById(questionId);

      if (!question) {
        res.status(404).json({
          success: false,
          message: 'Câu hỏi không tồn tại',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lấy câu hỏi thành công',
        data: question,
      });
    } catch (error) {
      next(error);
    }
  };
}