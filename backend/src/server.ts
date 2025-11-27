import "dotenv/config";
import app from "./app";
import { databaseService, redisService } from "./services";
import { seedNotificationTypes } from "./seed/notificationTypes.seed";

// Load environment variables from .env file (already loaded via side-effect import above)

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();

    // Connect to Redis
    try {
      await redisService.connect();
    } catch (redisError) {
      console.error("Error connecting to Redis:", redisError);
      throw redisError;
    }

    // Run idempotent data seeds
    try {
      await seedNotificationTypes();
    } catch (seedErr) {
      console.warn("Seed step skipped or failed (non-fatal):", seedErr);
    }

    // Start server by listening on the specified port
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(
        `🔗 Health check available at http://localhost:${PORT}/`
      );
      console.log(
        `🔗 Users endpoint available at http://localhost:${PORT}/api/users`
      );
      console.log(
        `🔗 Admin endpoint available at http://localhost:${PORT}/api/admin`
      );
      console.log(
        `🔗 Notifications endpoint available at http://localhost:${PORT}/api/notifications`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown logic
async function shutdown() {
  console.log("\n gracefully shutting down...");
  try {
    await databaseService.disconnect();
  } catch (err) {
    console.error("Error disconnecting database:", err);
  }

  try {
    await redisService.disconnect();
  } catch (err) {
    console.error("Error disconnecting Redis:", err);
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the server
startServer();