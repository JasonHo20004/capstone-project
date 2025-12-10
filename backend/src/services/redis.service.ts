import { createClient, type RedisClientType } from "redis";

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected && this.client) return;

    const url =
      process.env.REDIS_URL ||
      `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
        process.env.REDIS_PORT || "6379"
      }`;

    this.client = createClient({ url });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      this.isConnected = false;
    });

    await this.client.connect();
    this.isConnected = true;
    console.log("Redis kết nối thành công");
  }

  public getClient(): RedisClientType {
    if (!this.client) {
      throw new Error("Redis client chưa được khởi tạo. Vui lòng gọi connect() trước.");
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log("Redis đã ngắt kết nối");
    }
  }
}

export const redisService = RedisService.getInstance();
export default redisService;


