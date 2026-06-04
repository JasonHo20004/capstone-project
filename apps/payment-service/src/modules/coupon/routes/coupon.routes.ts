// =============================================================================
// Coupon Routes — learner validate + admin CRUD
// =============================================================================

import { Router, type Router as IRouter } from "express";
import { CouponController } from "../controllers/coupon.controller.js";
import { authenticateToken, requireAdmin } from "@capstone/common";

const router: IRouter = Router();
const controller = new CouponController();

router.post("/coupons/validate", authenticateToken, controller.validate);

router.get("/admin/coupons", authenticateToken, requireAdmin, controller.list);
router.get("/admin/coupons/:id", authenticateToken, requireAdmin, controller.getOne);
router.post("/admin/coupons", authenticateToken, requireAdmin, controller.create);
router.patch("/admin/coupons/:id", authenticateToken, requireAdmin, controller.update);
router.post(
  "/admin/coupons/:id/deactivate",
  authenticateToken,
  requireAdmin,
  controller.deactivate
);

export default router;
