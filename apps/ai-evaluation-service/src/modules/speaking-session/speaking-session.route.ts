// =============================================================================
// Interactive Speaking Session - API Routes
// =============================================================================

import { Router, Request, Response } from "express";
import { SpeakingSessionService } from "./speaking-session.service.js";
import { s3Service } from "../../services/s3.service.js";

const router = Router();

/**
 * POST /api/ai/speaking-sessions/start
 * Start a new interactive speaking session
 */
router.post("/start", async (req: Request, res: Response) => {
  try {
    const { userId, topic } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, error: "userId is required" });
      return;
    }

    const result = await SpeakingSessionService.startSession(userId, topic);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] Start error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to start speaking session",
    });
  }
});

/**
 * POST /api/ai/speaking-sessions/upload-url
 * Get a presigned S3 URL for frontend to upload audio directly
 */
router.post("/upload-url", async (_req: Request, res: Response) => {
  try {
    const result = await s3Service.getPresignedUploadUrl("speaking", ".webm", "audio/webm");

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] Upload URL error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate upload URL",
    });
  }
});

/**
 * POST /api/ai/speaking-sessions/:id/respond
 * Submit audio response to current question
 * Body: { audio: base64 string, mimeType?: string }
 *   OR  { audioUrl: S3 URL }
 */
router.post("/:id/respond", async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.id);
    const { audio, audioUrl, mimeType } = req.body;

    let audioBase64: string;
    let finalAudioUrl: string | undefined;
    const audioMimeType = mimeType || "audio/webm";

    if (audioUrl) {
      // S3 URL provided — download and convert to base64
      finalAudioUrl = audioUrl;
      const buffer = await s3Service.downloadAsBuffer(audioUrl);
      audioBase64 = buffer.toString("base64");
    } else if (audio) {
      // Base64 provided — upload to S3 for permanent storage
      audioBase64 = audio;
      const buffer = Buffer.from(audio, "base64");
      finalAudioUrl = await s3Service.uploadBuffer(buffer, "speaking", audioMimeType);
    } else {
      res.status(400).json({ success: false, error: "audio (base64) or audioUrl is required" });
      return;
    }

    const result = await SpeakingSessionService.respondToQuestion(
      sessionId,
      audioBase64,
      audioMimeType,
      finalAudioUrl
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] Respond error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process response",
    });
  }
});

/**
 * POST /api/ai/speaking-sessions/:id/finish
 * End session early and trigger grading
 */
router.post("/:id/finish", async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.id);
    await SpeakingSessionService.finishSession(sessionId);

    res.json({
      success: true,
      data: {
        status: "GRADING",
        message: "Session ended. Grading in progress, this may take 30-60 seconds.",
      },
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] Finish error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to finish session",
    });
  }
});

/**
 * GET /api/ai/speaking-sessions/:id
 * Get session details + current state
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.id);
    const session = await SpeakingSessionService.getResult(sessionId);

    if (!session) {
      res.status(404).json({ success: false, error: "Session not found" });
      return;
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] Get error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get session",
    });
  }
});

/**
 * GET /api/ai/speaking-sessions/:id/result
 * Get final grading result (only available when status = COMPLETED)
 */
router.get("/:id/result", async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.id);
    const session = await SpeakingSessionService.getResult(sessionId);

    if (!session) {
      res.status(404).json({ success: false, error: "Session not found" });
      return;
    }

    if (session.status === "IN_PROGRESS") {
      res.json({
        success: true,
        data: { status: "IN_PROGRESS", message: "Session is still in progress." },
      });
      return;
    }

    if (session.status === "GRADING") {
      res.json({
        success: true,
        data: { status: "GRADING", message: "Grading in progress. Please check again in 30-60 seconds." },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        status: session.status,
        topic: session.topic,
        overallBand: session.overallBand,
        scores: {
          fluency: session.fluencyScore,
          lexical: session.lexicalScore,
          grammar: session.grammarScore,
          pronunciation: session.pronunciationScore,
        },
        detailedFeedback: session.detailedFeedback,
        completedAt: session.completedAt,
      },
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] Result error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get result",
    });
  }
});

/**
 * GET /api/ai/speaking-sessions/user/:userId
 * List all speaking sessions for a user
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const sessions = await SpeakingSessionService.listUserSessions(userId);

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.error("❌ [Speaking Session] List error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list sessions",
    });
  }
});

export default router;
