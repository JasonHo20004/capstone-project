// =============================================================================
// Identity Service - Redis Service
// =============================================================================

import { createClient, RedisClientType } from "redis";

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.client = createClient({ url: redisUrl });

    this.client.on("error", (err) => {
      console.error("❌ [Identity Service] Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      console.log("📡 [Identity Service] Redis connecting...");
    });

    this.client.on("ready", () => {
      this.isConnected = true;
      console.log("✅ [Identity Service] Redis connected successfully");
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
    if (this.isConnected) return;
    await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await this.client.quit();
    this.isConnected = false;
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export const redisService = RedisService.getInstance();
export default redisService;
