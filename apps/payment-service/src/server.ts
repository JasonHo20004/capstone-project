// =============================================================================
// Payment Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";
import { EventBusService } from "@capstone/common";
import { SERVICE_NAME } from "./constants.js";
import { CommissionService } from "./modules/commission/services/commission.service.js";

const PORT = process.env.PAYMENT_SERVICE_PORT || 3005;
const EARNINGS_RELEASE_INTERVAL_MS = Number(
  process.env.EARNINGS_RELEASE_INTERVAL_MS ?? 60 * 60 * 1000
); // default: 1 hour

let eventBus: EventBusService;
let earningsReleaseTimer: NodeJS.Timeout | null = null;

function startEarningsReleaseCron() {
  const commissionService = new CommissionService();

  const tick = async () => {
    try {
      const result = await commissionService.releaseMaturedEarnings();
      if (result.released > 0) {
        console.log(
          `💰 [${SERVICE_NAME}] Released ${result.released} matured earnings ` +
            `totalling ${result.totalAmount}đ for ${result.sellers ?? 0} sellers`
        );
      }
    } catch (err) {
      console.error(`⚠️ [${SERVICE_NAME}] releaseMaturedEarnings failed:`, err);
    }
  };

  // Fire once on startup, then on interval.
  void tick();
  earningsReleaseTimer = setInterval(tick, EARNINGS_RELEASE_INTERVAL_MS);
  console.log(
    `⏰ [${SERVICE_NAME}] Earnings release cron scheduled every ` +
      `${EARNINGS_RELEASE_INTERVAL_MS / 60000} minutes`
  );
}

async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();

    // Initialize Event Bus
    eventBus = EventBusService.getInstance(SERVICE_NAME);
    await eventBus.connect();

    // Background jobs
    startEarningsReleaseCron();

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

  if (earningsReleaseTimer) {
    clearInterval(earningsReleaseTimer);
    earningsReleaseTimer = null;
  }

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
