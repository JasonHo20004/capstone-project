// =============================================================================
// Campaign Controller — admin endpoint to fan out a notification to a segment
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler, BadRequestError } from "@capstone/common";
import { CampaignService, type CampaignSegment } from "../services/campaign.service.js";
import { NotificationService } from "../services/notification.service.js";
import { NotificationRepository } from "../repositories/notification.repository.js";

const ALLOWED_KINDS = ["all", "role", "user-ids"] as const;

function parseSegment(raw: unknown): CampaignSegment {
  if (!raw || typeof raw !== "object") {
    throw new BadRequestError("segment is required");
  }
  const obj = raw as Record<string, unknown>;
  const kind = obj.kind as string | undefined;
  if (!kind || !(ALLOWED_KINDS as readonly string[]).includes(kind)) {
    throw new BadRequestError("segment.kind must be one of: all, role, user-ids");
  }
  if (kind === "role") {
    const roles = Array.isArray(obj.roles) ? (obj.roles as string[]) : [];
    if (roles.length === 0) {
      throw new BadRequestError("segment.roles must be a non-empty array");
    }
    return { kind: "role", roles };
  }
  if (kind === "user-ids") {
    const userIds = Array.isArray(obj.userIds) ? (obj.userIds as string[]) : [];
    if (userIds.length === 0) {
      throw new BadRequestError("segment.userIds must be a non-empty array");
    }
    return { kind: "user-ids", userIds };
  }
  return { kind: "all" };
}

export class CampaignController {
  private campaignService: CampaignService;

  constructor() {
    const notificationService = new NotificationService(new NotificationRepository());
    this.campaignService = new CampaignService(notificationService);
  }

  run = asyncHandler(async (req: Request, res: Response) => {
    const { title, content, type, metadata, segment } = req.body ?? {};
    if (!title?.trim() || !content?.trim()) {
      throw new BadRequestError("title and content are required");
    }
    if (!type) {
      throw new BadRequestError("type is required");
    }
    const parsedSegment = parseSegment(segment);
    const result = await this.campaignService.run({
      title: String(title).trim(),
      content: String(content).trim(),
      type: String(type),
      metadata,
      segment: parsedSegment,
    });
    res.status(201).json({ success: true, data: result });
  });

  preview = asyncHandler(async (req: Request, res: Response) => {
    const parsedSegment = parseSegment(req.body?.segment);
    const count = await this.campaignService.previewRecipients(parsedSegment);
    res.json({ success: true, data: { recipientCount: count } });
  });
}
