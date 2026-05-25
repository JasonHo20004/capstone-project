// =============================================================================
// Question Import Routes
// =============================================================================
// POST /api/question-imports/parse — stateless, returns parsed questions.

import { Router } from "express";
import multer from "multer";
import { authenticateToken, requireSeller } from "@capstone/common";
import { questionImportController } from "./question-import.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

router.post(
  "/parse",
  authenticateToken,
  requireSeller,
  upload.single("file"),
  questionImportController.parseFile.bind(questionImportController)
);

export default router;
