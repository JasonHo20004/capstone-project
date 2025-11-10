import type {Response } from "express";
import { PracticeSessionService } from "@/modules/practice_sessions/services/practiceSession.service";
import type { StartSessionInput } from "@/modules/practice_sessions/dtos/practiceSession.dto"
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class PracticeSessionController {
  private practiceSessionService = new PracticeSessionService();

  public startSession = async (
    req: AuthenticatedRequest & { body: StartSessionInput["body"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const{testId,sectionIds} = req.body
      const newSession = await this.practiceSessionService.startSession(userId, testId, sectionIds);
      res.status(200).json({
        success: true,
        message: "Start Practice Session successfully",
        data: newSession,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to Start Practice Session",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

}
