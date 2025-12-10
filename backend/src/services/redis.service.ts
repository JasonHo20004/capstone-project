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
    if (this.isConnected && this.client) {
      return;
    }

    // Ưu tiên dùng REDIS_URL (Format chuẩn cho Upstash/Render)
    // Nếu không có mới fallback về cấu hình Localhost
    const url =
      process.env.REDIS_URL ||
      `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
        process.env.REDIS_PORT || "6379"
      }`;

    // Log ra để debug xem đang kết nối vào đâu (nhưng che mật khẩu)
    console.log(`Connecting to Redis at: ${this.maskUrl(url)}`);

    this.client = createClient({
      url,
      // Cấu hình socket: Thư viện 'redis' v4+ rất thông minh.
      // Nếu url là 'rediss://' (Upstash), nó tự động bật TLS.
      // Nếu gặp lỗi chứng chỉ (Self-signed), bạn có thể bỏ comment dòng dưới:
      // socket: {
      //   rejectUnauthorized: false 
      // }
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      // Lưu ý: Không set isConnected = false ở đây ngay, 
      // để thư viện tự động thử reconnect (reconnection strategy)
    });

    this.client.on("ready", () => {
      this.isConnected = true;
      console.log("Redis connected successfully!");
    });

    this.client.on("end", () => {
      this.isConnected = false;
      console.log("Redis connection ended");
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
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      this.client = null;
      console.log("Redis đã ngắt kết nối");

    }
  }

  // Hàm phụ trợ để che mật khẩu khi log ra console (Bảo mật)
  private maskUrl(url: string): string {
    try {
        if (!url.includes('@')) return url;
        // Logic đơn giản để thay thế password bằng ****
        return url.replace(/\/\/[^:]+:([^@]+)@/, '//***:****@');
    } catch {
        return "Invalid URL";
    }
  }
}

export const redisService = RedisService.getInstance();
export default redisService;