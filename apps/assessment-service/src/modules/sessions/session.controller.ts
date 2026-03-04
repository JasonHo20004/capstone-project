import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { practiceSessionService } from "./session.service.js";

const CreateSessionSchema = z.object({
  userId: z.string().uuid(),
  testId: z.string().uuid(),
  selectedSections: z.array(z.string()).optional().default([]),
});

const SubmitSessionSchema = z.object({
  userId: z.string().uuid(),
  submissions: z.record(z.string(), z.any()),
});

export class SessionController {
  public async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, testId, selectedSections } = CreateSessionSchema.parse(req.body);
      const session = await practiceSessionService.createSession(userId, testId, selectedSections);
      res.status(201).json({ message: "Session started", data: session });
    } catch (error) {
      next(error);
    }
  }

  public async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const session = await practiceSessionService.getSession(id);
      res.status(200).json({ message: "Session fetched", data: session });
    } catch (error) {
      next(error);
    }
  }

  public async submitSession(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { userId, submissions } = SubmitSessionSchema.parse(req.body);
      const result = await practiceSessionService.submitSession(id, userId, submissions);
      res.status(200).json({ message: "Session submitted and graded", data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const sessionController = new SessionController();
