// =============================================================================
// Audit Log Service - business logic for admin audit trail
// =============================================================================

import { AuditRepository, type ListLogsFilters } from "../repositories/audit.repository.js";
import type { CreateAuditLogInput, ListAuditLogsQuery } from "../dtos/audit.dto.js";
import { UserRepository } from "../../users/repositories/user.repository.js";

export class AuditService {
  private repository = new AuditRepository();
  private userRepository = new UserRepository();

  /**
   * Record an audit entry. Caller must supply the authenticated admin's id;
   * we look up the email here to denormalise it (so the log stays readable
   * even if the admin account is later deleted/renamed).
   */
  async record(
    actorId: string,
    input: CreateAuditLogInput,
    ipAddress?: string | null,
  ) {
    const actor = await this.userRepository.findById(actorId);
    if (!actor) throw new Error("Actor not found");

    return await this.repository.create({
      actorId,
      actorEmail: actor.email,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      reason: input.reason ?? null,
      metadata: input.metadata as never,
      ipAddress: ipAddress ?? null,
    });
  }

  async list(query: ListAuditLogsQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const filters: ListLogsFilters = {
      page,
      limit,
      action: query.action,
      entityType: query.entityType,
      entityId: query.entityId,
      actorId: query.actorId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    };
    return await this.repository.list(filters);
  }
}
