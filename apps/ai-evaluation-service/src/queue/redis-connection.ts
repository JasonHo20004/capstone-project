import type { ConnectionOptions } from "bullmq";

export function getBullMQConnection(): ConnectionOptions {
  const redisHost = process.env.REDIS_HOST || "localhost";

  if (redisHost.startsWith("redis://") || redisHost.startsWith("rediss://")) {
    const url = new URL(redisHost);
    return {
      host: url.hostname,
      port: parseInt(url.port || "6379"),
      username: url.username || undefined,
      password: url.password ? decodeURIComponent(url.password) : undefined,
      tls: redisHost.startsWith("rediss://") ? {} : undefined,
      maxRetriesPerRequest: null,
    };
  }

  return {
    host: redisHost,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    maxRetriesPerRequest: null,
  };
}
