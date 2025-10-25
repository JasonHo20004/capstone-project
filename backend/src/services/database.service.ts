import { PrismaClient } from "../../generated/prisma";

// =============================================================================
// Database Service Singleton
// =============================================================================

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

  /**
   * Get singleton instance of DatabaseService
   * @returns DatabaseService instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Get Prisma client instance
   * @returns PrismaClient instance
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Connect to database
   * @returns Promise<void>
   */
  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  /**
   * Disconnect from database
   * @returns Promise<void>
   */
  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      console.log("✅ Database disconnected successfully");
    } catch (error) {
      console.error("❌ Database disconnection failed:", error);
      throw error;
    }
  }

  /**
   * Execute database transaction
   * @param fn - Transaction function
   * @returns Promise<T> - Transaction result
   */
  public async transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  /**
   * Health check for database connection
   * @returns Promise<boolean> - True if database is healthy
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("❌ Database health check failed:", error);
      return false;
    }
  }

  /**
   * Get database connection info
   * @returns object with connection information
   */
  public getConnectionInfo(): object {
    return {
      connected: this.prisma !== null,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };
  }
}
// Export transaction
export type PrismaTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
// Export singleton instance
export const databaseService = DatabaseService.getInstance();
export default databaseService;
