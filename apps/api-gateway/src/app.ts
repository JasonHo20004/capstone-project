// =============================================================================
// API Gateway - Express App Configuration
// =============================================================================

import express from "express";
import cors from "cors";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { services } from "./config/services.js";
import { errorHandler } from "@capstone/common";

const app: express.Express = express();

// Trust proxy
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

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: services.map((s) => ({
      name: s.name,
      prefix: s.prefix,
      url: s.url,
    })),
  });
});

// Rate limiting could be added here
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Setup proxy for each service
for (const service of services) {
  const proxyOptions: Options = {
    target: service.url,
    changeOrigin: true,
    pathFilter: service.pathFilter ?? service.prefix,
    cookieDomainRewrite: "",
    cookiePathRewrite: "/",
    on: {
      proxyReq: (proxyReq, req, _res) => {
        console.log(`➡️ [Gateway] ${req.method} ${req.url} -> ${service.url}${proxyReq.path} (${service.name})`);
      },
      proxyRes: (proxyRes, req, _res) => {
        console.log(`⬅️ [Gateway] ${proxyRes.statusCode} ${req.method} ${req.url}`);
      },
      error: (err, req, res) => {
        console.error(`❌ [Gateway] Proxy error for ${req.url}:`, err.message);
        if (res && "writeHead" in res) {
          (res as any).writeHead(503, { "Content-Type": "application/json" });
          (res as any).end(
            JSON.stringify({
              success: false,
              error: `Service ${service.name} unavailable`,
            })
          );
        }
      },
    },
  };

  app.use(createProxyMiddleware(proxyOptions));
}

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handling
app.use(errorHandler);

export default app;
