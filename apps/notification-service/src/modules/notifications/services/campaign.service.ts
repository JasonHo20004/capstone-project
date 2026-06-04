// =============================================================================
// Campaign Service — resolves recipient segments and fans out a single
// notification payload to many users via the existing bulk pipeline.
// =============================================================================

import { NotificationService } from "./notification.service.js";
import { listUserIdsByRoles } from "../../../clients/identity.client.js";

export type CampaignSegment =
  | { kind: "all" }
  | { kind: "role"; roles: string[] }
  | { kind: "user-ids"; userIds: string[] };

export interface CampaignInput {
  title: string;
  content: string;
  /** Free-form type label (e.g. "ADMIN_BROADCAST") — stored on each row. */
  type: string;
  metadata?: Record<string, unknown>;
  segment: CampaignSegment;
}

export interface CampaignResult {
  recipientCount: number;
  createdCount: number;
  segmentKind: CampaignSegment["kind"];
}

export class CampaignService {
  constructor(private readonly notificationService: NotificationService) {}

  async run(input: CampaignInput): Promise<CampaignResult> {
    const userIds = await this.resolveRecipients(input.segment);
    const uniqueIds = Array.from(new Set(userIds));
    if (uniqueIds.length === 0) {
      return {
        recipientCount: 0,
        createdCount: 0,
        segmentKind: input.segment.kind,
      };
    }

    const result = await this.notificationService.createBulkNotifications({
      userIds: uniqueIds,
      title: input.title,
      content: input.content,
      type: input.type as any,
      metadata: {
        ...input.metadata,
        campaign: true,
        segmentKind: input.segment.kind,
      },
    });

    return {
      recipientCount: uniqueIds.length,
      createdCount: result.count,
      segmentKind: input.segment.kind,
    };
  }

  async previewRecipients(segment: CampaignSegment): Promise<number> {
    const ids = await this.resolveRecipients(segment);
    return new Set(ids).size;
  }

  private async resolveRecipients(segment: CampaignSegment): Promise<string[]> {
    switch (segment.kind) {
      case "all":
        return listUserIdsByRoles(["ALL"]);
      case "role":
        if (!segment.roles?.length) return [];
        return listUserIdsByRoles(segment.roles);
      case "user-ids":
        return segment.userIds?.filter((id) => typeof id === "string" && id) ?? [];
      default:
        return [];
    }
  }
}
