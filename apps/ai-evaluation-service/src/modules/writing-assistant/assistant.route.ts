// =============================================================================
// AI Evaluation Service - Writing Assistant Route (TASK-08)
// Synchronous, real-time endpoint for in-editor suggestions
// =============================================================================

import { Router, Request, Response } from "express";
import { llmClient } from "../../llm/llm.client.js";
import { extractJson } from "../../llm/gemini.client.js";
import { WRITING_ASSISTANT_PROMPT } from "../../llm/prompts.js";
import { redisService } from "../../services/redis.service.js";
import crypto from "crypto";

const router = Router();

const CACHE_TTL_SECONDS = 60; // Cache identical inputs for 60s

/**
 * POST /api/ai/writing-assistant
 * Real-time writing suggestions (synchronous, fast)
 * Input: { lastSentence: string, prevSentence: string }
 * ⚠️ Cost control: Only accepts 2 sentences, NOT the entire essay
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { lastSentence, prevSentence } = req.body;

    if (!lastSentence || typeof lastSentence !== "string") {
      res.status(400).json({
        success: false,
        error: "lastSentence is required",
      });
      return;
    }

    // Cost control: reject if input is too long (max ~200 words for 2 sentences)
    const totalLength = (lastSentence?.length || 0) + (prevSentence?.length || 0);
    if (totalLength > 1000) {
      res.status(400).json({
        success: false,
        error: "Input too long. Only send the last 2 sentences.",
      });
      return;
    }

    // Check Redis cache
    const cacheKey = `writing-assistant:${crypto
      .createHash("md5")
      .update(`${prevSentence || ""}|${lastSentence}`)
      .digest("hex")}`;

    const cached = await redisService.getCached(cacheKey);
    if (cached) {
      res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });
      return;
    }

    // Build user message with only 2 sentences
    let userMessage = "";
    if (prevSentence) {
      userMessage += `Previous sentence: "${prevSentence}"\n`;
    }
    userMessage += `Current sentence: "${lastSentence}"`;

    // Use fast model for low latency
    const response = await llmClient.fastCompletion(
      WRITING_ASSISTANT_PROMPT,
      userMessage
    );

    const result = extractJson(response);

    // Cache the result
    await redisService.setWithTTL(cacheKey, JSON.stringify(result), CACHE_TTL_SECONDS);

    res.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error: any) {
    console.error("❌ [WritingAssistant] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Writing assistant failed",
    });
  }
});

export default router;
