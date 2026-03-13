// =============================================================================
// AI Evaluation Service - Writing Evaluation Routes (TASK-04)
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { queueService } from "../../queue/queue.service.js";
import { JobType, WritingJobData } from "../../queue/types.js";

const router = Router();

/**
 * POST /api/ai/assessments/writing/submit
 * Submit essay for AI evaluation
 * Returns jobId immediately; grading happens in BullMQ worker
 */
router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { userId, essayText, questionId, sessionId } = req.body;

    if (!userId || !essayText) {
      res.status(400).json({
        success: false,
        error: "userId and essayText are required",
      });
      return;
    }

    if (essayText.length < 50) {
      res.status(400).json({
        success: false,
        error: "Essay is too short. Please write at least 50 characters.",
      });
      return;
    }

    const prisma = databaseService.getClient();

    // Create evaluation record in PENDING state
    const evaluation = await prisma.writingEvaluation.create({
      data: {
        userId,
        essayText,
        questionId: questionId || null,
        sessionId: sessionId || null,
        status: "PENDING",
      },
    });

    // Push to BullMQ queue
    const jobData: WritingJobData = {
      type: JobType.GRADE_WRITING,
      evaluationId: evaluation.id,
      userId,
      essayText,
      questionId,
      sessionId,
    };

    const jobId = await queueService.addJob(jobData);

    // Update evaluation with jobId
    await prisma.writingEvaluation.update({
      where: { id: evaluation.id },
      data: { jobId },
    });

    res.status(202).json({
      success: true,
      data: {
        evaluationId: evaluation.id,
        jobId,
        status: "PENDING",
        message: "Essay submitted for AI evaluation. This usually takes 15-30 seconds.",
      },
    });
  } catch (error: any) {
    console.error("❌ [Writing] Submit error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit essay",
    });
  }
});

/**
 * GET /api/ai/assessments/writing/:evaluationId
 * Poll for evaluation result
 */
router.get("/:evaluationId", async (req: Request, res: Response) => {
  try {
    const evaluationId = req.params.evaluationId as string;
    const prisma = databaseService.getClient();

    const evaluation = await prisma.writingEvaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!evaluation) {
      res.status(404).json({
        success: false,
        error: "Evaluation not found",
      });
      return;
    }

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error: any) {
    console.error("❌ [Writing] Get error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get evaluation",
    });
  }
});

/**
 * GET /api/ai/assessments/writing/user/:userId
 * Get all writing evaluations for a user
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const prisma = databaseService.getClient();

    const evaluations = await prisma.writingEvaluation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error: any) {
    console.error("❌ [Writing] List error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list evaluations",
    });
  }
});

export default router;
