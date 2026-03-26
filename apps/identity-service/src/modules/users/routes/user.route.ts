// =============================================================================
// User Routes - Express routes for user operations
// =============================================================================

import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticateToken, requireAdmin, validate } from "@capstone/common";
import { updateUserSchema, getUsersQuerySchema } from "../dtos/user.dto.js";

const router: Router = Router();
const userController = new UserController();

// Protected routes
router.get("/profile", authenticateToken, userController.getProfile);
router.patch("/profile", authenticateToken, validate(updateUserSchema), userController.updateProfile);

// Internal API for other services
router.post("/internal/batch", userController.getBasicInfoBatch);
router.get("/internal/:id", userController.getBasicInfo);

// Admin routes
router.get("/", authenticateToken, requireAdmin, validate(getUsersQuerySchema), userController.getMany);
router.get("/:id", authenticateToken, requireAdmin, userController.getById);
router.delete("/:id", authenticateToken, requireAdmin, userController.deleteUser);

export default router;
