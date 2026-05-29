// =============================================================================
// API Gateway - Server Entry Point
// =============================================================================

import "dotenv/config";
import http from "http";
import app, { livestreamProxy } from "./app.js";
import { SERVICE_NAME } from "./constants.js";

const PORT = process.env.GATEWAY_PORT || 3000;

async function startServer() {
  try {
    // Use an explicit HTTP server so we can handle WebSocket `upgrade` events
    // (Express's app.listen hides the server object). Livestream WS connections
    // (/api/livestream/rooms/{id}/ws) are forwarded to rag-service.
    const server = http.createServer(app);
    server.on("upgrade", (livestreamProxy as unknown as {
      upgrade: (req: unknown, socket: unknown, head: unknown) => void;
    }).upgrade);

    server.listen(PORT, () => {
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
      console.log("   /api/livestream/*    -> RAG Service (HTTP + WebSocket)");
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
