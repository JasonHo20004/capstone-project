// =============================================================================
// API Gateway - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.GATEWAY_PORT || 3000;
const SERVICE_NAME = "api-gateway";

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 [${SERVICE_NAME}] API Gateway is running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log("");
      console.log("📌 Service Routes:");
      console.log("   /api/auth/*          -> Identity Service");
      console.log("   /api/users/*         -> Identity Service");
      console.log("   /api/courses/*       -> Course Service");
      console.log("   /api/lessons/*       -> Course Service");
      console.log("   /api/tests/*         -> Assessment Service");
      console.log("   /api/flashcard-*     -> Flashcard Service");
      console.log("   /api/wallet/*        -> Payment Service");
      console.log("   /api/orders/*        -> Payment Service");
      console.log("   /api/notifications/* -> Notification Service");
    });
  } catch (error) {
    console.error(`❌ [${SERVICE_NAME}] Failed to start server:`, error);
    process.exit(1);
  }
}

function shutdown() {
  console.log(`🚧 [${SERVICE_NAME}] Shutting down...`);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
