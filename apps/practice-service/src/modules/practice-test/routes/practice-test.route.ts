import { Router } from "express";
import { practiceTestController } from "../controllers/practice-test.controller.js";

const router = Router();

router.post("/", practiceTestController.createPracticeTest.bind(practiceTestController));
router.get("/", practiceTestController.getTestsSummary.bind(practiceTestController));
router.get("/:id", practiceTestController.getTestDetail.bind(practiceTestController));

// Submission endpoint will go here once the Strategy Pattern is implemented
router.post("/:id/submit", practiceTestController.submitTest.bind(practiceTestController));

export default router;
