// =============================================================================
// Payment Service - Express App Configuration
// =============================================================================

import express from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";

// Import routes
import walletRouter from "./modules/wallet/routes/wallet.route.js";
import orderRouter from "./modules/orders/routes/order.route.js";

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
    service: "payment-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/wallet", walletRouter);
app.use("/api/orders", orderRouter);

// Error handling
app.use(errorHandler);

export default app;
