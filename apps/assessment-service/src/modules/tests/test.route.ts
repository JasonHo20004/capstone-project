import { Router } from "express";
import multer from "multer";
import { authenticateToken, optionalAuth } from "@capstone/common";
import { testController } from "./test.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// Internal — called by course-service. Must come BEFORE /:id so the path
// `/internal/...` doesn't get caught by the wildcard.
router.get("/internal/:id", testController.getOwnershipInternal.bind(testController));
router.delete("/internal/:id", testController.deleteTestInternal.bind(testController));
router.post("/internal/:id/course-link", testController.linkCourseInternal.bind(testController));
router.delete("/internal/:id/course-link", testController.unlinkCourseInternal.bind(testController));

// Public reads
router.get("/", optionalAuth, testController.getAllTests.bind(testController));
router.get("/types", testController.getTestTypes.bind(testController));
router.get("/history/:userId", testController.getTestHistory.bind(testController));
router.get("/attempts/:sessionId", testController.getAttemptDetail.bind(testController));
router.get("/:id", optionalAuth, testController.getTestById.bind(testController));

// Authenticated writes — seller (or admin). Ownership enforced in controller.
router.post("/", authenticateToken, testController.createTest.bind(testController));
router.put("/:id", authenticateToken, testController.updateTest.bind(testController));
router.delete("/:id", authenticateToken, testController.deleteTest.bind(testController));

// Authenticated media uploads.
router.post(
  "/upload-audio",
  authenticateToken,
  upload.single("audio"),
  testController.uploadAudio.bind(testController)
);
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
router.post(
  "/upload-image",
  authenticateToken,
  imageUpload.single("image"),
  testController.uploadImage.bind(testController)
);

// Student start session
router.post("/:id/start", testController.startSession.bind(testController));

// Student submit
router.post("/:id/submit", testController.submitTest.bind(testController));

export default router;
