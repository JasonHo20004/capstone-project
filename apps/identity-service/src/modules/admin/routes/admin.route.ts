import { Router } from "express";
import { SellerController } from "../../seller/controllers/seller.controller.js";
import { authenticateToken, requireAdmin, validate } from "@capstone/common";
import { updateApplicationStatusSchema } from "../../seller/dtos/seller.dto.js";


const router: Router = Router();
const sellerController = new SellerController();

// ===== Admin Routes (Requires Admin Role) =====

// Get all seller applications
router.get(
  "/seller-applications",
  authenticateToken,
  requireAdmin,
  sellerController.getAllApplications
);

// Approve or reject seller application
router.patch(
  "/seller-applications/:id",
  authenticateToken,
  requireAdmin,
  validate({ body: updateApplicationStatusSchema }),
  sellerController.updateApplicationStatus
);

export default router;
