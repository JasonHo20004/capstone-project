// =============================================================================
// AI Evaluation Service - Express App Configuration
// =============================================================================

import express, { Express } from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";
import transcriptionRouter from "./modules/transcription/transcription.route.js";
import writingRouter from "./modules/writing-evaluation/writing.route.js";
import speakingRouter from "./modules/speaking-evaluation/speaking.route.js";
import assistantRouter from "./modules/writing-assistant/assistant.route.js";
import skillTreeRouter from "./modules/skill-tree/skill-tree.route.js";
import learningPathRouter from "./modules/learning-path/learning-path.route.js";
import dictationRouter from "./modules/dictation/dictation.route.js";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({
    service: "ai-evaluation-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/ai/transcribe", transcriptionRouter);
app.use("/api/ai/assessments/writing", writingRouter);
app.use("/api/ai/assessments/speaking", speakingRouter);
app.use("/api/ai/writing-assistant", assistantRouter);
app.use("/api/ai/skill-tree", skillTreeRouter);
app.use("/api/ai/learning-path", learningPathRouter);
app.use("/api/ai/dictation", dictationRouter);

// Error handling
app.use(errorHandler);

export default app;

