// =============================================================================
// AI Evaluation Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";
import { redisService } from "./services/redis.service.js";
import { createWritingWorker } from "./queue/workers/writing.worker.js";
import { createSpeakingWorker } from "./queue/workers/speaking.worker.js";
import { schedulerService } from "./modules/advisor/scheduler.service.js";

const PORT = process.env.AI_EVALUATION_SERVICE_PORT || 3007;

const startServer = async () => {
  try {
    await databaseService.connect();
    await redisService.connect();

    const writingWorker = createWritingWorker();
    const speakingWorker = createSpeakingWorker();
    console.log("✅ [AI Evaluation Service] BullMQ workers started");

    app.listen(PORT, () => {
      console.log(`🚀 AI Evaluation Service running on port ${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/health`);
      console.log(`🤖 AI Advisor SSE: http://localhost:${PORT}/api/ai/advisor/stream`);

      // Start proactive scheduler after server is ready
      schedulerService.start();
    });

    const shutdown = async () => {
      console.log("\n🛑 Shutting down gracefully...");
      schedulerService.stop();
      await writingWorker.close();
      await speakingWorker.close();
      await redisService.disconnect();
      await databaseService.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start AI Evaluation Service:", error);
    process.exit(1);
  }
};

startServer();
