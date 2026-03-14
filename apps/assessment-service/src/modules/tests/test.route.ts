import { Router } from "express";
import multer from "multer";
import { testController } from "./test.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// Public
router.get("/", testController.getAllTests.bind(testController));
router.get("/types", testController.getTestTypes.bind(testController));
router.get("/:id", testController.getTestById.bind(testController));

// Admin CRUD
router.post("/", testController.createTest.bind(testController));
router.put("/:id", testController.updateTest.bind(testController));
router.delete("/:id", testController.deleteTest.bind(testController));

// Audio upload for Listening tests
router.post("/upload-audio", upload.single("audio"), testController.uploadAudio.bind(testController));

// Image upload for sections/questions (maps, diagrams)
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
router.post("/upload-image", imageUpload.single("image"), testController.uploadImage.bind(testController));

// Student submit
router.post("/:id/submit", testController.submitTest.bind(testController));

export default router;
