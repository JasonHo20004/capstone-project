// =============================================================================
// Course Routes - Express routes for course operations
// =============================================================================

import { Router } from "express";
import { CourseController } from "../controllers/course.controller.js";
import { authenticateToken, requireSeller, optionalAuth, validate } from "@capstone/common";
import { createCourseSchema, updateCourseSchema, getCoursesQuerySchema } from "../dtos/course.dto.js";

const router = Router();
const courseController = new CourseController();

// Public routes
router.get("/published", optionalAuth, validate(getCoursesQuerySchema), courseController.getPublished);
router.get("/:id", optionalAuth, courseController.getById);

// Seller routes - must be before /:id to avoid "seller" matching as id
router.get("/seller/my-courses", authenticateToken, requireSeller, courseController.getMyCourses);
router.get("/seller/me", authenticateToken, requireSeller, courseController.getMyCourses);
router.get("/seller/:sellerId", optionalAuth, validate(getCoursesQuerySchema), courseController.getBySellerId);
router.post("/", authenticateToken, requireSeller, validate(createCourseSchema), courseController.create);
router.patch("/:id", authenticateToken, requireSeller, validate(updateCourseSchema), courseController.update);
router.post("/:id/publish", authenticateToken, requireSeller, courseController.publish);
router.delete("/:id", authenticateToken, requireSeller, courseController.delete);

// Admin routes
router.get("/", authenticateToken, validate(getCoursesQuerySchema), courseController.getMany);

export default router;
