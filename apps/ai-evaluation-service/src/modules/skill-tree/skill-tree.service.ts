// =============================================================================
// AI Evaluation Service - Skill Tree Service
// Business logic for Dynamic AI Skill Tree
// =============================================================================

import { databaseService } from "../../services/database.service.js";
import geminiClient, { extractJson } from "../../llm/gemini.client.js";
import {
  GENERATE_SKILL_TREE_PROMPT,
  BRANCH_SKILL_TREE_PROMPT,
} from "./skill-tree.prompts.js";
import { advisorService } from "../advisor/advisor.service.js";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SkillTreeNode {
  id: string;
  label: string;
  type: "root" | "lesson" | "challenge" | "checkpoint" | "remedial" | "practice";
  status: "active" | "completed" | "locked" | "new";
  position: { x: number; y: number };
  mixedSkills: string[];
  questionTypes: string[];
  description: string;
}

export interface SkillTreeEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

interface GenerateTreeInput {
  userId: string;
  topic: string;
  level: string;
  nodeLimit: number;
}

interface BranchTreeInput {
  userId: string;
  topic: string;
  level: string;
  parentNodeId: string;
  wrongAnswers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    skill: string;
    tag: string;
  }>;
}

// ─── Service ────────────────────────────────────────────────────────────────────

class SkillTreeService {
  /**
   * Generate an initial skill tree for a user's topic + level combo
   */
  async generateTree({ userId, topic, level, nodeLimit }: GenerateTreeInput) {
    const prisma = databaseService.getClient();

    // Check if tree already exists
    const existing = await prisma.userSkillTree.findFirst({
      where: { userId, topic, level },
    });

    if (existing) {
      return existing;
    }

    // Ask Gemini to generate the tree
    const userMessage = JSON.stringify({ topic, level, nodeLimit });
    const aiResponse = await geminiClient.chatCompletion(
      GENERATE_SKILL_TREE_PROMPT,
      userMessage,
      { temperature: 0.7 }
    );

    const parsed = extractJson(aiResponse);
    const nodes = parsed.nodes as SkillTreeNode[];
    const edges = (parsed.edges as any[]).map(
      (e: any, i: number) => ({
        ...e,
        id: e.id || `e_${Date.now()}_${i}`,
      })
    );

    // Save to database
    const skillTree = await prisma.userSkillTree.create({
      data: {
        userId,
        topic,
        level,
        nodes: nodes as any,
        edges: edges as any,
      },
    });

    return skillTree;
  }

  /**
   * Get a user's skill tree by topic + level
   */
  async getTree(userId: string, topic: string, level: string) {
    const prisma = databaseService.getClient();

    return prisma.userSkillTree.findFirst({
      where: { userId, topic, level },
    });
  }

