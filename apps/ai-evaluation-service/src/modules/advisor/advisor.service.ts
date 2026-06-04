// =============================================================================
// AI Advisor — Core Service
// Orchestrates Memory + RAG + Gemini + Action Registry
// =============================================================================

import geminiClient from "../../llm/gemini.client.js";
import { databaseService } from "../../services/database.service.js";
import { memoryService, SkillGaps } from "./memory.service.js";
import { ragService } from "./rag.service.js";
import {
  validateAdvisorAction,
  isProactiveAllowed,
  AdvisorAction,
  type TriggerReason,
} from "./action-registry.js";
import {
  ADVISOR_SYSTEM_PROMPT,
  ADVISOR_PROACTIVE_PROMPT,
  ADVISOR_POST_QUIZ_PROMPT,
} from "./advisor.prompts.js";

// ─── SSE Connection Pool ───────────────────────────────────────────────────────
// Maps userId → SSE Response object for server push
export const sseConnections = new Map<string, import("express").Response>();

export function pushToUser(userId: string, event: string, data: unknown): void {
  const res = sseConnections.get(userId);
  if (!res) return;

  try {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // @ts-ignore — flush for nginx/proxy compatibility
    if (typeof res.flush === "function") res.flush();
  } catch {
    // Client disconnected — clean up
    sseConnections.delete(userId);
  }
}

// ─── Analysis Input ────────────────────────────────────────────────────────────

interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  skill: string;
  tag: string;
}

export interface AnalyzeQuizInput {
  userId: string;
  source: "skill_tree_quiz" | "practice_session" | "writing_eval" | "speaking_eval";
  wrongAnswers?: WrongAnswer[];
  totalQuestions?: number;
  skill?: string;
  bandScore?: number;
  topic?: string;
  level?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

class AdvisorService {
  /**
   * Analyze quiz results, update memory, and push an action to the user.
   * Called by: skill-tree.service (after branchTree), assessment graders
   */
  async analyzeAndAdvise(input: AnalyzeQuizInput): Promise<AdvisorAction | null> {
    const prisma = databaseService.getClient();
    const profile = await memoryService.getOrCreate(input.userId);

    // 1. Update skill gap memory
    await memoryService.updateFromQuiz({
      userId: input.userId,
      source: input.source,
      wrongAnswers: input.wrongAnswers,
      totalQuestions: input.totalQuestions,
      skill: input.skill,
      bandScore: input.bandScore,
    });

    // 2. Re-fetch updated profile
    const updated = await memoryService.getOrCreate(input.userId);
    const criticalGaps = memoryService.getCriticalGaps(
      updated.skillGaps,
      updated.bandScoreTarget
    );

    // 3. Retrieve IELTS context (RAG)
    const topGap = criticalGaps[0];
    const ragQuery = topGap
      ? `IELTS ${topGap.skill} improvement tips for ${this.bandToRange(updated.bandScoreCurrent)} learner`
      : "IELTS general study tips";

    const chunks = await ragService.retrieve(
      ragQuery,
      topGap?.skill,
      this.bandToRange(updated.bandScoreCurrent)
    );
    const ragContext = ragService.formatContext(chunks);

    // 4. Build prompt context for Gemini
    const userMessage = JSON.stringify({
      learner_profile: {
        band_target: updated.bandScoreTarget,
        band_current: updated.bandScoreCurrent,
        skill_gaps: updated.skillGaps,
        critical_gaps: criticalGaps.slice(0, 2),
        error_patterns: updated.learningPersonality.error_patterns?.slice(0, 5),
      },
      quiz_context: {
        source: input.source,
        wrong_answers: input.wrongAnswers?.slice(0, 8) ?? [],
        total_questions: input.totalQuestions,
        topic: input.topic,
        level: input.level,
      },
      ielts_knowledge_context: ragContext,
    });

    // 5. Call Gemini — post-quiz or generic advisor
    const systemPrompt = input.wrongAnswers?.length
      ? `${ADVISOR_SYSTEM_PROMPT}\n\n---\n${ADVISOR_POST_QUIZ_PROMPT}`
      : ADVISOR_SYSTEM_PROMPT;

    const aiRaw = await geminiClient.chatCompletion(systemPrompt, userMessage, {
      temperature: 0.5,
    });

    // 6. Parse + validate through Action Registry
    let action: AdvisorAction;
    try {
      const parsed = JSON.parse(aiRaw);
      action = validateAdvisorAction({
        type: parsed.action_type,
        message: parsed.message,
        evidence: parsed.evidence,
        courseId: parsed.courseId ?? undefined,
        tipId: parsed.tipId ?? undefined,
      });
    } catch (err) {
      console.error("[Advisor] Action validation failed:", err);
      return null;
    }

    // 7. Log to audit trail
    const triggerReason: TriggerReason =
      input.source === "skill_tree_quiz" ? "quiz_failed" : "band_gap_detected";

    await prisma.advisorActionLog.create({
      data: {
        userId: input.userId,
        actionType: action.type as any,
        payload: action as any,
        triggerReason,
        deliveredAt: new Date(),
      },
    });

    // 8. Push via SSE if connection is open
    pushToUser(input.userId, "advisor_action", action);

    return action;
  }

