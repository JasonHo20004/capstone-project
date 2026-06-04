import { Router } from "express";
import { placementController } from "./placement.controller.js";

const router: Router = Router();

router.get("/exam/generate", placementController.generate.bind(placementController));
router.post("/exam/submit", placementController.submit.bind(placementController));
router.get("/exam/result/:session_id", placementController.result.bind(placementController));
router.get("/latest", placementController.latest.bind(placementController));

export default router;
