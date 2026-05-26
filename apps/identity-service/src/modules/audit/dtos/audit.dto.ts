import { z } from "zod";

export const ADMIN_AUDIT_ACTIONS = [
  "WALLET_ADJUST",
  "USER_STATUS_CHANGE",
  "USER_DELETE",
  "APPLICATION_APPROVE",
  "APPLICATION_REJECT",
  "COURSE_APPROVE",
  "COURSE_REJECT",
  "COMMENT_MODERATE",
  "WITHDRAWAL_APPROVE",
  "WITHDRAWAL_REJECT",
  "REFUND_APPROVE",
  "REFUND_REJECT",
  "OTHER",
] as const;

export const ADMIN_AUDIT_ENTITIES = [
  "USER",
  "WALLET",
  "APPLICATION",
  "COURSE",
  "COMMENT",
  "WITHDRAWAL",
  "REFUND",
  "OTHER",
] as const;

export const createAuditLogSchema = z.object({
  action: z.enum(ADMIN_AUDIT_ACTIONS),
  entityType: z.enum(ADMIN_AUDIT_ENTITIES),
  entityId: z.string().max(100).optional(),
  reason: z.string().max(2000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const listAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  action: z.enum(ADMIN_AUDIT_ACTIONS).optional(),
  entityType: z.enum(ADMIN_AUDIT_ENTITIES).optional(),
  entityId: z.string().max(100).optional(),
  actorId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;
export type ListAuditLogsQuery = z.infer<typeof listAuditLogsQuerySchema>;
