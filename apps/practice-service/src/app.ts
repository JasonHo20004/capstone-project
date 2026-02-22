// =============================================================================
// Practice Service - Express App Configuration
// =============================================================================

import express from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";
import practiceRouter from "./modules/practice-test/routes/practice-test.route.js";

const app = express();

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

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({
    service: "practice-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/practice", practiceRouter);

// Error handling - coming from common package
app.use(errorHandler);

export default app;
