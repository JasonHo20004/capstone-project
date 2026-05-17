// =============================================================================
// Identity Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService, redisService } from "./services/index.js";
import { EventBusService, EventNames } from "@capstone/common";
import { SERVICE_NAME } from "./constants.js";

const PORT = process.env.IDENTITY_SERVICE_PORT || 3001;

let eventBus: EventBusService;

async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();

    // Connect to Redis
    await redisService.connect();

    // Initialize Event Bus
    eventBus = EventBusService.getInstance(SERVICE_NAME);
    await eventBus.connect();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 [${SERVICE_NAME}] Server is running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`🔗 Users API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error(`❌ [${SERVICE_NAME}] Failed to start server:`, error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log(`🚧 [${SERVICE_NAME}] Shutting down...`);
  
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

  try {
    if (eventBus) {
      await eventBus.disconnect();
    }
  } catch (err) {
    console.error("Error disconnecting Event Bus:", err);
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
