// =============================================================================
// AI Evaluation Service - Skill Tree Routes (TASK-09)
// Dynamic AI Skill Tree: nodes + edges stored in JSONB
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { llmClient } from "../../llm/llm.client.js";

const router = Router();

const SKILL_TREE_PROMPT = `You are an English language learning skill tree generator.

Based on the student's wrong answers and their tags, generate NEW skill tree nodes to help them improve.

RULES:
- Return ONLY valid JSON array, no other text
- Each node has: id (string, unique like "node_xxx"), label (string, short skill name), type ("remedial" | "practice" | "challenge"), description (string, 1 sentence)
- Each edge has: source (existing node id), target (new node id)
- Generate 1-3 new nodes max
- Labels should be specific and actionable (e.g., "Practice -ed endings", "Vocab: Academic Words")

OUTPUT FORMAT:
{
  "newNodes": [{ "id": "node_xxx", "label": "...", "type": "remedial", "description": "..." }],
  "newEdges": [{ "source": "existing_node_id", "target": "node_xxx" }]
}`;

/**
 * GET /api/ai/skill-tree/:userId
 * Get user's current skill tree
 */
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const prisma = databaseService.getClient();

    let skillTree = await prisma.userSkillTree.findFirst({
      where: { userId },
    });

    // If no skill tree exists, create a default one
    if (!skillTree) {
      skillTree = await prisma.userSkillTree.create({
        data: {
          userId,
          nodes: [
            { id: "root", label: "English Proficiency", type: "root", position: { x: 400, y: 50 }, description: "Your learning journey starts here" },
            { id: "grammar_basics", label: "Grammar Basics", type: "practice", position: { x: 200, y: 200 }, description: "Foundation grammar skills" },
            { id: "vocab_core", label: "Core Vocabulary", type: "practice", position: { x: 400, y: 200 }, description: "Essential vocabulary building" },
            { id: "listening_skills", label: "Listening Skills", type: "practice", position: { x: 600, y: 200 }, description: "Comprehension and listening practice" },
          ],
          edges: [
            { id: "e1", source: "root", target: "grammar_basics" },
            { id: "e2", source: "root", target: "vocab_core" },
            { id: "e3", source: "root", target: "listening_skills" },
          ],
        },
      });
    }

    res.json({
      success: true,
      data: skillTree,
    });
  } catch (error: any) {
    console.error("❌ [SkillTree] Get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai/skill-tree/:userId/update
 * Update skill tree based on test results
 * Input: { wrongAnswers: [...], tags: [...] }
 */
router.post("/:userId/update", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { wrongAnswers, tags } = req.body;

    if (!wrongAnswers || !tags) {
      res.status(400).json({ success: false, error: "wrongAnswers and tags are required" });
      return;
    }

    const prisma = databaseService.getClient();

    // Get current tree
    const currentTree = await prisma.userSkillTree.findFirst({ where: { userId } });
    if (!currentTree) {
      res.status(404).json({ success: false, error: "Skill tree not found. Get the tree first." });
      return;
    }

    // Ask AI to generate new nodes
    const userMessage = JSON.stringify({
      wrongAnswers: wrongAnswers.slice(0, 10), // Limit to 10
      tags: tags.slice(0, 10),
      existingNodeIds: (currentTree.nodes as any[]).map((n: any) => n.id),
    });

    const aiResponse = await llmClient.chatCompletion(SKILL_TREE_PROMPT, userMessage, { jsonMode: true });
    const { newNodes, newEdges } = JSON.parse(aiResponse);

    // Merge new nodes with positions
    const existingNodes = currentTree.nodes as any[];
    const existingEdges = currentTree.edges as any[];
    const maxY = Math.max(...existingNodes.map((n: any) => n.position?.y || 0));

    const positionedNewNodes = newNodes.map((node: any, i: number) => ({
      ...node,
      position: { x: 200 + i * 250, y: maxY + 200 },
      status: "new", // Mark as new for frontend animation
    }));

    const updatedNodes = [...existingNodes, ...positionedNewNodes];
    const updatedEdges = [...existingEdges, ...newEdges.map((e: any, i: number) => ({
      ...e,
      id: `e_${Date.now()}_${i}`,
    }))];

    // Save updated tree
    const updated = await prisma.userSkillTree.update({
      where: { id: currentTree.id },
      data: {
        nodes: updatedNodes,
        edges: updatedEdges,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: {
        skillTree: updated,
        addedNodes: positionedNewNodes,
        addedEdges: newEdges,
      },
    });
  } catch (error: any) {
    console.error("❌ [SkillTree] Update error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
