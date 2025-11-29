import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware";
import { databaseService } from "@/services/database.service";

/**
 * Middleware to verify if the requesting user is enrolled in the target course.
 * This guard prevents unauthorized access to paid content (video URLs).
 * 
 * Usage: Place after authMiddleware in route chain.
 * Expects courseId in req.params.
 */
export const isEnrolledMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required",
      });
      return;
    }

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: "Bad Request: Course ID is required",
      });
      return;
    }

    const prisma = databaseService.getClient();

    // Check if user has an active enrollment (UserActivity) for this course
    const enrollment = await prisma.userActivity.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!enrollment) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not enrolled in this course",
      });
      return;
    }

    // User is enrolled, proceed to next middleware/controller
    next();
  } catch (error) {
    console.error("Enrollment check error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking enrollment",
    });
  }
};

/**
 * Middleware to verify if the requesting user has purchased the course
 * (verified purchaser for rating purposes).
 */
export const isVerifiedPurchaserMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required",
      });
      return;
    }

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: "Bad Request: Course ID is required",
      });
      return;
    }

    const prisma = databaseService.getClient();

    // Check if user has purchased (UserActivity with transaction) for this course
    const purchase = await prisma.userActivity.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        transaction: true,
      },
    });

    if (!purchase || !purchase.transaction) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You must purchase this course to perform this action",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Verified purchaser check error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while verifying purchase",
    });
  }
};

