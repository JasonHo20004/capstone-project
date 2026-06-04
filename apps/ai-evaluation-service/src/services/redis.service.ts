// =============================================================================
// AI Evaluation Service - Redis Service (for BullMQ + Caching)
// =============================================================================

import { createClient, RedisClientType } from "redis";

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;

  private constructor() {
    const redisHost = process.env.REDIS_HOST || "localhost";
    const isUrl = redisHost.startsWith("redis://") || redisHost.startsWith("rediss://");

    this.client = createClient(
      isUrl
        ? { url: redisHost }
        : {
            socket: {
              host: redisHost,
              port: parseInt(process.env.REDIS_PORT || "6379"),
            },
          }
    );

    this.client.on("error", (err) => {
      console.error("❌ [AI Evaluation Service] Redis error:", err);
    });

    this.client.on("connect", () => {
      console.log("✅ [AI Evaluation Service] Redis connected");
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  // Cache helper: get cached result or null
  public async getCached(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  // Cache helper: set with TTL in seconds
  public async setWithTTL(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, { EX: ttlSeconds });
  }
}

export const redisService = RedisService.getInstance();
export default redisService;
