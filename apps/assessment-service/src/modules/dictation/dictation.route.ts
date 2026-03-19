// =============================================================================
// Dictation Routes
// =============================================================================

import { Router } from "express";
import multer from "multer";
import { dictationController } from "./dictation.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

// Public — list & detail
router.get("/", dictationController.listExercises.bind(dictationController));
router.get("/categories", dictationController.getCategories.bind(dictationController));
router.get("/:id", dictationController.getExerciseById.bind(dictationController));

// Student — sessions
router.post("/:id/start", dictationController.startSession.bind(dictationController));
router.put("/sessions/:sessionId", dictationController.updateSession.bind(dictationController));
router.post("/sessions/:sessionId/complete", dictationController.completeSession.bind(dictationController));
router.get("/sessions/user/:userId", dictationController.getUserSessions.bind(dictationController));

// Admin — create, update, delete & upload
router.post("/", dictationController.createExercise.bind(dictationController));
router.put("/:id", dictationController.updateExercise.bind(dictationController));
router.delete("/:id", dictationController.deleteExercise.bind(dictationController));
router.post("/upload-audio", upload.single("audio"), dictationController.uploadAudio.bind(dictationController));

export default router;
