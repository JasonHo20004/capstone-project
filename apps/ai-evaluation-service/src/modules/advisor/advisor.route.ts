// =============================================================================
// AI Advisor — Route
// SSE endpoint + REST endpoints for reactive and proactive AI advisor.
// =============================================================================

import { Router, Request, Response } from "express";
import { advisorService, sseConnections } from "./advisor.service.js";
import { memoryService } from "./memory.service.js";
import { databaseService } from "../../services/database.service.js";

const router = Router();

// ─── SSE Endpoint ─────────────────────────────────────────────────────────────
// Frontend connects here once; server pushes advisor_action events.
// Auth: expects userId in query param (backend should validate JWT in middleware)

/**
 * GET /api/ai/advisor/stream?userId=xxx
 * Server-Sent Events connection for real-time advisor pushes.
 */
router.get("/stream", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(400).json({ error: "userId required" });
    return;
  }

  // SSE headers — critical for streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
  res.flushHeaders();

  // Register this connection
  sseConnections.set(userId, res);
  console.log(`🔌 [Advisor SSE] User ${userId} connected (${sseConnections.size} total)`);

  // Send initial heartbeat so client knows connection is alive
  res.write("event: connected\n");
  res.write(`data: ${JSON.stringify({ status: "connected", userId })}\n\n`);

  // Heartbeat every 30s to prevent proxy timeout
  const heartbeat = setInterval(() => {
    try {
      res.write("event: heartbeat\n");
      res.write(`data: ${JSON.stringify({ ts: Date.now() })}\n\n`);
    } catch {
      clearInterval(heartbeat);
    }
  }, 30_000);

  // Mark user as active in memory
  memoryService.markActivity(userId).catch(() => {});

  // Cleanup on disconnect
  req.on("close", () => {
    clearInterval(heartbeat);
    sseConnections.delete(userId);
    console.log(`🔌 [Advisor SSE] User ${userId} disconnected (${sseConnections.size} total)`);
  });
});

// ─── Reactive Chat ─────────────────────────────────────────────────────────────

/**
 * POST /api/ai/advisor/chat
 * User asks the AI Advisor a question directly.
 * Body: { userId: string, query: string }
 */
router.post("/chat", async (req: Request, res: Response) => {
  const { userId, query } = req.body as { userId: string; query: string };

  if (!userId || !query) {
    res.status(400).json({ error: "userId and query are required" });
    return;
  }

  try {
    const action = await advisorService.chat(userId, query);
    res.json({ success: true, action });
  } catch (err) {
    console.error("[Advisor] Chat error:", err);
    res.status(500).json({ error: "Advisor service unavailable" });
  }
});

// ─── Post-Quiz Analysis ─────────────────────────────────────────────────────────

/**
 * POST /api/ai/advisor/analyze
 * Called internally after quiz completion to update memory and push insight.
 * Body: AnalyzeQuizInput
 */
router.post("/analyze", async (req: Request, res: Response) => {
  const input = req.body;

  if (!input?.userId) {
    res.status(400).json({ error: "userId required" });
    return;
  }

  try {
    const action = await advisorService.analyzeAndAdvise(input);
    res.json({ success: true, action });
  } catch (err) {
    console.error("[Advisor] Analyze error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// ─── Profile Update (from external services) ───────────────────────────────────

/**
 * POST /api/ai/advisor/profile/update
 * Called by assessment-service after writing/speaking evaluation.
 * Body: { userId, skill, bandScore, weakPoints? }
 */
router.post("/profile/update", async (req: Request, res: Response) => {
  const { userId, skill, bandScore } = req.body as {
    userId: string;
    skill: string;
    bandScore: number;
  };

  if (!userId || !skill || bandScore === undefined) {
    res.status(400).json({ error: "userId, skill, and bandScore required" });
    return;
  }

  try {
    await memoryService.updateFromQuiz({
      userId,
      source: skill === "writing" ? "writing_eval" : "speaking_eval",
      skill,
      bandScore,
    });

    // Also trigger analysis to push a banner if gap is significant
    await advisorService.analyzeAndAdvise({
      userId,
      source: skill === "writing" ? "writing_eval" : "speaking_eval",
      skill,
      bandScore,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("[Advisor] Profile update error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

// ─── Acknowledge Action ─────────────────────────────────────────────────────────

/**
 * POST /api/ai/advisor/acknowledge
 * User dismissed/acted on a banner — marks it as acknowledged.
 * Body: { userId, actionId }
 */
router.post("/acknowledge", async (req: Request, res: Response) => {
  const { userId, actionId } = req.body as { userId: string; actionId: string };

  if (!userId || !actionId) {
    res.status(400).json({ error: "userId and actionId required" });
    return;
  }

  try {
    const prisma = databaseService.getClient();
    await prisma.advisorActionLog.update({
      where: { id: actionId },
      data: { acknowledgedAt: new Date() },
    });
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: "Action not found" });
  }
});

// ─── Get Profile (for debugging / learning path page) ─────────────────────────

/**
 * GET /api/ai/advisor/profile/:userId
 */
router.get("/profile/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const profile = await memoryService.getOrCreate(userId);
    const criticalGaps = memoryService.getCriticalGaps(
      profile.skillGaps,
      profile.bandScoreTarget
    );
    res.json({ success: true, profile, criticalGaps });
  } catch (err) {
    res.status(500).json({ error: "Failed to get profile" });
  }
});

export default router;
