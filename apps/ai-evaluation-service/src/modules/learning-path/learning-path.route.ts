// =============================================================================
// AI Evaluation Service - Learning Path / Target Setting Routes (TASK-11)
// Returns full GeneratedPlan matching frontend types.ts.
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { geminiClient } from "../../llm/gemini.client.js";
import {
  internalContentClient,
  type SkillKey,
  type RecommendedItem,
} from "../../clients/internal-content.client.js";

const router = Router();

const LEARNING_PATH_PROMPT = `You are an English-learning path planner. You produce a structured personalized study plan as STRICT JSON.

Return ONLY valid JSON (no markdown fences, no commentary). Conform exactly to this TypeScript shape:

{
  "summary": {
    "currentLevel": string,           // e.g. "B1 Intermediate"
    "targetExam": "IELTS"|"TOEIC"|"TOEFL"|"CEFR"|"General",
    "targetScore": string,
    "deadline": string,
    "weeklyStudyHours": "2-3"|"4-5"|"6-8"|"10+",
    "studyIntensity": "Light"|"Standard"|"Intensive",
    "weakestSkill": "Listening"|"Reading"|"Writing"|"Speaking"|"Vocabulary"|"Grammar"|"Not sure",
    "estimatedDifficulty": "Low"|"Medium"|"Medium-high"|"High",
    "estimatedWeeklyWorkload": string  // e.g. "~6 hours/week"
  },
  "personalizationLevel": "Basic"|"Good"|"High",
  "personalizationReason": string,
  "gapAnalysis": {
    "currentLevel": string,
    "targetLabel": string,
    "gap": "Low"|"Medium"|"Medium-high"|"High",
    "feasibility": "Achievable"|"Challenging"|"Very challenging",
    "recommendation": string,
    "warning"?: string
  },
  "skillPriorities": [
    {
      "skill": "Listening"|"Reading"|"Writing"|"Speaking"|"Vocabulary"|"Grammar",
      "rank": number,                  // 1 = highest priority
      "intensity": "High"|"Medium"|"Low",
      "reason": string
    }
  ],
  "phases": [
    {
      "id": string,                    // e.g. "phase-1"
      "title": string,
      "weeks": string,                 // e.g. "Weeks 1-3"
      "focus": ("Listening"|"Reading"|"Writing"|"Speaking"|"Vocabulary"|"Grammar")[],
      "description": string
    }
  ],
  "weeklyPlan": [
    {
      "day": "Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday",
      "title": string,
      "type": "Vocabulary"|"Listening"|"Reading"|"Writing"|"Speaking"|"Mock test"|"Review",
      "durationMinutes": number,
      "skill": "Listening"|"Reading"|"Writing"|"Speaking"|"Vocabulary"|"Grammar"
    }
  ],
  "explanation": string
}

RULES:
- 4-6 phases spanning the deadline.
- weeklyPlan covers only the user's availableDays; each task duration close to preferredSessionLength.
- skillPriorities lists every skill the user is weak in (rank 1..N); include weakestSkill at rank 1 unless "Not sure".
- Be specific and reference the user's target exam and score in summary/explanation.
`;

type SkillBreakdown = Partial<Record<SkillKey, number>>;

interface LearnerProfileInput {
  cefrLevel: string | null;
  placementTakenAt: string | null;
  targetExam: string;
  targetScore: string;
  deadline: string;
  customDeadline?: string;
  reasonForStudying?: string;
  weeklyStudyHours: string;
  availableDays: string[];
  preferredSessionLength: string;
  studyIntensity: string;
  reminderPreference?: string;
  weakestSkill: string;
  learningPreference?: string[];
  previousExamExperience?: string;
  previousExamScore?: string;
  confidence?: string;
}

interface GenerateBody {
  userId?: string;
  profile?: LearnerProfileInput;
  skillBreakdown?: SkillBreakdown;
  // Legacy shape (kept for backward compat with older callers)
  currentLevel?: string;
  targetScore?: string;
  deadline?: string;
  examType?: string;
}

function pickSkillForRecommendation(profile: LearnerProfileInput | undefined): SkillKey {
  const w = profile?.weakestSkill;
  const valid: SkillKey[] = [
    "Listening",
    "Reading",
    "Writing",
    "Speaking",
    "Vocabulary",
    "Grammar",
  ];
  if (w && (valid as string[]).includes(w)) return w as SkillKey;
  return "Vocabulary";
}

