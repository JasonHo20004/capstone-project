// =============================================================================
// Auth Service - Business logic for authentication
// =============================================================================

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { AuthRepository } from "../repositories/auth.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { RedisService } from "../../../services/redis.service.js";
import { EmailService } from "../../../services/email.service.js";
import type { LoginResponse, TokenPair, RegisterInput } from "../dtos/auth.dto.js";
import type { UserRole } from "../../../../generated/prisma/index.js";
import { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } from "@capstone/common";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService
  ) {}

  async generateTokens(payload: { userId: string; role: UserRole | null }): Promise<TokenPair> {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("JWT Secret keys are not defined"); // System error, keeping generic Error for now or could be InternalServerError
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  async generateEmailVerificationToken(userId: string): Promise<string> {
    const client = this.redisService.getClient();
    const token = randomBytes(32).toString("hex");
    const key = `verify:${token}`;
    const ttlSeconds = 15 * 60; // 15 minutes

    await client.set(key, userId, { EX: ttlSeconds });
    return token;
  }

  async verifyEmailToken(token: string): Promise<string | null> {
    const client = this.redisService.getClient();
    const key = `verify:${token}`;
    const userId = await client.get(key);
    
    if (userId) {
      await client.del(key);
    }
    
    return userId;
  }

  async sendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isEmailVerified) {
      return;
    }

    const token = await this.generateEmailVerificationToken(user.id);
    const baseUrl = process.env.EMAIL_VERIFICATION_BASE_URL || 
      `${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}/auth/verify`;
    const verificationUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;

    const html = `
      <p>Hello ${user.fullName},</p>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify your email</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `;

    await this.emailService.sendMail({
      to: user.email,
      subject: "Verify your email address",
      html,
    });
  }

  async addRefreshTokenToDatabase(token: string, userId: string) {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    return await this.authRepository.createNewRefreshToken({
      userId,
      hashedToken,
    });
  }

  async register(input: RegisterInput): Promise<{ userId: string }> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      phoneNumber: input.phoneNumber,
    });

    await this.sendVerificationEmail(user.id);
    return { userId: user.id };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError("Email not verified");
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });

    await this.addRefreshTokenToDatabase(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  async refreshUserToken(sentRefreshToken: string): Promise<TokenPair> {
    let payload: { userId: string; role: UserRole };
    
    try {
      payload = jwt.verify(
        sentRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { userId: string; role: UserRole };
    } catch {
      throw new UnauthorizedError("Invalid token");
    }

    const hashedToken = createHash("sha256").update(sentRefreshToken).digest("hex");
    const dbToken = await this.authRepository.findRefreshToken(hashedToken);

    if (!dbToken || dbToken.revoked) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.authRepository.deleteRefreshToken(dbToken.id);
    
    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });

    await this.addRefreshTokenToDatabase(refreshToken, user.id);
    return { accessToken, refreshToken };
  }

  async logout(sentRefreshToken: string): Promise<void> {
    const hashedToken = createHash("sha256").update(sentRefreshToken).digest("hex");
    const dbToken = await this.authRepository.findRefreshToken(hashedToken);
    
    if (dbToken) {
      await this.authRepository.deleteRefreshToken(dbToken.id);
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const userId = await this.verifyEmailToken(token);
    
    if (!userId) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    await this.userRepository.updateEmailVerified(userId, true);
    return true;
  }
}
