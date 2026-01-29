import { Router } from "express";
import { SellerController } from "../controllers/seller.controller.js";
import { authenticateToken, validate } from "@capstone/common";
import { applyForSellerSchema } from "../dtos/seller.dto.js";

const router: Router = Router();
const controller = new SellerController();

// ===== User Routes (Authenticated) =====

// Apply to become a course seller
router.post(
  "/apply",
  authenticateToken,
  validate({ body: applyForSellerSchema }),
  controller.applyForSeller
);

// Get my application status
router.get("/application", authenticateToken, controller.getMyApplication);

// Get my seller profile
router.get("/profile", authenticateToken, controller.getMyProfile);

// Update my seller profile
router.put("/profile", authenticateToken, controller.updateMyProfile);

export default router;
