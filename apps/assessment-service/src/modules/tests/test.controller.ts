import { Request, Response, NextFunction } from "express";
import { testService } from "./test.service.js";
import { CreateTestSchema } from "./test.schema.js";

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
      const test = await testService.getTestById(id);
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
}

export const testController = new TestController();
