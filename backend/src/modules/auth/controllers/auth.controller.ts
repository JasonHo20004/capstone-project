import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import type { VerifyEmailInput } from "@/modules/auth/dtos/verify-email.dto";
import { redisService } from "@/services";
import { databaseService } from "@/services";

export class AuthController {
  private authService = new AuthService();

  public loginController = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, userId, fullName, role } = await this.authService.login(email, password);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, user: { userId, email, fullName, role } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public refreshTokenController = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
      }

      const tokens = await this.authService.refreshUserToken(refreshToken);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: false, //true -> https
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.json({ accessToken: tokens.accessToken });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  public logoutController = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
      }
      await this.authService.logout(refreshToken);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "An error occurred" });
    }
  };

  public verifyEmailController = async (
    req: Request<any, any, any, VerifyEmailInput["query"]>,
    res: Response
  ): Promise<void> => {
    try {
      const token = req.query.token;
      if (!token) {
        res.status(400).json({ message: "Verification token is required" });
        return;
      }

      const client = redisService.getClient();
      const key = `verify:${token}`;

      const userId = await client.get(key);
      if (!userId) {
        res.status(400).json({ message: "Invalid or expired verification token" });
        return;
      }

      const prisma = databaseService.getClient();
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(400).json({ message: "Invalid verification token" });
        return;
      }

      if (user.isEmailVerified) {
        await client.del(key);
        res.status(200).json({ message: "Email is already verified" });
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          isEmailVerified: true,
        },
      });

      await client.del(key);

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to verify email" });
    }
  };
}
