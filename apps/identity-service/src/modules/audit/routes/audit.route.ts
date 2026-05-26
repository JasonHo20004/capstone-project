import { Router } from "express";
import { AuditController } from "../controllers/audit.controller.js";
import { authenticateToken, requireAdmin, validate } from "@capstone/common";
import { createAuditLogSchema, listAuditLogsQuerySchema } from "../dtos/audit.dto.js";

const router: Router = Router();
const controller = new AuditController();

// ===== Admin Audit Log Routes (Requires Admin Role) =====

router.post(
  "/audit-logs",
  authenticateToken,
  requireAdmin,
  validate({ body: createAuditLogSchema }),
  controller.create,
);

router.get(
  "/audit-logs",
  authenticateToken,
  requireAdmin,
  validate({ query: listAuditLogsQuerySchema }),
  controller.list,
);

export default router;
