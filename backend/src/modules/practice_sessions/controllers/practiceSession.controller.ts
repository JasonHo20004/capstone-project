import type {Response } from "express";
import { PracticeSessionService } from "@/modules/practice_sessions/services/practiceSession.service";
import type { StartSessionInput ,AnswerQuestionInput, SubmitInput} from "@/modules/practice_sessions/dtos/practiceSession.dto"
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

  public answerQuestion = async (
    req: AuthenticatedRequest & { body: AnswerQuestionInput["body"] ; params:AnswerQuestionInput['params']},
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const{questionId,selectedOptionIndex, answerText} = req.body
      const {sessionId} = req.params
      const newAnswer = await this.practiceSessionService.answerQuestion(userId, {questionId,selectedOptionIndex, answerText, sessionId});
      res.status(200).json({
        success: true,
        message: "Answer question successfully",
        data: newAnswer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to answer this question",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public submit = async (
    req: AuthenticatedRequest & { params:SubmitInput['params']},
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const {sessionId} = req.params
      const newAnswer = await this.practiceSessionService.submit(userId, sessionId);
      res.status(200).json({
        success: true,
        message: "Answer question successfully",
        data: newAnswer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to answer this question",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
