import { Router } from "express";
import { sessionController } from "./session.controller.js";

const router: Router = Router();

router.post("/", sessionController.createSession.bind(sessionController));
router.get("/:id", sessionController.getSession.bind(sessionController));
router.post("/:id/submit", sessionController.submitSession.bind(sessionController));

export default router;
