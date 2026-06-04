import { Router } from "express";
import { SellerStatsController } from "../controllers/seller-stats.controller.js";
import { authenticateToken, requireSeller } from "@capstone/common";

const router: Router = Router();
const controller = new SellerStatsController();

// All routes require authentication and seller role

// Get seller dashboard statistics
router.get("/dashboard", authenticateToken, requireSeller, controller.getDashboardStats);

// Get seller's learners
router.get("/learners", authenticateToken, requireSeller, controller.getLearners);

// Get seller's comments on courses
// NOTE: /comments/summary must come BEFORE /comments/:commentId so the
// "summary" segment doesn't get parsed as a commentId.
router.get("/comments/summary", authenticateToken, requireSeller, controller.getCommentsSummary);
router.get("/comments", authenticateToken, requireSeller, controller.getComments);
router.delete("/comments/:commentId", authenticateToken, requireSeller, controller.deleteComment);

// Get seller's courses with stats
router.get("/courses", authenticateToken, requireSeller, controller.getMyCourses);

// Get seller's monthly fees (subscription payments)
router.get("/fees", authenticateToken, requireSeller, controller.getMonthlyFees);
router.get("/fees/:year/:month/detail", authenticateToken, requireSeller, controller.getMonthlyFeeDetail);

export default router;
