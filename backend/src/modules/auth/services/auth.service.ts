import { PrismaClient } from "@/../generated/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { UserRole, RefreshToken } from "@/../generated/prisma";
const prisma = new PrismaClient();
import { createHash } from "crypto";
import { AuthRepository } from "../repositories/auth.repository";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import type { LoginResponse } from "@/modules/auth/dtos/auth.dto";
import { randomBytes } from "crypto";
import { redisService, emailService } from "@/services";
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private authRepository = new AuthRepository();
  private userRepository = new UserRepository();

  public async generateTokens(payload: {
    userId: string;
    role: UserRole | null;
  }): Promise<ITokens> {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("JWT Secret keys not defined in environment variables.");
    }

    const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  /**
   * Generate and store an email verification token in Redis
   * and return the raw token.
   */
  public async generateEmailVerificationToken(
    userId: string
  ): Promise<string> {
    const client = redisService.getClient();

    const token = randomBytes(32).toString("hex");
    const key = `verify:${token}`;

    // 15 minutes TTL
    const ttlSeconds = 15 * 60;

    await client.set(key, userId, {
      EX: ttlSeconds,
    });

    return token;
  }

  public async sendVerificationEmail(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      return;
    }

    const token = await this.generateEmailVerificationToken(user.id);

    const baseUrl =
      process.env.EMAIL_VERIFICATION_BASE_URL ||
      `${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}/auth/verify`;

    const verificationUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;

    const html = `
      <p>Hello ${user.fullName},</p>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify your email</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `;

    await emailService.sendMail({
      to: user.email,
      subject: "Verify your email address",
      html,
    });
  }
  public async addRefreshTokenToDatabase(
    token: string,
    userId: string
  ): Promise<RefreshToken> {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const newRefreshToken = await this.authRepository.createNewRefreshToken({
      userId,
      hashedToken,
    });
    return newRefreshToken;
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new Error("Email address is not verified");
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });
    await this.addRefreshTokenToDatabase(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      userId:user.id,
      email:user.email,
      fullName:user.fullName,
      role:user.role
    };
  }

  public async refreshUserToken(sentRefreshToken: string): Promise<ITokens> {
    let payload;
    try {
      payload = jwt.verify(
        sentRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { userId: string; role: UserRole; iat: number; exp: number };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }

    const hashedToken = createHash("sha256")
      .update(sentRefreshToken)
      .digest("hex");

    const dbToken = await this.authRepository.findRefreshToken(hashedToken)

    if (!dbToken || dbToken.revoked) {
      throw new Error("Refresh token not found or revoked");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    
    await this.authRepository.deleteRefreshToken(dbToken.id);
    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });
    await this.addRefreshTokenToDatabase(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  public async logout(sentRefreshToken: string): Promise<void> {
    const hashedToken = createHash("sha256")
      .update(sentRefreshToken)
      .digest("hex");
    await prisma.refreshToken.deleteMany({
      where: { hashedToken },
    });
  }
}

