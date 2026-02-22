// =============================================================================
// Practice Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";

const PORT = process.env.PRACTICE_SERVICE_PORT || 3008;
const SERVICE_NAME = "practice-service";

async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 [${SERVICE_NAME}] Server is running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
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

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
