// =============================================================================
// Wallet Routes - Express routes for wallet operations
// =============================================================================

import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { WalletController } from "../controllers/wallet.controller.js";
import { authenticateToken } from "@capstone/common";

const router: ExpressRouter = Router();
const walletController = new WalletController();

router.get("/", authenticateToken, walletController.getWallet);
router.get("/summary", authenticateToken, walletController.getSummary);
router.post("/deposit", authenticateToken, walletController.deposit);
router.get("/transactions", authenticateToken, walletController.getTransactions);

// Internal service-to-service endpoint — no JWT, gated by x-internal-service header convention.
router.post("/internal/by-user-ids", walletController.getWalletsByUserIds);

export default router;
