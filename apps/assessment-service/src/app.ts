// =============================================================================
// Assessment Service - Express App Configuration
// =============================================================================

import express, { Express } from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";
import testRouter from "./modules/tests/test.route.js";
import sessionRouter from "./modules/sessions/session.route.js";
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

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({
    service: "assessment-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/tests", testRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/dictation", dictationRouter);

// Error handling
app.use(errorHandler);

export default app;
