// =============================================================================
// Auth Controller - HTTP handlers for authentication endpoints
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler, EventBusService } from "@capstone/common";

import { AuthRepository } from "../repositories/auth.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { redisService } from "../../../services/index.js";
import { SERVICE_NAME } from "../../../constants.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(
      new AuthRepository(),
      new UserRepository(),
      redisService,
      EventBusService.getInstance(SERVICE_NAME)
    );
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        userId: result.userId,
        email: result.email,
        fullName: result.fullName,
        role: result.role,
      },
    });
  });

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    
    res.status(201).json({
      success: true,
      data: result,
      message: "Registration successful. Please check your email to verify your account.",
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!refreshToken) {
      res.status(401).json({ success: false, error: "Refresh token required" });
      return;
    }

    const tokens = await this.authService.refreshUserToken(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };
    const result = await this.authService.verifyEmail(token);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        accessToken: result.accessToken,
        userId: result.userId,
        email: result.email,
        fullName: result.fullName,
        role: result.role,
      },
    });
  });

  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    await this.authService.resendVerificationByEmail(email);

    // Always return the same success message, regardless of whether the email
    // exists — avoids leaking account existence.
    res.json({
      success: true,
      message: "If an unverified account exists for this email, a new verification link has been sent.",
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    await this.authService.requestPasswordReset(email);

    // Same response whether or not the email exists — avoids leaking accounts.
    res.json({
      success: true,
      message: "If an account exists for this email, a password reset link has been sent.",
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body as { token: string; password: string };
    await this.authService.resetPassword(token, password);

    res.json({
      success: true,
      message: "Password has been reset. You can now log in with your new password.",
    });
  });
}
