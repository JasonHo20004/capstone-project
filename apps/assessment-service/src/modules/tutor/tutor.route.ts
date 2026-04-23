import { Router } from "express";
import { tutorController } from "./tutor.controller.js";

const router = Router();

// GET /tutor/sessions?practiceSessionId=xxx
router.get("/sessions", tutorController.getSessions.bind(tutorController));

// POST /tutor/sessions — get or create session for a question
router.post("/sessions", tutorController.getOrCreateSession.bind(tutorController));

// GET /tutor/sessions/:sessionId — get single session with messages
router.get("/sessions/:sessionId", tutorController.getSession.bind(tutorController));

// POST /tutor/sessions/:sessionId/messages — add message
router.post("/sessions/:sessionId/messages", tutorController.addMessage.bind(tutorController));

export default router;
