import { Router, Request, Response, NextFunction } from "express";
import { advisorService, sseConnections } from "./advisor.service.js";
import { memoryService } from "./memory.service.js";
import { databaseService } from "../../services/database.service.js";
import { authenticateToken, JwtPayload } from "@capstone/common";
import jwt from "jsonwebtoken";

const router = Router();

// Custom auth middleware for SSE stream since EventSource cannot set headers
const authenticateStreamToken = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined = req.query.token as string | undefined;
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader ? authHeader.split(" ")[1] : undefined;
  }

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(500).json({ error: "ACCESS_TOKEN_SECRET not defined" });
    return;
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ─── SSE Endpoint ─────────────────────────────────────────────────────────────
// Frontend connects here once; server pushes advisor_action events.
// Auth: expects token in query param or Authorization header

/**
 * GET /api/ai/advisor/stream?userId=xxx&token=yyy
 * Server-Sent Events connection for real-time advisor pushes.
 */
router.get("/stream", authenticateStreamToken, (req: Request, res: Response) => {
  const userId = req.user!.userId;

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
 * Body: { query: string }
 */
router.post("/chat", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { query } = req.body as { query: string };

  if (!query) {
    res.status(400).json({ error: "query is required" });
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
router.post("/analyze", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const input = req.body;

  if (!input) {
    res.status(400).json({ error: "Input body required" });
    return;
  }

  // Force userId to match authenticated user
  input.userId = userId;

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
 * Body: { skill, bandScore, weakPoints? }
 */
router.post("/profile/update", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { skill, bandScore } = req.body as {
    skill: string;
    bandScore: number;
  };

  if (!skill || bandScore === undefined) {
    res.status(400).json({ error: "skill and bandScore required" });
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
 * Body: { actionId }
 */
router.post("/acknowledge", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { actionId } = req.body as { actionId: string };

  if (!actionId) {
    res.status(400).json({ error: "actionId required" });
    return;
  }

  try {
    const prisma = databaseService.getClient();

    // Verify ownership of the action log entry
    const action = await prisma.advisorActionLog.findUnique({
      where: { id: actionId },
      select: { userId: true },
    });

    if (!action) {
      res.status(404).json({ error: "Action not found" });
      return;
    }

    if (action.userId !== userId) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

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
router.get("/profile/:userId", authenticateToken, async (req: Request, res: Response) => {
  const authenticatedUserId = req.user!.userId;
  const { userId } = req.params;

  if (authenticatedUserId !== userId) {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }

  try {
    const profile = await memoryService.getOrCreate(String(userId));
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
