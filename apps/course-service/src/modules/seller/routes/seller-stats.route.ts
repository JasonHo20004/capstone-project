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
router.get("/comments", authenticateToken, requireSeller, controller.getComments);

// Get seller's courses with stats
router.get("/courses", authenticateToken, requireSeller, controller.getMyCourses);

// Get seller's monthly fees (subscription payments)
router.get("/fees", authenticateToken, requireSeller, controller.getMonthlyFees);

export default router;
