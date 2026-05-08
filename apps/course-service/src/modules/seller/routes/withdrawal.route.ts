import { Router } from "express";
import { WithdrawalController } from "../controllers/withdrawal.controller.js";
import { authenticateToken, requireSeller } from "@capstone/common";

const router: Router = Router();
const controller = new WithdrawalController();

router.post("/", authenticateToken, requireSeller, controller.requestWithdrawal);

export default router;
