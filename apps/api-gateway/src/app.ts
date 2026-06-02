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

// CORS configuration — origins are environment-driven.
// FRONTEND_URL: single primary origin. CORS_ORIGINS: optional comma-separated list
// for additional environments (staging, preview deploys, etc.).
const corsOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  process.env.FRONTEND_URL || "",
  ...(process.env.CORS_ORIGINS?.split(",").map((s) => s.trim()) ?? []),
].filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
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
    // RAG service needs longer timeout for LLM calls (5 min). assessment-service
    // also needs it: POST /api/dictation/transcribe runs CPU Whisper via rag and
    // can take several minutes for a few-minute audio clip (10 min ceiling).
    ...(service.name === "rag-service" && { proxyTimeout: 600000, timeout: 600000 }),
    ...(service.name === "assessment-service" && { proxyTimeout: 600000, timeout: 600000 }),
    on: {
      proxyReq: (proxyReq, req, _res) => {
        console.log(`➡️ [Gateway] ${req.method} ${req.url} -> ${service.url}${proxyReq.path} (${service.name})`);
      },
      proxyRes: (proxyRes, req, _res) => {
        console.log(`⬅️ [Gateway] ${proxyRes.statusCode} ${req.method} ${req.url}`);
        // Disable buffering for SSE streams so tokens flow through immediately
        if (proxyRes.headers["content-type"]?.includes("text/event-stream")) {
          console.log(`🔄 [Gateway] SSE stream detected for ${req.url}`);
          (proxyRes as any).headers["cache-control"] = "no-cache";
          (proxyRes as any).headers["x-accel-buffering"] = "no";
        }
      },
      error: (err, req, res) => {
        console.error(`❌ [Gateway] Proxy error for ${req.url}:`, err.message);
        if (!res || !("writeHead" in res)) return;
        const r = res as any;
        // If headers were already flushed (e.g. SSE stream), we can no longer
        // write a 503 — just end the socket so the client sees the drop.
        if (r.headersSent || r.writableEnded) {
          try {
            r.end();
          } catch {
            /* ignore */
          }
          return;
        }
        try {
          r.writeHead(503, { "Content-Type": "application/json" });
          r.end(
            JSON.stringify({
              success: false,
              error: `Service ${service.name} unavailable`,
            })
          );
        } catch (e) {
          console.error(`❌ [Gateway] Failed to write error response:`, e);
        }
      },
    },
  };

  app.use(createProxyMiddleware(proxyOptions));
}

// Livestream (rag-service) — dedicated proxy with WebSocket support. The generic
// loop above only proxies HTTP; the live classroom also needs the WS upgrade at
// /api/livestream/rooms/{id}/ws. This middleware handles both HTTP and WS; its
// `.upgrade` handler is wired to the raw HTTP server in server.ts.
const RAG_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";
export const livestreamProxy = createProxyMiddleware({
  target: RAG_URL,
  changeOrigin: true,
  ws: true,
  pathFilter: "/api/livestream",
  proxyTimeout: 300000,
  timeout: 300000,
  on: {
    error: (err, _req, res) => {
      console.error(`❌ [Gateway] Livestream proxy error:`, err.message);
      const r = res as any;
      if (!r || !("writeHead" in r) || r.headersSent || r.writableEnded) {
        try { r?.end?.(); } catch { /* ignore */ }
        return;
      }
      try {
        r.writeHead(503, { "Content-Type": "application/json" });
        r.end(JSON.stringify({ success: false, error: "Service rag-service unavailable" }));
      } catch { /* ignore */ }
    },
  },
});
app.use(livestreamProxy);

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
