// =============================================================================
// AI Evaluation Service - Learning Path / Target Setting Routes (TASK-11)
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { llmClient } from "../../llm/llm.client.js";

const router = Router();

const LEARNING_PATH_PROMPT = `You are an English language learning path planner.

Based on the student's current level, target score, and deadline, create a structured learning roadmap.

RULES:
- Return ONLY valid JSON, no other text
- Create 4-8 milestones spread across the deadline period
- Each milestone has: id, title, description, weekNumber (when to complete), skills (array of skill tags), difficulty ("beginner" | "intermediate" | "advanced")

OUTPUT FORMAT:
{
  "milestones": [
    {
      "id": "m1",
      "title": "Foundation Grammar",
      "description": "Master basic tenses and sentence structures",
      "weekNumber": 2,
      "skills": ["grammar", "sentence-structure"],
      "difficulty": "beginner"
    }
  ],
  "weeklyHours": 5,
  "estimatedFinalScore": "6.0"
}`;

/**
 * POST /api/ai/learning-path/generate
 * Generate a personalized learning path
 * Input: { userId, currentLevel, targetScore, deadline, examType }
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { userId, currentLevel, targetScore, deadline, examType } = req.body;

    if (!userId || !currentLevel || !targetScore || !deadline) {
      res.status(400).json({
        success: false,
        error: "userId, currentLevel, targetScore, and deadline are required",
      });
      return;
    }

    const prisma = databaseService.getClient();

    // Ask AI to generate learning path
    const userMessage = JSON.stringify({
      currentLevel,
      targetScore,
      deadline,
      examType: examType || "IELTS",
    });

    const aiResponse = await llmClient.chatCompletion(LEARNING_PATH_PROMPT, userMessage, { jsonMode: true });
    const roadmap = JSON.parse(aiResponse);

    // Save learning goal (examType stored inside roadmap JSON)
    const goal = await prisma.userLearningGoal.create({
      data: {
        userId,
        currentLevel,
        targetScore,
        deadline: deadline,
        roadmap: { ...roadmap, examType: examType || "IELTS" },
      },
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error: any) {
    console.error("❌ [LearningPath] Generate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai/learning-path/:userId
 * Get user's active learning path
 */
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const prisma = databaseService.getClient();

    const goals = await prisma.userLearningGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error: any) {
    console.error("❌ [LearningPath] Get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/ai/learning-path/:goalId/milestone
 * Mark a milestone as completed
 */
router.patch("/:goalId/milestone", async (req: Request, res: Response) => {
  try {
    const goalId = req.params.goalId as string;
    const { milestoneId } = req.body;

    if (!milestoneId) {
      res.status(400).json({ success: false, error: "milestoneId is required" });
      return;
    }

    const prisma = databaseService.getClient();

    const goal = await prisma.userLearningGoal.findUnique({ where: { id: goalId as string } });
    if (!goal) {
      res.status(404).json({ success: false, error: "Learning goal not found" });
      return;
    }

    // Mark milestone as completed in the roadmap
    const roadmap = goal.roadmap as any;
    if (roadmap?.milestones) {
      roadmap.milestones = roadmap.milestones.map((m: any) =>
        m.id === milestoneId ? { ...m, completedAt: new Date().toISOString() } : m
      );
    }

    const updated = await prisma.userLearningGoal.update({
      where: { id: goalId },
      data: { roadmap, updatedAt: new Date() },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("❌ [LearningPath] Update error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