  /**
   * Handle reactive chat — user asks the advisor something directly
   */
  async chat(userId: string, userQuery: string): Promise<AdvisorAction> {
    const prisma = databaseService.getClient();
    const profile = await memoryService.getOrCreate(userId);

    const chunks = await ragService.retrieve(userQuery);
    const ragContext = ragService.formatContext(chunks);

    const userMessage = JSON.stringify({
      user_question: userQuery,
      learner_profile: {
        band_target: profile.bandScoreTarget,
        band_current: profile.bandScoreCurrent,
        skill_gaps: profile.skillGaps,
        error_patterns: profile.learningPersonality.error_patterns?.slice(0, 5),
      },
      ielts_knowledge_context: ragContext,
    });

    const aiRaw = await geminiClient.chatCompletion(ADVISOR_SYSTEM_PROMPT, userMessage, {
      temperature: 0.6,
    });

    const parsed = JSON.parse(aiRaw);
    const action = validateAdvisorAction({
      type: parsed.action_type,
      message: parsed.message,
      evidence: parsed.evidence,
      courseId: parsed.courseId ?? undefined,
    });

    await prisma.advisorActionLog.create({
      data: {
        userId,
        actionType: action.type as any,
        payload: action as any,
        triggerReason: "user_request",
        deliveredAt: new Date(),
      },
    });

    return action;
  }

  /**
   * Proactive check — called by scheduler for idle users or periodic reminders.
   * Respects the min_interval_hours gate.
   */
  async proactiveCheck(userId: string, reason: TriggerReason): Promise<void> {
    const profile = await memoryService.getOrCreate(userId);

    // Guard: don't spam the user
    if (!isProactiveAllowed(profile.advisorConfig as Record<string, unknown>)) {
      console.log(`[Advisor] Skipping proactive push for ${userId} — min interval not reached`);
      return;
    }

    // Guard: no SSE connection open? skip (don't queue for later in this MVP)
    if (!sseConnections.has(userId)) return;

    const criticalGaps = memoryService.getCriticalGaps(
      profile.skillGaps,
      profile.bandScoreTarget
    );

    const chunks = await ragService.retrieve(
      criticalGaps[0]
        ? `IELTS ${criticalGaps[0].skill} study tips`
        : "IELTS general motivation tips"
    );

    const userMessage = JSON.stringify({
      trigger_reason: reason,
      learner_profile: {
        band_target: profile.bandScoreTarget,
        band_current: profile.bandScoreCurrent,
        skill_gaps: profile.skillGaps,
        critical_gaps: criticalGaps.slice(0, 2),
        last_active_at: profile.learningPersonality.last_active_at,
      },
      ielts_knowledge_context: ragService.formatContext(chunks),
    });

    try {
      const aiRaw = await geminiClient.chatCompletion(
        ADVISOR_PROACTIVE_PROMPT,
        userMessage,
        { temperature: 0.7 }
      );

      const parsed = JSON.parse(aiRaw);
      const action = validateAdvisorAction({
        type: parsed.action_type,
        message: parsed.message,
        evidence: parsed.evidence,
      });

      await memoryService.markProactiveDelivered(userId);
      pushToUser(userId, "advisor_action", action);

      const prisma = databaseService.getClient();
      await prisma.advisorActionLog.create({
        data: {
          userId,
          actionType: action.type as any,
          payload: action as any,
          triggerReason: reason,
          deliveredAt: new Date(),
        },
      });
    } catch (err) {
      console.error("[Advisor] Proactive generation failed:", err);
    }
  }

  private bandToRange(band: number): string {
    if (band < 5) return "4.0-5.0";
    if (band < 6) return "5.0-6.0";
    if (band < 7) return "6.0-7.0";
    return "7.0-9.0";
  }
}

export const advisorService = new AdvisorService();
