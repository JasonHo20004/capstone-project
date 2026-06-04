// =============================================================================
// Livestream Recording Routes
// Durable Postgres archive of completed AI livestream lessons. The live session
// lives in Redis (rag-service) with a 7-day TTL; rag-service POSTs the finished
// lesson here so it survives permanently and stays queryable.
//
// `/internal/*` endpoints are unauthenticated service-to-service calls (same
// convention as identity-service /api/users/internal/*) — trusted internal
// network only, never exposed through the public gateway.
// =============================================================================

import { Router, Request, Response } from "express";
import { asyncHandler } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";

const router: ReturnType<typeof Router> = Router();

// POST /api/livestream-recordings/internal
// Upsert by roomId so a re-save (e.g. retry) updates in place instead of
// duplicating. Called by rag-service when a livestream lesson completes.
router.post(
  "/internal",
  asyncHandler(async (req: Request, res: Response) => {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const roomId = typeof b.roomId === "string" ? b.roomId.trim() : "";
    const topic = typeof b.topic === "string" ? b.topic.trim() : "";

    if (!roomId || !topic) {
      res.status(400).json({ success: false, message: "roomId and topic are required" });
      return;
    }

    const data = {
      topic,
      level: String(b.level ?? "intermediate").slice(0, 20),
      levelLabel: b.levelLabel ? String(b.levelLabel).slice(0, 50) : null,
      hostId: b.hostId ? String(b.hostId) : null,
      hostName: b.hostName ? String(b.hostName).slice(0, 200) : null,
      language: b.language ? String(b.language).slice(0, 10) : null,
      sections: (b.sections ?? []) as object,
      qa: (b.qa ?? []) as object,
      completedAt: b.completedAt ? new Date(b.completedAt as string) : new Date(),
    };

    const prisma = databaseService.getClient();
    const rec = await (prisma as any).livestreamRecording.upsert({
      where: { roomId },
      create: { roomId, ...data },
      update: data,
    });

    res.status(201).json({ success: true, data: { id: rec.id, roomId: rec.roomId } });
  })
);

// GET /api/livestream-recordings/internal — paginated list (lightweight columns)
router.get(
  "/internal",
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const [items, total] = await Promise.all([
      (prisma as any).livestreamRecording.findMany({
        orderBy: { completedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          roomId: true,
          topic: true,
          level: true,
          levelLabel: true,
          hostId: true,
          hostName: true,
          language: true,
          completedAt: true,
          createdAt: true,
        },
      }),
      (prisma as any).livestreamRecording.count(),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  })
);

// GET /api/livestream-recordings/internal/:roomId — full recording (sections + qa)
router.get(
  "/internal/:roomId",
  asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const rec = await (prisma as any).livestreamRecording.findUnique({
      where: { roomId: req.params.roomId as string },
    });
    if (!rec) {
      res.status(404).json({ success: false, message: "Recording not found" });
      return;
    }
    res.json({ success: true, data: rec });
  })
);

export default router;
