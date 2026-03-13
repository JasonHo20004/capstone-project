// =============================================================================
// AI Evaluation Service - Transcription Route (TASK-02)
// =============================================================================

import { Router, Request, Response } from "express";
import { llmClient } from "../../llm/llm.client.js";

const router = Router();

/**
 * POST /api/ai/transcribe
 * Input: { audioUrl: string }
 * Output: { transcript: string, duration: number }
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { audioUrl } = req.body;

    if (!audioUrl || typeof audioUrl !== "string") {
      res.status(400).json({
        success: false,
        error: "audioUrl is required and must be a string",
      });
      return;
    }

    // Download audio from S3 URL
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      res.status(400).json({
        success: false,
        error: `Failed to download audio: ${audioResponse.statusText}`,
      });
      return;
    }

    const contentType = audioResponse.headers.get("content-type") || "audio/webm";
    const audioBlob = await audioResponse.blob();
    const audioFile = new File([audioBlob], "audio.webm", { type: contentType });

    // Transcribe using Groq Whisper
    const result = await llmClient.transcribeAudio(audioFile, "audio.webm");

    res.json({
      success: true,
      data: {
        transcript: result.transcript,
        duration: result.duration,
      },
    });
  } catch (error: any) {
    console.error("❌ [Transcription] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Transcription failed",
    });
  }
});

export default router;
