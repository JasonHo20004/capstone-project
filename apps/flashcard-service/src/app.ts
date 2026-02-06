// =============================================================================
// Flashcard Service - Express App Configuration
// =============================================================================

import express, { Express } from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";

// Import routes
import flashcardRouter from "./modules/flashcards/routes/flashcard.route.js";

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
    service: "flashcard-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/decks", flashcardRouter);

// Error handling
app.use(errorHandler);

export default app;
