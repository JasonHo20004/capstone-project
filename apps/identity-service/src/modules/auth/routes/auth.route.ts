// =============================================================================
// Auth Routes - Express routes for authentication
// =============================================================================

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "@capstone/common";
import { loginSchema, registerSchema, verifyEmailSchema, refreshTokenSchema } from "../dtos/auth.dto.js";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/verify", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

export default router;
