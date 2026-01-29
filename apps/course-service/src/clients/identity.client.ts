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
      
      if (!response.ok) {
        console.warn(`[Course Service] Failed to fetch user ${userId} from Identity Service`);
        return null;
      }

      const data = await response.json();
      return data.data as UserBasicInfo;
    } catch (error) {
      console.error(`[Course Service] Error fetching user from Identity Service:`, error);
      return null;
    }
  }

  async getUsersBasicInfo(userIds: string[]): Promise<Map<string, UserBasicInfo>> {
    const result = new Map<string, UserBasicInfo>();
    
    // Fetch in parallel with batching
    const batchSize = 10;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      const promises = batch.map((id) => this.getUserBasicInfo(id));
      const users = await Promise.all(promises);
      
      users.forEach((user, index) => {
        if (user) {
          result.set(batch[index], user);
        }
      });
    }
    
    return result;
  }
}

export const identityClient = IdentityClient.getInstance();
