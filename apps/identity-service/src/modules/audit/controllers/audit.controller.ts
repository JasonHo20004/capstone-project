// =============================================================================
// Audit Log Controller - HTTP handlers
// =============================================================================

import { Request, Response } from "express";
import { AuditService } from "../services/audit.service.js";
import type { CreateAuditLogInput, ListAuditLogsQuery } from "../dtos/audit.dto.js";

export class AuditController {
  private service = new AuditService();

  /**
   * POST /api/admin/audit-logs
   * Record an admin action. The frontend calls this after performing the
   * actual mutation (wallet adjust, course reject, etc.) so the trail captures
   * the reason + metadata even when the mutation lives in a different service.
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const actorId = req.user?.userId;
      if (!actorId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const ip =
        (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        null;
      const log = await this.service.record(
        actorId,
        req.body as CreateAuditLogInput,
        ip,
      );
      res.status(201).json({ success: true, data: log });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to record audit log",
      });
    }
  };

  /**
   * GET /api/admin/audit-logs
   * List audit logs with filters + pagination.
   */
  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.list(req.query as unknown as ListAuditLogsQuery);
      res.status(200).json({
        success: true,
        data: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to list audit logs",
      });
    }
  };
}