  /**
   * Get all skill trees for a user
   */
  async getAllTrees(userId: string) {
    const prisma = databaseService.getClient();

    return prisma.userSkillTree.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * Branch the skill tree after a quiz — AI analyzes wrong answers
   * and generates remedial/practice nodes
   */
  async branchTree({ userId, topic, level, parentNodeId, wrongAnswers }: BranchTreeInput) {
    const prisma = databaseService.getClient();

    const currentTree = await prisma.userSkillTree.findFirst({
      where: { userId, topic, level },
    });

    if (!currentTree) {
      throw new Error("Skill tree not found");
    }

    const existingNodes = currentTree.nodes as unknown as SkillTreeNode[];
    const existingEdges = currentTree.edges as unknown as SkillTreeEdge[];

    // Find parent node position for placing new nodes
    const parentNode = existingNodes.find((n) => n.id === parentNodeId);
    if (!parentNode) {
      throw new Error(`Parent node ${parentNodeId} not found in tree`);
    }

    // Ask AI to generate branches
    const userMessage = JSON.stringify({
      wrongAnswers: wrongAnswers.slice(0, 10),
      existingNodeIds: existingNodes.map((n) => n.id),
      topic,
      level,
      parentNodeId,
    });

    const aiResponse = await geminiClient.chatCompletion(
      BRANCH_SKILL_TREE_PROMPT,
      userMessage,
      { temperature: 0.5 }
    );

    const parsed = extractJson(aiResponse);
    const { newNodes, newEdges, analysis } = parsed;

    // Remedial nodes — no position needed (frontend calculates layout)
    const remedialNodes: SkillTreeNode[] = (newNodes as any[]).map(
      (node: any) => ({
        ...node,
        status: "new",
      })
    );

    // Find the edge going FROM parentNode → nextNode
    const outgoingEdge = existingEdges.find((e) => e.source === parentNodeId);
    const nextOriginalNodeId = outgoingEdge?.target;

    // Mark parent node as completed, and unlock the FIRST remedial node (or next original node)
    const updatedExistingNodes = existingNodes.map((n) => {
      if (n.id === parentNodeId) return { ...n, status: "completed" as const };
      return n;
    });

    // Insert remedial nodes into the chain:
    // parent → remedial_1 → remedial_2 → nextOriginal
    const updatedEdges = existingEdges.filter(
      (e) => !(e.source === parentNodeId && e.target === nextOriginalNodeId)
    );

    // Build new edge chain
    const insertedEdges: SkillTreeEdge[] = [];
    if (remedialNodes.length > 0) {
      // parent → first remedial
      insertedEdges.push({
        id: `e_${Date.now()}_r0`,
        source: parentNodeId,
        target: remedialNodes[0].id,
        animated: true,
      });
      // chain remedial nodes together
      for (let i = 0; i < remedialNodes.length - 1; i++) {
        insertedEdges.push({
          id: `e_${Date.now()}_r${i + 1}`,
          source: remedialNodes[i].id,
          target: remedialNodes[i + 1].id,
          animated: true,
        });
      }
      // last remedial → next original node (if it exists)
      if (nextOriginalNodeId) {
        insertedEdges.push({
          id: `e_${Date.now()}_rn`,
          source: remedialNodes[remedialNodes.length - 1].id,
          target: nextOriginalNodeId,
          animated: true,
        });
      }

      // Mark first remedial as active
      remedialNodes[0].status = "active" as any;
    } else if (nextOriginalNodeId) {
      // No remedial nodes, keep original edge
      updatedEdges.push({
        id: outgoingEdge?.id || `e_${Date.now()}_orig`,
        source: parentNodeId,
        target: nextOriginalNodeId,
      });
    }

    const finalNodes = [...updatedExistingNodes, ...remedialNodes];
    const finalEdges = [...updatedEdges, ...insertedEdges];

    // Save updated tree
    const updated = await prisma.userSkillTree.update({
      where: { id: currentTree.id },
      data: {
        nodes: finalNodes as any,
        edges: finalEdges as any,
      },
    });

    // Notify AI Advisor — fire-and-forget (does not affect skill tree response)
    setImmediate(() => {
      advisorService
        .analyzeAndAdvise({
          userId,
          source: "skill_tree_quiz",
          wrongAnswers,
          totalQuestions: wrongAnswers.length + (parsed.newNodes?.length ?? 0),
          topic,
          level,
        })
        .catch((err) => console.error("[SkillTree] Advisor notify failed:", err));
    });

    return {
      skillTree: updated,
      addedNodes: remedialNodes,
      addedEdges: insertedEdges,
      analysis,
    };
  }

  /**
   * Complete a node and advance to the next one in the chain.
   * Marks current node as "completed", finds the next node via edges, sets it to "active".
   */
  async completeNodeAndAdvance(
    userId: string,
    topic: string,
    level: string,
    nodeId: string
  ) {
    const prisma = databaseService.getClient();

    const tree = await prisma.userSkillTree.findFirst({
      where: { userId, topic, level },
    });

    if (!tree) {
      throw new Error("Skill tree not found");
    }

    const nodes = tree.nodes as unknown as SkillTreeNode[];
    const edges = tree.edges as unknown as SkillTreeEdge[];

    // Find the next node in the chain
    const outgoingEdge = edges.find((e) => e.source === nodeId);
    const nextNodeId = outgoingEdge?.target;

    const updatedNodes = nodes.map((n) => {
      if (n.id === nodeId) return { ...n, status: "completed" as const };
      if (n.id === nextNodeId && (n.status === "locked" || n.status === "new")) {
        return { ...n, status: "active" as const };
      }
      return n;
    });

    const updated = await prisma.userSkillTree.update({
      where: { id: tree.id },
      data: { nodes: updatedNodes as any },
    });

    return updated;
  }

  /**
   * Update a node's status (e.g., mark as completed, active)
   */
  async updateNodeStatus(
    userId: string,
    topic: string,
    level: string,
    nodeId: string,
    status: SkillTreeNode["status"]
  ) {
    const prisma = databaseService.getClient();

    const tree = await prisma.userSkillTree.findFirst({
      where: { userId, topic, level },
    });

    if (!tree) {
      throw new Error("Skill tree not found");
    }

    const nodes = (tree.nodes as unknown as SkillTreeNode[]).map((n) =>
      n.id === nodeId ? { ...n, status } : n
    );

    return prisma.userSkillTree.update({
      where: { id: tree.id },
      data: { nodes: nodes as any },
    });
  }
}

export const skillTreeService = new SkillTreeService();
