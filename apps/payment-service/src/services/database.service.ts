// =============================================================================
// Payment Service - Database Service
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

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("✅ [Payment Service] Database connected successfully");
    } catch (error) {
      console.error("❌ [Payment Service] Database connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      console.log("✅ [Payment Service] Database disconnected successfully");
    } catch (error) {
      console.error("❌ [Payment Service] Database disconnection failed:", error);
      throw error;
    }
  }

  public async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }
}

export const databaseService = DatabaseService.getInstance();
export default databaseService;
