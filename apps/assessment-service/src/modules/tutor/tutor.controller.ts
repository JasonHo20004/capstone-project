import { Request, Response, NextFunction } from "express";
import { tutorService } from "./tutor.service.js";

export class TutorController {

  /**
   * GET /tutor/sessions?practiceSessionId=xxx
   * Get all tutor sessions for a practice session
   */
  public async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const { practiceSessionId } = req.query;
      const userId = req.user?.userId;

      if (!practiceSessionId || !userId) {
        return res.status(400).json({ success: false, error: "practiceSessionId and auth required" });
      }

      const sessions = await tutorService.getSessionsByPractice(
        practiceSessionId as string,
        userId
      );

      return res.json({ success: true, data: sessions });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /tutor/sessions
   * Get or create a session for a specific question
   * Body: { practiceSessionId, questionId }
   */
  public async getOrCreateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { practiceSessionId, questionId } = req.body;
      const userId = req.user?.userId;

      if (!practiceSessionId || !questionId || !userId) {
        return res.status(400).json({ success: false, error: "practiceSessionId, questionId, and auth required" });
      }

      const session = await tutorService.getOrCreateSession(practiceSessionId, questionId, userId);
      return res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /tutor/sessions/:sessionId/messages
   * Add a message to a tutor session
   * Body: { role, content }
   */
  public async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { role, content } = req.body;

      if (!sessionId || !role || !content) {
        return res.status(400).json({ success: false, error: "sessionId, role, and content required" });
      }

      const message = await tutorService.addMessage(sessionId as string, role, content);
      return res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /tutor/sessions/:sessionId
   * Get a single session with all messages
   */
  public async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const session = await tutorService.getSession(sessionId as string);
      return res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }
}

export const tutorController = new TutorController();
