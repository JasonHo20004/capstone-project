// =============================================================================
// AI Advisor — Memory Service
// Manages the UserLearningProfile — the AI's memory about each learner.
// =============================================================================

import { databaseService } from "../../services/database.service.js";

export interface SkillGaps {
  listening: number;  // 0.0 = far below target, 1.0 = at/above target
  reading: number;
  writing: number;
  speaking: number;
}

export interface LearningPersonality {
  total_quizzes: number;
  avg_session_min: number;
  error_patterns: string[];  // e.g. ["past_tense", "travel_vocab"]
  last_active_at?: string;
}

export interface AdvisorConfig {
  proactive_enabled: boolean;
  min_interval_hours: number;
  last_push_at?: string;
}

export interface UserLearningProfileData {
  bandScoreTarget: number;
  bandScoreCurrent: number;
  skillGaps: SkillGaps;
  learningPersonality: LearningPersonality;
  advisorConfig: AdvisorConfig;
}

// ─── Quiz result shape from skill tree ─────────────────────────────────────────

interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  skill: string;
  tag: string;
}

interface QuizAnalysisInput {
  userId: string;
  source: "skill_tree_quiz" | "practice_session" | "writing_eval" | "speaking_eval";
  skill?: string;         // for single-skill evals
  bandScore?: number;     // for writing/speaking
  wrongAnswers?: WrongAnswer[];
  totalQuestions?: number;
  correctCount?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

class MemoryService {
  /**
   * Get or create a user's learning profile
   */
  async getOrCreate(userId: string): Promise<UserLearningProfileData> {
    const prisma = databaseService.getClient();

    let profile = await prisma.userLearningProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userLearningProfile.create({
        data: {
          userId,
          bandScoreTarget: 6.5,
          bandScoreCurrent: 0,
          skillGaps: { listening: 0.5, reading: 0.5, writing: 0.5, speaking: 0.5 },
          learningPersonality: { total_quizzes: 0, avg_session_min: 0, error_patterns: [] },
          advisorConfig: { proactive_enabled: true, min_interval_hours: 4 },
        },
      });
    }

    return {
      bandScoreTarget: profile.bandScoreTarget,
      bandScoreCurrent: profile.bandScoreCurrent,
      skillGaps: profile.skillGaps as unknown as SkillGaps,
      learningPersonality: profile.learningPersonality as unknown as LearningPersonality,
      advisorConfig: profile.advisorConfig as unknown as AdvisorConfig,
    };
  }

  /**
   * Process quiz results and update skill gaps in the profile.
   * Uses exponential weighted moving average so recent performance matters more.
   */
  async updateFromQuiz(input: QuizAnalysisInput): Promise<void> {
    const prisma = databaseService.getClient();
    const profile = await this.getOrCreate(input.userId);

    const skillGaps = { ...profile.skillGaps };
    const personality = { ...profile.learningPersonality };

    // ─── Case 1: Multi-skill quiz (Skill Tree) ────────────────────────────────
    if (input.wrongAnswers && input.totalQuestions) {
      const totalWrong = input.wrongAnswers.length;
      const accuracy = (input.totalQuestions - totalWrong) / input.totalQuestions;

      // Group errors by skill
      const skillErrors: Record<string, number> = {};
      for (const wa of input.wrongAnswers) {
        const s = wa.skill.toLowerCase();
        skillErrors[s] = (skillErrors[s] ?? 0) + 1;
      }

      // EWMA update for each affected skill (alpha = 0.3 → recent matters more)
      const ALPHA = 0.3;
      const skilledQuestions = input.wrongAnswers.reduce((acc, wa) => {
        acc[wa.skill.toLowerCase()] = (acc[wa.skill.toLowerCase()] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Update overall accuracy as band proxy
      for (const skill of ["listening", "reading", "writing", "speaking"] as const) {
        if (skilledQuestions[skill] !== undefined) {
          const skillWrong = skillErrors[skill] ?? 0;
          const skillTotal = skilledQuestions[skill];
          const skillAccuracy = (skillTotal - skillWrong) / skillTotal;
          const current = skillGaps[skill] ?? 0.5;
          skillGaps[skill] = parseFloat((current * (1 - ALPHA) + skillAccuracy * ALPHA).toFixed(3));
        }
      }

      // Update error patterns (keep last 20 unique tags)
      const newTags = input.wrongAnswers.map((wa) => wa.tag);
      const allTags = [...new Set([...newTags, ...personality.error_patterns])].slice(0, 20);
      personality.error_patterns = allTags;
      personality.total_quizzes = (personality.total_quizzes ?? 0) + 1;

      // Update current band estimate (crude: accuracy × target)
      const newBand = parseFloat((accuracy * profile.bandScoreTarget).toFixed(1));

      await prisma.userLearningProfile.update({
        where: { userId: input.userId },
        data: {
          skillGaps,
          learningPersonality: personality,
          bandScoreCurrent: newBand,
          updatedAt: new Date(),
        },
      });
    }

    // ─── Case 2: Single-skill evaluation (Writing / Speaking) ────────────────
    if (input.skill && input.bandScore !== undefined) {
      const skill = input.skill.toLowerCase() as keyof SkillGaps;
      if (skill in skillGaps) {
        const ALPHA = 0.4;
        const normalizedScore = Math.min(1, input.bandScore / 9.0);
        const current = skillGaps[skill] ?? 0.5;
        skillGaps[skill] = parseFloat((current * (1 - ALPHA) + normalizedScore * ALPHA).toFixed(3));
      }

      // Recalculate overall band as average of known skill bands
      const knownBands = Object.values(skillGaps).filter((v) => v > 0);
      const avgBand = knownBands.length
        ? (knownBands.reduce((a, b) => a + b, 0) / knownBands.length) * 9
        : profile.bandScoreCurrent;

      await prisma.userLearningProfile.update({
        where: { userId: input.userId },
        data: {
          skillGaps,
          bandScoreCurrent: parseFloat(avgBand.toFixed(1)),
          updatedAt: new Date(),
        },
      });
    }
  }

  /**
   * Update last_push_at to throttle proactive advisor pushes
   */
  async markProactiveDelivered(userId: string): Promise<void> {
    const prisma = databaseService.getClient();
    const profile = await this.getOrCreate(userId);

    await prisma.userLearningProfile.update({
      where: { userId },
      data: {
        advisorConfig: {
          ...(profile.advisorConfig as object),
          last_push_at: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Update last_active_at for idle detection
   */
  async markActivity(userId: string): Promise<void> {
    const prisma = databaseService.getClient();
    const profile = await this.getOrCreate(userId);

    await prisma.userLearningProfile.update({
      where: { userId },
      data: {
        learningPersonality: {
          ...(profile.learningPersonality as object),
          last_active_at: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Get the top N critical skill gaps (below a threshold)
   */
  getCriticalGaps(
    skillGaps: SkillGaps,
    bandScoreTarget: number,
    threshold = 0.55
  ): Array<{ skill: string; score: number; gap: number }> {
    const targetNormalized = bandScoreTarget / 9.0;

    return (Object.entries(skillGaps) as [string, number][])
      .map(([skill, score]) => ({
        skill,
        score,
        gap: targetNormalized - score,
      }))
      .filter(({ gap }) => gap > threshold * 0.5)  // half of target gap = critical
      .sort((a, b) => b.gap - a.gap);
  }
}

export const memoryService = new MemoryService();
