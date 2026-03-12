// =============================================================================
// Wallet Routes - Express routes for wallet operations
// =============================================================================

import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller.js";
import { authenticateToken } from "@capstone/common";

const router = Router();
const walletController = new WalletController();

router.get("/", authenticateToken, walletController.getWallet);
router.get("/summary", authenticateToken, walletController.getSummary);
router.post("/deposit", authenticateToken, walletController.deposit);
router.get("/transactions", authenticateToken, walletController.getTransactions);

export default router;
