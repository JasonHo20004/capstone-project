// =============================================================================
// AI Evaluation Service - Speaking Evaluation Routes (TASK-06)
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { queueService } from "../../queue/queue.service.js";
import { JobType, SpeakingJobData } from "../../queue/types.js";

const router = Router();

/**
 * POST /api/ai/assessments/speaking/submit
 * Submit audio URL for AI speaking evaluation
 * Returns jobId immediately; STT + grading happens in BullMQ worker
 */
router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { userId, audioUrl, questionId, sessionId } = req.body;

    if (!userId || !audioUrl) {
      res.status(400).json({
        success: false,
        error: "userId and audioUrl are required",
      });
      return;
    }

    const prisma = databaseService.getClient();

    // Create evaluation record in PENDING state
    const evaluation = await prisma.speakingEvaluation.create({
      data: {
        userId,
        audioUrl,
        questionId: questionId || null,
        sessionId: sessionId || null,
        status: "PENDING",
      },
    });

    // Push to BullMQ queue
    const jobData: SpeakingJobData = {
      type: JobType.GRADE_SPEAKING,
      evaluationId: evaluation.id,
      userId,
      audioUrl,
      questionId,
      sessionId,
    };

    const jobId = await queueService.addJob(jobData);

    // Update evaluation with jobId
    await prisma.speakingEvaluation.update({
      where: { id: evaluation.id },
      data: { jobId },
    });

    res.status(202).json({
      success: true,
      data: {
        evaluationId: evaluation.id,
        jobId,
        status: "PENDING",
        message: "Audio submitted for AI evaluation. Transcription + grading usually takes 30-60 seconds.",
      },
    });
  } catch (error: any) {
    console.error("❌ [Speaking] Submit error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit audio",
    });
  }
});

/**
 * GET /api/ai/assessments/speaking/:evaluationId
 * Poll for speaking evaluation result
 */
router.get("/:evaluationId", async (req: Request, res: Response) => {
  try {
    const evaluationId = req.params.evaluationId as string;
    const prisma = databaseService.getClient();

    const evaluation = await prisma.speakingEvaluation.findUnique({
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
    console.error("❌ [Speaking] Get error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get evaluation",
    });
  }
});

/**
 * GET /api/ai/assessments/speaking/user/:userId
 * Get all speaking evaluations for a user
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const prisma = databaseService.getClient();

    const evaluations = await prisma.speakingEvaluation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error: any) {
    console.error("❌ [Speaking] List error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list evaluations",
    });
  }
});

export default router;
