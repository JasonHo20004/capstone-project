// =============================================================================
// Auth Controller - HTTP handlers for authentication endpoints
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "@capstone/common";

import { AuthRepository } from "../repositories/auth.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { redisService, emailService } from "../../../services/index.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(
      new AuthRepository(),
      new UserRepository(),
      redisService,
      emailService
    );
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      res.status(401).json({ success: false, error: "Refresh token required" });
      return;
    }

    const tokens = await this.authService.refreshUserToken(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    await this.authService.verifyEmail(token);
    
    res.json({ success: true, message: "Email verified successfully" });
  });

  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;
    await this.authService.sendVerificationEmail(userId);
    
    res.json({ success: true, message: "Verification email sent" });
  });
}
