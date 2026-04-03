// =============================================================================
// Notification Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/index.js";
import { initializeEventHandlers, getNotificationEventBus } from "./modules/notifications/handlers/course-approved.handler.js";

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3006;

const startServer = async () => {
  try {
    // Connect to database
    await databaseService.connect();

    // Initialize RabbitMQ Event Bus
    await initializeEventHandlers(databaseService);

    app.listen(PORT, () => {
      console.log(`🚀 Notification Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔔 API base: http://localhost:${PORT}/api/notifications`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down Notification Service...");
      
      // Disconnect Event Bus
      const eventBus = getNotificationEventBus();
      if (eventBus) {
        await eventBus.disconnect();
      }
      
      await databaseService.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Failed to start Notification Service:", error);
    process.exit(1);
  }
};

startServer();
