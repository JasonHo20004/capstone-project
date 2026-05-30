// =============================================================================
// Auth Routes - Express routes for authentication
// =============================================================================

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "@capstone/common";
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../dtos/auth.dto.js";

const router: Router = Router();
const authController = new AuthController();

// Public routes
router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/verify", validate(verifyEmailSchema), authController.verifyEmail);
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  authController.resendVerification
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
