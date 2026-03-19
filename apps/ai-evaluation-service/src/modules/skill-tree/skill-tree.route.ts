// =============================================================================
// AI Evaluation Service - Skill Tree Routes
// Dynamic AI Skill Tree: topic-based, mixed-skill learning paths
// =============================================================================

import { Router, Request, Response } from "express";
import { skillTreeService } from "./skill-tree.service.js";

const router = Router();

/**
 * POST /api/ai/skill-tree/generate
 * Generate an initial skill tree for a topic + level
 * Body: { userId, topic, level, nodeLimit }
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { userId, topic, level, nodeLimit = 6 } = req.body;

    if (!userId || !topic || !level) {
      res.status(400).json({
        success: false,
        error: "userId, topic, and level are required",
      });
      return;
    }

    const skillTree = await skillTreeService.generateTree({
      userId,
      topic,
      level,
      nodeLimit: Math.min(nodeLimit, 12),
    });

    res.status(201).json({ success: true, data: skillTree });
  } catch (error: any) {
    console.error("❌ [SkillTree] Generate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai/skill-tree/:userId
 * Get skill tree(s) for a user
 * Query: ?topic=X&level=Y (optional — if omitted, returns all trees)
 */
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const topic = req.query.topic as string | undefined;
    const level = req.query.level as string | undefined;

    if (topic && level) {
      const tree = await skillTreeService.getTree(userId, topic, level);
      if (!tree) {
        res.status(404).json({ success: false, error: "Skill tree not found" });
        return;
      }
      res.json({ success: true, data: tree });
    } else {
      const trees = await skillTreeService.getAllTrees(userId);
      res.json({ success: true, data: trees });
    }
  } catch (error: any) {
    console.error("❌ [SkillTree] Get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai/skill-tree/:userId/branch
 * AI analyzes quiz results and generates new branches
 * Body: { topic, level, parentNodeId, wrongAnswers }
 */
router.post("/:userId/branch", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { topic, level, parentNodeId, wrongAnswers } = req.body;

    if (!topic || !level || !parentNodeId || !wrongAnswers) {
      res.status(400).json({
        success: false,
        error: "topic, level, parentNodeId, and wrongAnswers are required",
      });
      return;
    }

    const result = await skillTreeService.branchTree({
      userId,
      topic,
      level,
      parentNodeId,
      wrongAnswers,
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("❌ [SkillTree] Branch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai/skill-tree/:userId/complete-node
 * Mark a node as completed and activate the next node in the chain
 * Body: { topic, level, nodeId }
 */
router.post("/:userId/complete-node", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { topic, level, nodeId } = req.body;

    if (!topic || !level || !nodeId) {
      res.status(400).json({
        success: false,
        error: "topic, level, and nodeId are required",
      });
      return;
    }

    const updated = await skillTreeService.completeNodeAndAdvance(
      userId, topic, level, nodeId
    );

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("❌ [SkillTree] Complete node error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/ai/skill-tree/:userId/node-status
 * Update a node's status
 * Body: { topic, level, nodeId, status }
 */
router.patch("/:userId/node-status", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { topic, level, nodeId, status } = req.body;

    if (!topic || !level || !nodeId || !status) {
      res.status(400).json({
        success: false,
        error: "topic, level, nodeId, and status are required",
      });
      return;
    }

    const updated = await skillTreeService.updateNodeStatus(
      userId, topic, level, nodeId, status
    );

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("❌ [SkillTree] Node status error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
