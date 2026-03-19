// =============================================================================
// Dictation Controller - Request Handling
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { dictationService } from "./dictation.service.js";
import { s3Service } from "../../services/s3.service.js";

export class DictationController {
  /** GET /dictation — List exercises (pass ?all=true to include unpublished) */
  async listExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, level, all } = req.query as { category?: string; level?: string; all?: string };
      const exercises = await dictationService.listExercises({ category, level, includeUnpublished: all === 'true' });
      res.status(200).json({ message: "Dictation exercises retrieved", data: exercises });
    } catch (error) {
      next(error);
    }
  }

  /** GET /dictation/categories — List distinct categories */
  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await dictationService.getCategories();
      res.status(200).json({ message: "Categories retrieved", data: categories });
    } catch (error) {
      next(error);
    }
  }

  /** GET /dictation/:id — Get exercise detail with sentences */
  async getExerciseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const exercise = await dictationService.getExerciseById(id);
      res.status(200).json({ message: "Exercise retrieved", data: exercise });
    } catch (error) {
      next(error);
    }
  }

  /** POST /dictation/:id/start — Start or resume a session */
  async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { userId } = req.body as { userId?: string };
      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }
      const session = await dictationService.startOrResumeSession(id, userId);
      res.status(200).json({ message: "Session started", data: session });
    } catch (error) {
      next(error);
    }
  }

  /** PUT /dictation/sessions/:sessionId — Update session progress */
  async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const { currentIndex, completedCount, accuracy } = req.body;
      const session = await dictationService.updateSessionProgress(sessionId, {
        currentIndex,
        completedCount,
        accuracy,
      });
      res.status(200).json({ message: "Session updated", data: session });
    } catch (error) {
      next(error);
    }
  }

  /** POST /dictation/sessions/:sessionId/complete — Complete session */
  async completeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const { accuracy } = req.body as { accuracy?: number };
      const session = await dictationService.completeSession(sessionId, accuracy ?? 0);
      res.status(200).json({ message: "Session completed", data: session });
    } catch (error) {
      next(error);
    }
  }

  /** GET /dictation/sessions/user/:userId — Get user's dictation sessions */
  async getUserSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const exerciseId = req.query.exerciseId as string | undefined;
      const sessions = await dictationService.getUserSessions(userId, exerciseId);
      res.status(200).json({ message: "Sessions retrieved", data: sessions });
    } catch (error) {
      next(error);
    }
  }

  /** POST /dictation — Admin: Create exercise from Whisper JSON */
  async createExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await dictationService.createExercise(req.body);
      res.status(201).json({ message: "Exercise created", data: exercise });
    } catch (error) {
      next(error);
    }
  }

  /** PUT /dictation/:id — Admin: Update exercise */
  async updateExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const exercise = await dictationService.updateExercise(id, req.body);
      res.status(200).json({ message: "Exercise updated", data: exercise });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /dictation/:id — Admin: Delete exercise */
  async deleteExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await dictationService.deleteExercise(id);
      res.status(200).json({ message: "Exercise deleted" });
    } catch (error) {
      next(error);
    }
  }

  /** POST /dictation/upload-audio — Upload audio file to S3 */
  async uploadAudio(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No audio file provided" });
        return;
      }
      const url = await s3Service.uploadFile(file, "dictation-audio");
      res.status(200).json({ message: "Audio uploaded", data: { url } });
    } catch (error) {
      next(error);
    }
  }
}

export const dictationController = new DictationController();
