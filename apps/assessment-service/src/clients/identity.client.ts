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
      const data = await response.json();
      return data.data as UserBasicInfo;
    } catch (error) {
      console.error(`[Assessment Service] Error fetching user:`, error);
      return null;
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
      const data = await response.json();
      const users = (data.data || []) as UserBasicInfo[];
      users.forEach((u) => result.set(u.id, u));
    } catch (error) {
      console.warn("[Assessment Service] Batch fetch failed, falling back:", error);
      const promises = userIds.map((id) => this.getUserBasicInfo(id));
      const users = await Promise.all(promises);
      users.forEach((user, index) => {
        if (user) result.set(userIds[index], user);
      });
    }

    return result;
  }

  async updateEnglishLevel(userId: string, englishLevel: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${IDENTITY_SERVICE_URL}/api/users/internal/${userId}/english-level`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ englishLevel }),
        }
      );
      return response.ok;
    } catch (error) {
      console.error(`[Assessment Service] Error updating englishLevel:`, error);
      return false;
    }
  }
}

export const identityClient = IdentityClient.getInstance();
