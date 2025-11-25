import { Router } from "express";
import { TransactionManagementController } from "../controllers/transaction-management.controller";

const router = Router();
const transactionController = new TransactionManagementController();

// Get all transactions with filters
router.get("/", transactionController.getTransactions);

// Get transaction by ID
router.get("/:id", transactionController.getTransactionById);

// // Get transaction statistics
// router.get("/stats", transactionController.getTransactionStats);

// // Export transactions
// router.get("/export", transactionController.exportTransactions);



export default router;
