import express from "express";
import type { Express } from "express";
import cors from "cors";
import { errorHandler } from "@capstone/common";

import walletRouter from "./modules/wallet/routes/wallet.route.js";
import orderRouter from "./modules/orders/routes/order.route.js";
import topupRouter from "./modules/topup/routes/topup.route.js";
import cartRouter from "./modules/carts/routes/cart.route.js";
import subscriptionRouter from "./modules/subscription/routes/user-subscription.route.js";
import commissionRouter from "./modules/commission/routes/commission.routes.js";
import withdrawalRouter from "./modules/withdrawal/routes/withdrawal.routes.js";

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

app.post(
  "/api/topup-orders/webhook",
  express.raw({ type: "application/json" }),
  (_req, _res, next) => next()
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "payment-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/wallet", walletRouter);
app.use("/api/orders", orderRouter);
app.use("/api/topup-orders", topupRouter);
app.use("/api/carts", cartRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/commission", commissionRouter);
app.use("/api/withdrawals", withdrawalRouter);

app.use(errorHandler);

export default app;
