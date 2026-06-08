// =============================================================================
// Assessment Service - Express App Configuration
// =============================================================================

import express, { Express } from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";
import testRouter from "./modules/tests/test.route.js";
import sessionRouter from "./modules/sessions/session.route.js";
import dictationRouter from "./modules/dictation/dictation.route.js";
import commentRouter from "./modules/comments/comment.route.js";
import tutorRouter from "./modules/tutor/tutor.route.js";
import placementRouter from "./modules/placement/placement.route.js";
import questionImportRouter from "./modules/question-import/question-import.route.js";

const app: Express = express();

app.set("trust proxy", 1);

const isDev = process.env.NODE_ENV === "development";
app.use(
  cors({
    origin: (isDev
      ? [
          "http://localhost:8080",
          "http://localhost:5173",
          process.env.FRONTEND_URL || "",
        ]
      : [process.env.FRONTEND_URL || ""]
    ).filter(Boolean),
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
app.use("/api/test-comments", commentRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/placement", placementRouter);
app.use("/api/question-imports", questionImportRouter);

// Error handling
app.use(errorHandler);

export default app;