function stripCodeFences(s: string): string {
  return s
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

/**
 * Best-effort JSON sanitize for LLM output:
 *  - strip code fences
 *  - remove trailing commas before } or ]
 *  - if truncated mid-object, close any unclosed braces/brackets
 * Falls back to throwing if still unparseable.
 */
function safeParseLlmJson(raw: string): unknown {
  let s = stripCodeFences(raw);

  try {
    return JSON.parse(s);
  } catch {
    /* fall through to repair */
  }

  // Remove trailing commas
  s = s.replace(/,(\s*[}\]])/g, "$1");

  // Close any unclosed braces/brackets (truncation recovery)
  const opens: string[] = [];
  let inString = false;
  let escape = false;
  for (const ch of s) {
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{" || ch === "[") opens.push(ch);
    else if (ch === "}" || ch === "]") opens.pop();
  }
  if (inString) s += '"';
  // If we're mid-array or mid-object, drop the trailing partial element
  // (last comma onwards) before closing.
  if (opens.length > 0) {
    const lastComma = s.lastIndexOf(",");
    const lastOpenBrace = Math.max(s.lastIndexOf("{"), s.lastIndexOf("["));
    if (lastComma > lastOpenBrace) {
      s = s.slice(0, lastComma);
    }
    for (let i = opens.length - 1; i >= 0; i--) {
      s += opens[i] === "{" ? "}" : "]";
    }
  }

  return JSON.parse(s);
}

/**
 * POST /api/ai/learning-path/generate
 * Generate a personalized learning path matching GeneratedPlan shape,
 * persist (upsert) one active plan per user, and return it.
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const body = req.body as GenerateBody;
    const userId = body.userId;
    const profile = body.profile;
    const skillBreakdown = body.skillBreakdown ?? {};

    // Backward-compat fallback if caller still sends legacy fields.
    const currentLevel = profile?.cefrLevel ?? body.currentLevel ?? null;
    const targetScore = profile?.targetScore ?? body.targetScore;
    const deadline = profile?.deadline ?? body.deadline;
    const examType = profile?.targetExam ?? body.examType ?? "IELTS";

    if (!userId || !currentLevel || !targetScore || !deadline) {
      res.status(400).json({
        success: false,
        error: "userId, profile.cefrLevel (or currentLevel), targetScore, and deadline are required",
      });
      return;
    }

    const llmInput = JSON.stringify({
      currentLevel,
      targetScore,
      deadline,
      examType,
      profile: profile ?? null,
      skillBreakdown,
    });

    const aiResponse = await geminiClient.chatCompletion(LEARNING_PATH_PROMPT, llmInput, {
      maxTokens: 8192,
      temperature: 0.4,
    });
    const plan = safeParseLlmJson(aiResponse);

    // Populate the 3 recommended arrays from real internal services.
    const focusSkill = pickSkillForRecommendation(profile);
    const [recommendedLessons, recommendedFlashcards, recommendedQuizzes] = await Promise.all([
      internalContentClient.fetchRecommendedLessons(focusSkill, currentLevel, 6),
      internalContentClient.fetchRecommendedFlashcards(focusSkill, currentLevel, 6),
      internalContentClient.fetchRecommendedQuizzes(focusSkill, currentLevel, 6),
    ]);

    const generatedPlan = {
      ...(plan as Record<string, unknown>),
      recommendedLessons: recommendedLessons as RecommendedItem[],
      recommendedFlashcards: recommendedFlashcards as RecommendedItem[],
      recommendedQuizzes: recommendedQuizzes as RecommendedItem[],
    };

    const prisma = databaseService.getClient();

    // Upsert — one active plan per user (UserLearningGoal.userId is @unique).
    const goal = await prisma.userLearningGoal.upsert({
      where: { userId },
      update: {
        currentLevel: currentLevel ?? undefined,
        targetScore,
        deadline,
        roadmap: generatedPlan as any,
      },
      create: {
        userId,
        currentLevel: currentLevel ?? undefined,
        targetScore,
        deadline,
        roadmap: generatedPlan as any,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...goal,
        plan: generatedPlan,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [LearningPath] Generate error:", error);
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * POST /api/ai/learning-path/save
 * Persist the current GeneratedPlan without calling the LLM.
 * Body: { userId, currentLevel, targetScore, deadline, plan }
 */
router.post("/save", async (req: Request, res: Response) => {
  try {
    const { userId, currentLevel, targetScore, deadline, plan } = req.body as {
      userId?: string;
      currentLevel?: string | null;
      targetScore?: string;
      deadline?: string;
      plan?: unknown;
    };

    if (!userId || !plan) {
      res.status(400).json({ success: false, error: "userId and plan are required" });
      return;
    }

    const prisma = databaseService.getClient();
    const goal = await prisma.userLearningGoal.upsert({
      where: { userId },
      update: {
        currentLevel: currentLevel ?? undefined,
        targetScore: targetScore ?? undefined,
        deadline: deadline ?? undefined,
        roadmap: plan as object,
      },
      create: {
        userId,
        currentLevel: currentLevel ?? undefined,
        targetScore: targetScore ?? undefined,
        deadline: deadline ?? undefined,
        roadmap: plan as object,
      },
    });

    res.status(200).json({ success: true, data: { ...goal, plan } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [LearningPath] Save error:", error);
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * GET /api/ai/learning-path/:userId
 * Get user's active learning plan (returns the persisted GeneratedPlan).
 */
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const prisma = databaseService.getClient();

    const goal = await prisma.userLearningGoal.findUnique({ where: { userId } });

    res.json({
      success: true,
      data: goal ? { ...goal, plan: goal.roadmap } : null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [LearningPath] Get error:", error);
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
