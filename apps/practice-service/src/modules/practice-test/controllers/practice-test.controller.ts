import { Request, Response, NextFunction } from "express";
import { practiceTestService } from "../services/practice-test.service.js";
import { CreatePracticeTestSchema } from "../models/practice-test.schema.js";

export class PracticeTestController {
  
  public async createPracticeTest(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate incoming nested JSON with Zod
      const validatedData = CreatePracticeTestSchema.parse(req.body);
      
      const newTest = await practiceTestService.createTest(validatedData);
      
      res.status(201).json({
        message: "Practice test created successfully",
        data: newTest
      });
    } catch (error) {
      next(error);
    }
  }

  public async getTestsSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const tests = await practiceTestService.getAllTests();
      res.status(200).json({
        message: "Fetches tests successfully",
        data: tests
      });
    } catch (error) {
      next(error);
    }
  }

  public async getTestDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const test = await practiceTestService.getTestById(id);

      // IMPORTANT: Remove 'answer' from the payload so students can't cheat by inspecting network tab
      // For a real production app, we would use a more robust transformation layer (like DTO mappers)
      // but for this, we'll strip it manually before sending.
      const sanitizeGroup = (group: any) => ({
        ...group,
        questions: group.questions.map((q: any) => {
          const { answer, explanation, ...safeQuestion } = q;
          return safeQuestion;
        })
      });

      const safeTest = {
        ...test,
        sections: test.sections.map((section: any) => ({
          ...section,
          parts: section.parts.map((part: any) => ({
            ...part,
            questionGroups: part.questionGroups.map(sanitizeGroup)
          }))
        }))
      };

      res.status(200).json({
        message: "Test fetched successfully",
        data: safeTest
      });
    } catch (error) {
      next(error);
    }
  }

  public async submitTest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      
      // Expected payload format: { submissions: { "question_uuid_1": "answer", "question_uuid_2": ["A", "B"] } }
      const submissions = req.body.submissions || {};
      
      const gradingResult = await practiceTestService.gradeTest(id, submissions);
      
      res.status(200).json({
        message: "Test submitted and graded successfully",
        data: gradingResult
      });
    } catch (error) {
      next(error);
    }
  }
}

export const practiceTestController = new PracticeTestController();
