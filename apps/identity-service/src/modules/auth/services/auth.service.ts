// =============================================================================
// Auth Service - Business logic for authentication
// =============================================================================

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { AuthRepository } from "../repositories/auth.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { RedisService } from "../../../services/redis.service.js";
import type { LoginResponse, TokenPair, RegisterInput } from "../dtos/auth.dto.js";
import type { UserRole } from "../../../../generated/prisma/index.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  EventBusService,
  EventNames,
  type EmailVerificationRequestedEvent,
  type PasswordResetRequestedEvent,
} from "@capstone/common";

const EMAIL_VERIFICATION_TTL_MINUTES = 15;
const RESEND_VERIFICATION_COOLDOWN_SECONDS = 60;
const PASSWORD_RESET_TTL_MINUTES = 30;
const PASSWORD_RESET_COOLDOWN_SECONDS = 60;

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly eventBus: EventBusService
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
    const ttlSeconds = EMAIL_VERIFICATION_TTL_MINUTES * 60;

    await client.set(key, userId, { EX: ttlSeconds });
    return token;
  }

  private buildVerificationUrl(token: string, email: string): string {
    const baseUrl =
      process.env.EMAIL_VERIFICATION_BASE_URL ||
      `${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}/auth/verify`;
    const params = new URLSearchParams({ token, email });
    return `${baseUrl}?${params.toString()}`;
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
    const verificationUrl = this.buildVerificationUrl(token, user.email);

    const payload: EmailVerificationRequestedEvent = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      verificationUrl,
      expiresInMinutes: EMAIL_VERIFICATION_TTL_MINUTES,
    };

    // Fire-and-forget: queue the email so SMTP failures don't block the caller.
    await this.eventBus.publish(EventNames.EMAIL_VERIFICATION_REQUESTED, payload);
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

    // Block login for users who have been moderated.
    // Auto-restore expired suspensions so admins don't have to flip them back.
    if (user.userStatus === "SUSPENDED") {
      const now = new Date();
      if (user.suspendedUntil && user.suspendedUntil <= now) {
        await this.userRepository.update(user.id, {
          userStatus: "ACTIVE",
          suspendedUntil: null,
        });
      } else {
        const until = user.suspendedUntil
          ? ` đến ${user.suspendedUntil.toLocaleString("vi-VN")}`
          : "";
        throw new UnauthorizedError(
          `Tài khoản đang bị tạm khoá${until}. Lý do: ${user.statusReason ?? "Không có"}`,
        );
      }
    }
    if (user.userStatus === "BANNED") {
      throw new UnauthorizedError(
        `Tài khoản đã bị khoá vĩnh viễn. Lý do: ${user.statusReason ?? "Không có"}`,
      );
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

  async verifyEmail(token: string): Promise<LoginResponse> {
    const userId = await this.verifyEmailToken(token);

    if (!userId) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    await this.userRepository.updateEmailVerified(userId, true);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
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

  /**
   * Resend the verification email by user-supplied email address.
   * - Rate-limited per email via Redis cooldown.
   * - Returns silently for unknown / already-verified emails to avoid
   *   leaking which emails are registered.
   */
  async resendVerificationByEmail(email: string): Promise<void> {
    const client = this.redisService.getClient();
    const cooldownKey = `resend:cooldown:${email.toLowerCase()}`;

    const ttl = await client.ttl(cooldownKey);
    if (ttl > 0) {
      throw new TooManyRequestsError(
        `Please wait ${ttl} seconds before requesting another verification email.`,
        ttl
      );
    }

    // Set cooldown BEFORE looking up the user — defends against timing attacks
    // and ensures we throttle even when the email doesn't exist.
    await client.set(cooldownKey, "1", { EX: RESEND_VERIFICATION_COOLDOWN_SECONDS });

    const user = await this.userRepository.findByEmail(email);
    if (!user || user.isEmailVerified) {
      return; // silent — don't leak account existence
    }

    await this.sendVerificationEmail(user.id);
  }

  private buildPasswordResetUrl(token: string, email: string): string {
    const baseUrl =
      process.env.PASSWORD_RESET_BASE_URL ||
      `${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}/reset-password`;
    const params = new URLSearchParams({ token, email });
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Start a "forgot password" flow.
   * - Rate-limited per email via Redis cooldown (set BEFORE the user lookup so
   *   we throttle and avoid leaking which emails are registered).
   * - Returns silently for unknown emails — the caller always reports success.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const client = this.redisService.getClient();
    const cooldownKey = `reset:cooldown:${email.toLowerCase()}`;

    const ttl = await client.ttl(cooldownKey);
    if (ttl > 0) {
      throw new TooManyRequestsError(
        `Please wait ${ttl} seconds before requesting another password reset email.`,
        ttl
      );
    }
    await client.set(cooldownKey, "1", { EX: PASSWORD_RESET_COOLDOWN_SECONDS });

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return; // silent — don't leak account existence
    }

    const token = randomBytes(32).toString("hex");
    const key = `reset:${token}`;
    await client.set(key, user.id, { EX: PASSWORD_RESET_TTL_MINUTES * 60 });

    const resetUrl = this.buildPasswordResetUrl(token, user.email);
    const payload: PasswordResetRequestedEvent = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      resetUrl,
      expiresInMinutes: PASSWORD_RESET_TTL_MINUTES,
    };

    // Fire-and-forget: queue the email so SMTP failures don't block the caller.
    await this.eventBus.publish(EventNames.PASSWORD_RESET_REQUESTED, payload);
  }

  /**
   * Complete a "forgot password" flow.
   * - Validates the single-use Redis token.
   * - Hashes & stores the new password, then revokes all sessions so any
   *   stolen-credential session is killed.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const client = this.redisService.getClient();
    const key = `reset:${token}`;
    const userId = await client.get(key);

    if (!userId) {
      throw new BadRequestError("Invalid or expired password reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    // Burn the single-use token and invalidate existing refresh tokens.
    await client.del(key);
    await this.authRepository.deleteAllRefreshTokensForUser(userId);
  }
}
