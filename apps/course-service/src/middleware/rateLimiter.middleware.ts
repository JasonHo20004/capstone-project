import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import type { Request } from "express";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.connect().catch((err) => {
  console.error("[RateLimiter] Redis connection error:", err);
});

const RATE_LIMIT_RESPONSE = {
  success: false,
  message: "Rate limit exceeded. Try again later.",
};

const keyGenerator = (req: Request): string =>
  (req as any).user?.userId ?? req.ip ?? "anonymous";

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "rl:upload:",
  }),
  handler: (_req, res) => {
    res.status(429).json(RATE_LIMIT_RESPONSE);
  },
});

export const createCourseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "rl:create-course:",
  }),
  handler: (_req, res) => {
    res.status(429).json(RATE_LIMIT_RESPONSE);
  },
});
