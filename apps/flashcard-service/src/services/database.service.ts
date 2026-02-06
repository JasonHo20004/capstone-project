// =============================================================================
// Flashcard Service - Database Service (Prisma Singleton)
// =============================================================================

import { PrismaClient } from "../../generated/prisma/index.js";

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
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
    await this.prisma.$connect();
    console.log("✅ [Flashcard Service] Database connected");
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log("📴 [Flashcard Service] Database disconnected");
  }
}

export const databaseService = DatabaseService.getInstance();
export default databaseService;
