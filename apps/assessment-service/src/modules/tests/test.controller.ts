import { Request, Response, NextFunction } from "express";
import { testService } from "./test.service.js";
import { CreateTestSchema } from "./test.schema.js";
import { s3Service } from "../../services/s3.service.js";

export class TestController {
  public async getAllTests(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const mine = req.query.mine === "true";
      const explicitSeller = req.query.sellerId as string | undefined;

      // ?mine=true → auto-scope to the authenticated seller (requires auth).
      // ?sellerId=<uuid> → explicit filter (admin tooling). Otherwise: all tests.
      let sellerId: string | undefined;
      if (mine) {
        if (!req.user?.userId) {
          res.status(401).json({ message: "Authentication required for mine=true" });
          return;
        }
        sellerId = req.user.userId;
      } else if (explicitSeller) {
        sellerId = explicitSeller;
      }

      const tests = await testService.getAllTests({ status, sellerId });
      res.status(200).json({ message: "Tests retrieved", data: tests });
    } catch (error) {
      next(error);
    }
  }

  public async getTestById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const wantsAnswers = req.query.includeAnswers === "true";

      // includeAnswers leaks correct answers — gate to owner / admin only.
      let includeAnswers = false;
      if (wantsAnswers) {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (userId) {
          if (role === "ADMINISTRATOR") {
            includeAnswers = true;
          } else {
            const owner = await testService.getTestOwnership(id);
            if (owner && owner.sellerId && owner.sellerId === userId) {
              includeAnswers = true;
            }
          }
        }
      }

      const test = await testService.getTestById(id, { includeAnswers });
      res.status(200).json({ message: "Test retrieved", data: test });
    } catch (error) {
      next(error);
    }
  }

  public async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateTestSchema.parse(req.body);
      // Stamp ownership from the JWT — never trust a sellerId in the body.
      const sellerId = req.user?.userId;
      const test = await testService.createTest(data, sellerId);
      res.status(201).json({ message: "Test created", data: test });
    } catch (error) {
      next(error);
    }
  }

  public async updateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.userId;

      // Ownership check — only the seller who created the test (or an admin)
      // may modify it.
      if (userId && req.user?.role !== "ADMINISTRATOR") {
        const owner = await testService.getTestOwnership(id);
        if (!owner) {
          res.status(404).json({ message: "Test not found" });
          return;
        }
        if (owner.sellerId && owner.sellerId !== userId) {
          res.status(403).json({ message: "You don't own this test" });
          return;
        }
      }

      const test = await testService.updateTest(id, req.body);
      res.status(200).json({ message: "Test updated", data: test });
    } catch (error) {
      next(error);
    }
  }

  public async deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.userId;

      if (userId && req.user?.role !== "ADMINISTRATOR") {
        const owner = await testService.getTestOwnership(id);
        if (!owner) {
          res.status(404).json({ message: "Test not found" });
          return;
        }
        if (owner.sellerId && owner.sellerId !== userId) {
          res.status(403).json({ message: "You don't own this test" });
          return;
        }
      }

      const result = await testService.deleteTest(id);
      res.status(200).json({ message: "Test deleted", data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Internal endpoint — course-service calls this to validate that the seller
   * linking a test as a course's final test actually owns it.
   */
  public async getOwnershipInternal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const sellerId = req.query.sellerId as string | undefined;
      const owner = await testService.getTestOwnership(id);
      if (!owner) {
        res.status(404).json({ message: "Test not found" });
        return;
      }
      if (sellerId && owner.sellerId && owner.sellerId !== sellerId) {
        res.status(403).json({ message: "Test belongs to a different seller" });
        return;
      }
      res.status(200).json({ data: owner });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Internal endpoint — course-service calls this to record that a test is
   * being used by a course (as final test or quiz lesson). Idempotent.
   */
  public async linkCourseInternal(req: Request, res: Response, next: NextFunction) {
    try {
      const testId = req.params.id as string;
      const courseId = req.query.courseId as string | undefined;
      const sellerId = req.query.sellerId as string | undefined;
      if (!courseId) {
        res.status(400).json({ message: "courseId is required" });
        return;
      }
      const owner = await testService.getTestOwnership(testId);
      if (!owner) {
        res.status(404).json({ message: "Test not found" });
        return;
      }
      if (sellerId && owner.sellerId && owner.sellerId !== sellerId) {
        res.status(403).json({ message: "Test belongs to a different seller" });
        return;
      }
      await testService.linkCourse(testId, courseId);
      res.status(200).json({ message: "Linked" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Internal endpoint — course-service calls this to remove the course↔test
   * link record. Idempotent (no-op if the link doesn't exist).
   */
  public async unlinkCourseInternal(req: Request, res: Response, next: NextFunction) {
    try {
      const testId = req.params.id as string;
      const courseId = req.query.courseId as string | undefined;
      const sellerId = req.query.sellerId as string | undefined;
      if (!courseId) {
        res.status(400).json({ message: "courseId is required" });
        return;
      }
      const owner = await testService.getTestOwnership(testId);
      if (!owner) {
        res.status(404).json({ message: "Test not found" });
        return;
      }
      if (sellerId && owner.sellerId && owner.sellerId !== sellerId) {
        res.status(403).json({ message: "Test belongs to a different seller" });
        return;
      }
      await testService.unlinkCourse(testId, courseId);
      res.status(200).json({ message: "Unlinked" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Internal endpoint — course-service calls this to hard-delete an orphan
   * test (e.g. seller is overwriting their course's final test with a new one;
   * the old test row should not linger in the DB). Verifies ownership via the
   * `sellerId` query param before deleting.
   */
  public async deleteTestInternal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const sellerId = req.query.sellerId as string | undefined;
      const owner = await testService.getTestOwnership(id);
      if (!owner) {
        res.status(404).json({ message: "Test not found" });
        return;
      }
      if (sellerId && owner.sellerId && owner.sellerId !== sellerId) {
        res.status(403).json({ message: "Test belongs to a different seller" });
        return;
      }
      await testService.deleteTest(id);
      res.status(200).json({ message: "Test deleted" });
    } catch (error) {
      next(error);
    }
  }

  public async getTestTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await testService.getTestTypes();
      res.status(200).json({ message: "Test types retrieved", data: types });
    } catch (error) {
      next(error);
    }
  }

  public async uploadAudio(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file;
      if (!file) {
        res.status(400).json({ message: "No audio file provided" });
        return;
      }
      const ALLOWED_AUDIO_MIME = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav", "audio/webm", "audio/ogg", "audio/mp4", "audio/x-m4a", "audio/aac"];
      const ALLOWED_AUDIO_EXT = [".mp3", ".wav", ".webm", ".ogg", ".m4a", ".aac", ".mp4"];
      const name = (file.originalname || "").toLowerCase();
      const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
      const mimeOk = ALLOWED_AUDIO_MIME.includes((file.mimetype || "").toLowerCase());
      const extOk = ALLOWED_AUDIO_EXT.includes(ext);
      if (!mimeOk && !extOk) {
        res.status(400).json({ message: `Unsupported audio format. Allowed: ${ALLOWED_AUDIO_EXT.join(", ")}` });
        return;
      }
      const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
      if (file.size > MAX_AUDIO_BYTES) {
        res.status(400).json({ message: `Audio too large. Max ${Math.round(MAX_AUDIO_BYTES / 1024 / 1024)}MB.` });
        return;
      }
      const url = await s3Service.uploadFile(file, "audio");
      res.status(200).json({ message: "Audio uploaded", data: { url } });
    } catch (error) {
      next(error);
    }
  }

  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file;
      if (!file) {
        res.status(400).json({ message: "No image file provided" });
        return;
      }
      const ALLOWED_IMG_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      const ALLOWED_IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const name = (file.originalname || "").toLowerCase();
      const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
      const mimeOk = ALLOWED_IMG_MIME.includes((file.mimetype || "").toLowerCase());
      const extOk = ALLOWED_IMG_EXT.includes(ext);
      if (!mimeOk && !extOk) {
        res.status(400).json({ message: `Unsupported image format. Allowed: ${ALLOWED_IMG_EXT.join(", ")}` });
        return;
      }
      const MAX_IMG_BYTES = 10 * 1024 * 1024;
      if (file.size > MAX_IMG_BYTES) {
        res.status(400).json({ message: `Image too large. Max ${Math.round(MAX_IMG_BYTES / 1024 / 1024)}MB.` });
        return;
      }
      const url = await s3Service.uploadFile(file, "images");
      res.status(200).json({ message: "Image uploaded", data: { url } });
    } catch (error) {
      next(error);
    }
  }

  public async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const testId = req.params.id as string;
      const { userId } = req.body as { userId?: string };
      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }
      const result = await testService.startSession(testId, userId);
      res.status(201).json({ message: "Session started", data: result });
    } catch (error) {
      next(error);
    }
  }

  public async submitTest(req: Request, res: Response, next: NextFunction) {
    try {
      const testId = req.params.id as string;
      const { submissions, userId } = req.body as { submissions: Record<string, string>; userId?: string };
      if (!submissions || typeof submissions !== "object") {
        res.status(400).json({ message: "submissions object is required" });
        return;
      }
      const result = await testService.gradeTest(testId, submissions, userId);
      res.status(200).json({ message: "Test graded", data: result });
    } catch (error) {
      next(error);
    }
  }

  public async getTestHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const history = await testService.getTestHistory(userId);
      res.status(200).json({ message: "History retrieved", data: history });
    } catch (error) {
      next(error);
    }
  }

  public async getAttemptDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const attempt = await testService.getAttemptDetail(sessionId);
      res.status(200).json({ message: "Attempt detail retrieved", data: attempt });
    } catch (error) {
      next(error);
    }
  }

  // TEMP: Seed score conversions
  public async seedScoreConversions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await testService.seedScoreConversions();
      res.status(200).json({ message: "Score conversions seeded", data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const testController = new TestController();
