// =============================================================================
// AI Evaluation Service - Mini Quiz Routes
// AI-generated quizzes for Dynamic Skill Tree nodes
// =============================================================================

import { Router, Request, Response } from "express";
import { miniQuizService } from "./mini-quiz.service.js";

const router = Router();

/**
 * POST /api/ai/mini-quiz/generate
 * Generate a mini quiz for a skill tree node
 * Body: { userId, skillTreeId, nodeId, topic, level, nodeLabel, nodeDescription, mixedSkills, questionTypes, questionCount? }
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const {
      userId,
      skillTreeId,
      nodeId,
      topic,
      level,
      nodeLabel,
      nodeDescription,
      mixedSkills,
      questionTypes,
      questionCount,
    } = req.body;

    if (!userId || !skillTreeId || !nodeId || !topic || !level) {
      res.status(400).json({
        success: false,
        error: "userId, skillTreeId, nodeId, topic, and level are required",
      });
      return;
    }

    const quiz = await miniQuizService.generateQuiz({
      userId,
      skillTreeId,
      nodeId,
      topic,
      level,
      nodeLabel: nodeLabel || "",
      nodeDescription: nodeDescription || "",
      mixedSkills: mixedSkills || ["grammar", "vocabulary"],
      questionTypes: questionTypes || ["MULTIPLE_CHOICE", "FILL_IN_THE_BLANK"],
      questionCount: questionCount || 6,
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error: any) {
    console.error("❌ [MiniQuiz] Generate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai/mini-quiz/:quizId
 * Get a quiz by ID
 */
router.get("/:quizId", async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId as string;
    const quiz = await miniQuizService.getQuiz(quizId);

    if (!quiz) {
      res.status(404).json({ success: false, error: "Quiz not found" });
      return;
    }

    res.json({ success: true, data: quiz });
  } catch (error: any) {
    console.error("❌ [MiniQuiz] Get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai/mini-quiz/:quizId/submit
 * Submit quiz answers for grading
 * Body: { answers: [{ questionIndex, selectedIndex?, answerText? }] }
 */
router.post("/:quizId/submit", async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId as string;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({
        success: false,
        error: "answers array is required",
      });
      return;
    }

    const result = await miniQuizService.submitQuiz({ quizId, answers });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("❌ [MiniQuiz] Submit error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
