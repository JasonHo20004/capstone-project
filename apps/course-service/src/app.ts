// =============================================================================
// Course Service - Express App Configuration
// =============================================================================

import express from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";

// Import routes
import courseRouter from "./modules/courses/routes/course.route.js";
import sellerStatsRouter from "./modules/seller/routes/seller-stats.route.js";
import studentRouter from "./modules/student/routes/student.route.js";
import adminCourseRouter from "./modules/admin/routes/admin-course.route.js";

const app: express.Express = express();

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
    service: "course-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/courses", courseRouter);
app.use("/api/seller", sellerStatsRouter);
app.use("/api/student", studentRouter);
app.use("/api/admin", adminCourseRouter);

// Error handling
app.use(errorHandler);

export default app;

