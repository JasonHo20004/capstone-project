// =============================================================================
// Assessment Service - Database Service
// =============================================================================

import { PrismaClient, Prisma } from "../../generated/prisma/index.js";

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
      errorFormat: "pretty",
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(maxRetries = 5, baseDelayMs = 2000): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.prisma.$connect();
        console.log("✅ [Assessment Service] Database connected successfully");
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          console.error("❌ [Assessment Service] Database connection failed after all retries:", error);
          throw error;
        }
        const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.warn(`⚠️ [Assessment Service] Database connection attempt ${attempt}/${maxRetries} failed, retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }
}

export const databaseService = DatabaseService.getInstance();
export default databaseService;
