// =============================================================================
// Audit Log Repository - DB ops for admin_audit_logs
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type {
  Prisma,
  AdminAuditAction,
  AdminAuditEntity,
} from "../../../../generated/prisma/index.js";

export interface ListLogsFilters {
  page: number;
  limit: number;
  action?: AdminAuditAction;
  entityType?: AdminAuditEntity;
  entityId?: string;
  actorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class AuditRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    actorId: string;
    actorEmail: string;
    action: AdminAuditAction;
    entityType: AdminAuditEntity;
    entityId?: string | null;
    reason?: string | null;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string | null;
  }) {
    return await this.prisma.adminAuditLog.create({ data });
  }

  async list(filters: ListLogsFilters) {
    const where: Prisma.AdminAuditLogWhereInput = {};
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.actorId) where.actorId = filters.actorId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const skip = (filters.page - 1) * filters.limit;
    const [items, total] = await Promise.all([
      this.prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: filters.limit,
      }),
      this.prisma.adminAuditLog.count({ where }),
    ]);

    return { items, total, page: filters.page, limit: filters.limit };
  }
}
