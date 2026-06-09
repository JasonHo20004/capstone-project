import { Router } from "express";
import { tutorController } from "./tutor.controller.js";
import { authenticateToken } from "@capstone/common";

const router: Router = Router();

// GET /tutor/sessions?practiceSessionId=xxx
router.get("/sessions", authenticateToken, tutorController.getSessions.bind(tutorController));

// POST /tutor/sessions — get or create session for a question
router.post("/sessions", authenticateToken, tutorController.getOrCreateSession.bind(tutorController));

// GET /tutor/sessions/:sessionId — get single session with messages
router.get("/sessions/:sessionId", authenticateToken, tutorController.getSession.bind(tutorController));

// POST /tutor/sessions/:sessionId/messages — add message
router.post("/sessions/:sessionId/messages", authenticateToken, tutorController.addMessage.bind(tutorController));

export default router;
