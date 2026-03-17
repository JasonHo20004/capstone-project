import { Request, Response, NextFunction } from "express";
import { testService } from "./test.service.js";
import { CreateTestSchema } from "./test.schema.js";
import { s3Service } from "../../services/s3.service.js";

export class TestController {
  public async getAllTests(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const tests = await testService.getAllTests(status);
      res.status(200).json({ message: "Tests retrieved", data: tests });
    } catch (error) {
      next(error);
    }
  }

  public async getTestById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const includeAnswers = req.query.includeAnswers === 'true';
      const test = await testService.getTestById(id, { includeAnswers });
      res.status(200).json({ message: "Test retrieved", data: test });
    } catch (error) {
      next(error);
    }
  }

  public async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateTestSchema.parse(req.body);
      const test = await testService.createTest(data);
      res.status(201).json({ message: "Test created", data: test });
    } catch (error) {
      next(error);
    }
  }

  public async updateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const test = await testService.updateTest(id, req.body);
      res.status(200).json({ message: "Test updated", data: test });
    } catch (error) {
      next(error);
    }
  }

  public async deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await testService.deleteTest(id);
      res.status(200).json({ message: "Test deleted", data: result });
    } catch (error) {
      next(error);
    }
  }

  public async getTestTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await testService.getTestTypes();
      res.status(200).json({ message: "Test types retrieved", data: types });
    } catch (error) {
      next(error);
    }
  }

  public async uploadAudio(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No audio file provided" });
        return;
      }
      const url = await s3Service.uploadFile(file, "audio");
      res.status(200).json({ message: "Audio uploaded", data: { url } });
    } catch (error) {
      next(error);
    }
  }

  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No image file provided" });
        return;
      }
      const url = await s3Service.uploadFile(file, "images");
      res.status(200).json({ message: "Image uploaded", data: { url } });
    } catch (error) {
      next(error);
    }
  }

  public async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const testId = req.params.id as string;
      const { userId } = req.body as { userId?: string };
      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }
      const result = await testService.startSession(testId, userId);
      res.status(201).json({ message: "Session started", data: result });
    } catch (error) {
      next(error);
    }
  }

  public async submitTest(req: Request, res: Response, next: NextFunction) {
    try {
      const testId = req.params.id as string;
      const { submissions, userId } = req.body as { submissions: Record<string, string>; userId?: string };
      if (!submissions || typeof submissions !== "object") {
        res.status(400).json({ message: "submissions object is required" });
        return;
      }
      const result = await testService.gradeTest(testId, submissions, userId);
      res.status(200).json({ message: "Test graded", data: result });
    } catch (error) {
      next(error);
    }
  }

  public async getTestHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const history = await testService.getTestHistory(userId);
      res.status(200).json({ message: "History retrieved", data: history });
    } catch (error) {
      next(error);
    }
  }

  public async getAttemptDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const attempt = await testService.getAttemptDetail(sessionId);
      res.status(200).json({ message: "Attempt detail retrieved", data: attempt });
    } catch (error) {
      next(error);
    }
  }

  // TEMP: Seed score conversions
  public async seedScoreConversions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await testService.seedScoreConversions();
      res.status(200).json({ message: "Score conversions seeded", data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const testController = new TestController();
