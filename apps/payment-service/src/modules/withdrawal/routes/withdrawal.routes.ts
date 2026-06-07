// =============================================================================
// Withdrawal Routes
// =============================================================================

import { Router, type Router as IRouter } from "express";
import multer from "multer";
import { WithdrawalController } from "../controllers/withdrawal.controller.js";
import { authenticateToken, requireAdmin, validate } from "@capstone/common";
import {
  requestWithdrawalSchema,
  getHistoryQuerySchema,
  cancelWithdrawalSchema,
  retryWithdrawalSchema,
  getAdminRequestsSchema,
  approveWithdrawalSchema,
  rejectWithdrawalSchema,
} from "../dtos/withdrawal.dto.js";

const router: IRouter = Router();
const controller = new WithdrawalController();

// In-memory storage; file is streamed straight to S3 in the controller.
// 5 MB cap matches identity-service's seller-certifications upload.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP"));
    }
  },
});

// ── Seller endpoints ────────────────────────────────────────────────────
router.post("/seller/request", authenticateToken, validate(requestWithdrawalSchema), controller.requestWithdrawal);
router.get("/seller/history", authenticateToken, validate(getHistoryQuerySchema), controller.getSellerWithdrawals);
router.post("/seller/requests/:id/cancel", authenticateToken, validate(cancelWithdrawalSchema), controller.cancelWithdrawal);
router.post("/seller/requests/:id/retry", authenticateToken, validate(retryWithdrawalSchema), controller.retryWithdrawal);

// ── Admin endpoints ─────────────────────────────────────────────────────
router.get("/admin/summary", authenticateToken, requireAdmin, controller.getAdminSummary);
router.get("/admin/requests", authenticateToken, requireAdmin, validate(getAdminRequestsSchema), controller.getAdminRequests);
router.post(
  "/admin/upload-proof",
  authenticateToken,
  requireAdmin,
  upload.single("file"),
  controller.uploadProofImage
);
router.post("/admin/requests/:id/approve", authenticateToken, requireAdmin, validate(approveWithdrawalSchema), controller.approveWithdrawal);
router.post("/admin/requests/:id/reject", authenticateToken, requireAdmin, validate(rejectWithdrawalSchema), controller.rejectWithdrawal);

export default router;
