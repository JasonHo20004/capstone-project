// =============================================================================
// Speaking Topic Bank - Admin CRUD Routes
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { geminiClient } from "../../llm/gemini.client.js";
import { SPEAKING_TOPIC_AUTOGEN_PROMPT } from "../../llm/prompts.js";

const router = Router();

/**
 * POST /api/ai/speaking-topics/auto-generate
 * Generate a full IELTS speaking topic bank from a title using Gemini.
 * Body: { title: string }
 * Returns: { part1Questions, part2Topic, part2Bullets, part2FinalPrompt, part3Questions }
 */
router.post("/auto-generate", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      res.status(400).json({ success: false, error: "title is required" });
      return;
    }
    const raw = await geminiClient.chatCompletion(
      SPEAKING_TOPIC_AUTOGEN_PROMPT,
      `Generate a complete IELTS Speaking topic bank for the title: "${title}".`,
      { temperature: 0.7 }
    );
    const parsed = JSON.parse(raw);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("[Speaking Topic] Auto-generate error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to auto-generate" });
  }
});

/**
 * POST /api/ai/speaking-topics
 * Create a new speaking topic
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const prisma = databaseService.getClient();
    const {
      title,
      isPremium,
      part1Questions,
      part2Topic,
      part2Bullets,
      part2FinalPrompt,
      part3Questions,
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "title is required" });
      return;
    }

    const topic = await prisma.speakingTopic.create({
      data: {
        title,
        isPremium: isPremium ?? false,
        part1Questions: part1Questions || [],
        part2Topic: part2Topic || null,
        part2Bullets: part2Bullets || [],
        part2FinalPrompt: part2FinalPrompt || null,
        part3Questions: part3Questions || [],
      },
    });

    res.status(201).json({ success: true, data: topic });
  } catch (error: any) {
    console.error("❌ [Speaking Topic] Create error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai/speaking-topics
 * List all speaking topics
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const prisma = databaseService.getClient();
    const activeOnly = req.query.active === "true";

    const topics = await prisma.speakingTopic.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { sessions: true } },
      },
    });

    res.json({ success: true, data: topics });
  } catch (error: any) {
    console.error("❌ [Speaking Topic] List error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai/speaking-topics/:id
 * Get a single speaking topic
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const prisma = databaseService.getClient();
    const topic = await prisma.speakingTopic.findUnique({
      where: { id: String(req.params.id) },
    });

    if (!topic) {
      res.status(404).json({ success: false, error: "Topic not found" });
      return;
    }

    res.json({ success: true, data: topic });
  } catch (error: any) {
    console.error("❌ [Speaking Topic] Get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/ai/speaking-topics/:id
 * Update a speaking topic
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const prisma = databaseService.getClient();
    const {
      title,
      isActive,
      isPremium,
      part1Questions,
      part2Topic,
      part2Bullets,
      part2FinalPrompt,
      part3Questions,
    } = req.body;

    const topic = await prisma.speakingTopic.update({
      where: { id: String(req.params.id) },
      data: {
        ...(title !== undefined && { title }),
        ...(isActive !== undefined && { isActive }),
        ...(isPremium !== undefined && { isPremium }),
        ...(part1Questions !== undefined && { part1Questions }),
        ...(part2Topic !== undefined && { part2Topic }),
        ...(part2Bullets !== undefined && { part2Bullets }),
        ...(part2FinalPrompt !== undefined && { part2FinalPrompt }),
        ...(part3Questions !== undefined && { part3Questions }),
      },
    });

    res.json({ success: true, data: topic });
  } catch (error: any) {
    console.error("❌ [Speaking Topic] Update error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/ai/speaking-topics/:id/toggle-premium
 * Toggle premium status of a speaking topic
 */
router.patch("/:id/toggle-premium", async (req: Request, res: Response) => {
  try {
    const prisma = databaseService.getClient();
    const existing = await prisma.speakingTopic.findUnique({
      where: { id: String(req.params.id) },
    });
    if (!existing) {
      res.status(404).json({ success: false, error: "Topic not found" });
      return;
    }
    const topic = await prisma.speakingTopic.update({
      where: { id: String(req.params.id) },
      data: { isPremium: !existing.isPremium },
    });
    res.json({ success: true, data: topic });
  } catch (error: any) {
    console.error("❌ [Speaking Topic] Toggle premium error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/ai/speaking-topics/:id
 * Delete a speaking topic
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const prisma = databaseService.getClient();
    await prisma.speakingTopic.delete({
      where: { id: String(req.params.id) },
    });

    res.json({ success: true, message: "Topic deleted" });
  } catch (error: any) {
    console.error("❌ [Speaking Topic] Delete error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
