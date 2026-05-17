// =============================================================================
// Payment Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";
import { EventBusService } from "@capstone/common";
import { SERVICE_NAME } from "./constants.js";

const PORT = process.env.PAYMENT_SERVICE_PORT || 3005;

let eventBus: EventBusService;

async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();

    // Initialize Event Bus
    eventBus = EventBusService.getInstance(SERVICE_NAME);
    await eventBus.connect();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 [${SERVICE_NAME}] Server is running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Wallet API: http://localhost:${PORT}/api/wallet`);
      console.log(`🔗 Orders API: http://localhost:${PORT}/api/orders`);
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
