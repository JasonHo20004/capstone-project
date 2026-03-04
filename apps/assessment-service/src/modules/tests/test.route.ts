import { Router } from "express";
import { testController } from "./test.controller.js";

const router = Router();

router.get("/", testController.getAllTests.bind(testController));
router.post("/", testController.createTest.bind(testController));
router.get("/:id", testController.getTestById.bind(testController));

export default router;
