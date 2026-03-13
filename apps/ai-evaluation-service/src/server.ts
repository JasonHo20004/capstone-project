// =============================================================================
// AI Evaluation Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";
import { redisService } from "./services/redis.service.js";
import { createWritingWorker } from "./queue/workers/writing.worker.js";
import { createSpeakingWorker } from "./queue/workers/speaking.worker.js";

const PORT = process.env.AI_EVALUATION_SERVICE_PORT || 3007;

const startServer = async () => {
  try {
    // Connect to database
    await databaseService.connect();

    // Connect to Redis
    await redisService.connect();

    // Start BullMQ workers
    const writingWorker = createWritingWorker();
    const speakingWorker = createSpeakingWorker();
    console.log("✅ [AI Evaluation Service] BullMQ workers started");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 AI Evaluation Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 Writing API: http://localhost:${PORT}/api/ai/assessments/writing`);
      console.log(`🎙️ Speaking API: http://localhost:${PORT}/api/ai/assessments/speaking`);
      console.log(`🔊 Transcribe API: http://localhost:${PORT}/api/ai/transcribe`);
      console.log(`✍️ Writing Assistant: http://localhost:${PORT}/api/ai/writing-assistant`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down gracefully...");
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
