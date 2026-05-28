import { Request, Response, NextFunction } from "express";
import { generateExamSchema, submitExamSchema } from "./placement.schema.js";
import { placementService } from "./placement.service.js";

export class PlacementController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) ?? (req.body?.userId as string);
      const { userId: validUserId } = generateExamSchema.parse({ userId });
      const exam = await placementService.generateExam(validUserId);
      res.status(200).json({ message: "Exam generated", data: exam });
    } catch (error: unknown) {
      if (error instanceof Error && (error as Error & { code?: string }).code === "insufficient_questions") {
        const e = error as Error & { detail?: string };
        return res.status(409).json({ error: "insufficient_questions", detail: e.detail });
      }
      next(error);
    }
  }

  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = submitExamSchema.parse({
        sessionId: req.body.session_id ?? req.body.sessionId,
        userId: req.body.userId,
        answers: req.body.answers,
      });
      const result = await placementService.submitExam(parsed);
      res.status(200).json({ message: "Exam graded", data: result });
    } catch (error) {
      next(error);
    }
  }

  async result(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.session_id as string;
      const userId = (req.query.userId as string) ?? "";
      if (!userId) {
        return res.status(400).json({ error: "userId query required" });
      }
      const result = await placementService.getResult(sessionId, userId);
      res.status(200).json({ message: "Result fetched", data: result });
    } catch (error) {
      next(error);
    }
  }

  async latest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) ?? "";
      if (!userId) {
        return res.status(400).json({ error: "userId query required" });
      }
      const result = await placementService.getLatestForUser(userId);
      res.status(200).json({ message: "Latest placement fetched", data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const placementController = new PlacementController();
