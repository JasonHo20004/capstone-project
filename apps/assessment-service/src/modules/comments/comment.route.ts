import { Router, Request, Response } from "express";
import { authenticateToken, asyncHandler } from "@capstone/common";
import { databaseService } from "../../services/database.service.js";
import { identityClient } from "../../clients/identity.client.js";

const router = Router();

// Helper: resolve testId param (could be UUID or slug) to actual UUID
async function resolveTestId(testIdOrSlug: string): Promise<string | null> {
  const prisma = databaseService.getClient();
  // UUID v4 pattern
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testIdOrSlug);
  if (isUuid) return testIdOrSlug;

  // Lookup by slug
  const test = await prisma.test.findFirst({ where: { slug: testIdOrSlug }, select: { id: true } });
  return test?.id ?? null;
}

// GET /api/test-comments/:testId - Get comments for a test
router.get(
  "/:testId",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const testIdParam = req.params.testId as string;
    const testId = await resolveTestId(testIdParam);
    if (!testId) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const prisma = databaseService.getClient();

    const [comments, total] = await Promise.all([
      prisma.testComment.findMany({
        where: { testId },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.testComment.count({ where: { testId } }),
    ]);

    // Enrich with user info
    const userIds = [...new Set(comments.map((c) => c.userId))];
    const usersMap = await identityClient.getUsersBasicInfo(userIds);

    const enrichedComments = comments.map((c) => {
      const user = usersMap.get(c.userId);
      return {
        ...c,
        user: user ? { fullName: user.fullName, profilePicture: user.profilePicture } : null,
      };
    });

    res.json({ success: true, data: { comments: enrichedComments, total, page, limit } });
  })
);

// POST /api/test-comments/:testId - Post a comment on a test
router.post(
  "/:testId",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const testIdParam = req.params.testId as string;
    const testId = await resolveTestId(testIdParam);
    if (!testId) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const userId = (req as any).user?.userId;
    const { content, parentCommentId } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const prisma = databaseService.getClient();

    const comment = await prisma.testComment.create({
      data: {
        testId,
        userId,
        content: content.trim(),
        parentCommentId: parentCommentId || null,
      },
    });

    res.status(201).json({ success: true, data: comment });
  })
);

export default router;
