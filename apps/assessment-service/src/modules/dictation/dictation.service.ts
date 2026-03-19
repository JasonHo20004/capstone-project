// =============================================================================
// Dictation Service - Business Logic
// =============================================================================

import { databaseService } from "../../services/database.service.js";

class DictationService {
  private get db() {
    return databaseService.getClient();
  }

  // ─── List Exercises ─────────────────────────────────────────────────────────

  async listExercises(filters?: { category?: string; level?: string; includeUnpublished?: boolean }) {
    const where: Record<string, unknown> = {};
    if (!filters?.includeUnpublished) where.isPublished = true;
    if (filters?.category) where.category = filters.category;
    if (filters?.level) where.level = filters.level;

    return this.db.dictationExercise.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        audioUrl: true,
        level: true,
        category: true,
        totalSentences: true,
        isPublished: true,
        createdAt: true,
      },
    });
  }

  // ─── Get Exercise Detail (with sentences) ──────────────────────────────────

  async getExerciseById(id: string) {
    return this.db.dictationExercise.findUniqueOrThrow({
      where: { id },
      include: {
        sentences: {
          orderBy: { index: "asc" },
        },
      },
    });
  }

  // ─── Get Distinct Categories ───────────────────────────────────────────────

  async getCategories() {
    const results = await this.db.dictationExercise.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return results.map((r) => r.category).filter(Boolean);
  }

  // ─── Start or Resume a Session ─────────────────────────────────────────────

  async startOrResumeSession(exerciseId: string, userId: string) {
    // Check for existing in-progress session
    const existing = await this.db.dictationSession.findFirst({
      where: { exerciseId, userId, status: "IN_PROGRESS" },
    });

    if (existing) return existing;

    // Create new session
    return this.db.dictationSession.create({
      data: { exerciseId, userId },
    });
  }

  // ─── Update Session Progress ───────────────────────────────────────────────

  async updateSessionProgress(
    sessionId: string,
    data: { currentIndex?: number; completedCount?: number; accuracy?: number }
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.currentIndex !== undefined) updateData.currentIndex = data.currentIndex;
    if (data.completedCount !== undefined) updateData.completedCount = data.completedCount;
    if (data.accuracy !== undefined) updateData.accuracy = data.accuracy;

    return this.db.dictationSession.update({
      where: { id: sessionId },
      data: updateData,
    });
  }

  // ─── Complete Session ──────────────────────────────────────────────────────

  async completeSession(sessionId: string, accuracy: number) {
    return this.db.dictationSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        accuracy,
        completedAt: new Date(),
      },
    });
  }

  // ─── Get User Sessions for an Exercise ─────────────────────────────────────

  async getUserSessions(userId: string, exerciseId?: string) {
    const where: Record<string, unknown> = { userId };
    if (exerciseId) where.exerciseId = exerciseId;

    return this.db.dictationSession.findMany({
      where,
      include: {
        exercise: {
          select: { title: true, totalSentences: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── Admin: Create Exercise from Whisper JSON ──────────────────────────────

  async createExercise(data: {
    title: string;
    description?: string;
    audioUrl: string;
    level?: string;
    category?: string;
    sentences: { index: number; text: string; startTime: number; endTime: number }[];
  }) {
    return this.db.dictationExercise.create({
      data: {
        title: data.title,
        description: data.description,
        audioUrl: data.audioUrl,
        level: data.level,
        category: data.category,
        totalSentences: data.sentences.length,
        isPublished: true,
        sentences: {
          create: data.sentences.map((s) => ({
            index: s.index,
            text: s.text,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
      },
      include: { sentences: true },
    });
  }

  // ─── Admin: Update Exercise ─────────────────────────────────────────────────

  async updateExercise(
    id: string,
    data: {
      title?: string;
      description?: string;
      audioUrl?: string;
      level?: string;
      category?: string;
      isPublished?: boolean;
      sentences?: { index: number; text: string; startTime: number; endTime: number }[];
    }
  ) {
    return this.db.$transaction(async (tx) => {
      // Update metadata
      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.audioUrl !== undefined) updateData.audioUrl = data.audioUrl;
      if (data.level !== undefined) updateData.level = data.level;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

      // If sentences provided, replace all
      if (data.sentences) {
        await tx.dictationSentence.deleteMany({ where: { exerciseId: id } });
        await tx.dictationSentence.createMany({
          data: data.sentences.map((s) => ({
            exerciseId: id,
            index: s.index,
            text: s.text,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        });
        updateData.totalSentences = data.sentences.length;
      }

      return tx.dictationExercise.update({
        where: { id },
        data: updateData,
        include: { sentences: { orderBy: { index: "asc" } } },
      });
    });
  }

  // ─── Admin: Delete Exercise ────────────────────────────────────────────────

  async deleteExercise(id: string) {
    return this.db.$transaction(async (tx) => {
      await tx.dictationSession.deleteMany({ where: { exerciseId: id } });
      await tx.dictationSentence.deleteMany({ where: { exerciseId: id } });
      return tx.dictationExercise.delete({ where: { id } });
    });
  }
}

export const dictationService = new DictationService();
