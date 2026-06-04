// =============================================================================
// Flashcard Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/index.js";

const PORT = process.env.FLASHCARD_SERVICE_PORT || 3004;

const startServer = async () => {
  try {
    // Connect to database
    await databaseService.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Flashcard Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API base: http://localhost:${PORT}/api/decks`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down Flashcard Service...");
      await databaseService.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Failed to start Flashcard Service:", error);
    process.exit(1);
  }
};

startServer();
