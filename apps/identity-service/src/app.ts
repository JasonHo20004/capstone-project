// =============================================================================
// Identity Service - Express App Configuration
// =============================================================================

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "@capstone/common";

// Import routes
import authRouter from "./modules/auth/routes/auth.route.js";
import userRouter from "./modules/users/routes/user.route.js";
import sellerRouter from "./modules/seller/routes/seller.route.js";
import adminRouter from "./modules/admin/routes/admin.route.js";
import auditRouter from "./modules/audit/routes/audit.route.js";

const app: express.Application = express();

// Trust proxy for proper IP detection behind reverse proxy
app.set("trust proxy", 1);

// CORS configuration
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

// Body parsing — 5mb limit to support base64 avatar images in profile updates
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Health check
app.get("/health", (_req, res) => {
  res.json({
    service: "identity-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", auditRouter);

// Error handling
app.use(errorHandler);

export default app;

