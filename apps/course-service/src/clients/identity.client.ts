// =============================================================================
// Identity Client - HTTP client to communicate with Identity Service
// =============================================================================

import type { UserBasicInfo } from "@capstone/common";

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || "http://localhost:3001";

export class IdentityClient {
  private static instance: IdentityClient;

  public static getInstance(): IdentityClient {
    if (!IdentityClient.instance) {
      IdentityClient.instance = new IdentityClient();
    }
    return IdentityClient.instance;
  }

  async getUserBasicInfo(userId: string): Promise<UserBasicInfo | null> {
    try {
      const response = await fetch(`${IDENTITY_SERVICE_URL}/api/users/internal/${userId}`);
      if (!response.ok) return null;
      const data = await response.json() as { data: UserBasicInfo };
      return data.data;
    } catch (error) {
      console.error(`[Course Service] Error fetching user:`, error);
      return null;
    }
  }

  /**
   * Search identity-service users by fullName/email substring. Used to filter
   * cross-service lists (e.g. a seller's learners) by learner identity.
   */
  async searchUsersBasic(query: string, limit: number = 500): Promise<UserBasicInfo[]> {
    const q = query.trim();
    if (!q) return [];
    try {
      const response = await fetch(`${IDENTITY_SERVICE_URL}/api/users/internal/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit }),
      });
      if (!response.ok) return [];
      const data = await response.json() as { data: UserBasicInfo[] };
      return data.data || [];
    } catch (error) {
      console.error("[Course Service] Error searching users:", error);
      return [];
    }
  }

  async getUsersBasicInfo(userIds: string[]): Promise<Map<string, UserBasicInfo>> {
    const result = new Map<string, UserBasicInfo>();
    if (!userIds.length) return result;

    try {
      const response = await fetch(`${IDENTITY_SERVICE_URL}/api/users/internal/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: userIds }),
      });
      if (!response.ok) throw new Error(`Batch failed: ${response.status}`);
      const data = await response.json() as { data: UserBasicInfo[] };
      const users = data.data || [];
      users.forEach((u) => result.set(u.id, u));
    } catch (error) {
      console.warn("[Course Service] Batch fetch failed, falling back:", error);
      const promises = userIds.map((id) => this.getUserBasicInfo(id));
      const users = await Promise.all(promises);
      users.forEach((user, index) => {
        if (user) result.set(userIds[index], user);
      });
    }

    return result;
  }

  async getUserStats(): Promise<any> {
    try {
      const response = await fetch(`${IDENTITY_SERVICE_URL}/api/users/internal/stats`);
      if (!response.ok) return null;
      const data = await response.json() as { data: any };
      return data.data;
    } catch (error) {
      console.error(`[Course Service] Error fetching user stats:`, error);
      return null;
    }
  }

  /**
   * Check whether `userId` has an active seller profile.
   * Returns null on transport error so callers can decide to fail-open or fail-closed.
   */
  async getSellerStatus(userId: string): Promise<{ hasProfile: boolean; active: boolean } | null> {
    try {
      const response = await fetch(
        `${IDENTITY_SERVICE_URL}/api/users/internal/${userId}/seller-status`
      );
      if (!response.ok) return null;
      const data = await response.json() as { data: { hasProfile: boolean; active: boolean } };
      return data.data;
    } catch (error) {
      console.error(`[Course Service] Error fetching seller status:`, error);
      return null;
    }
  }
}

export const identityClient = IdentityClient.getInstance();
