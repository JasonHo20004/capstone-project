// =============================================================================
// Auth Repository - Database operations for authentication
// =============================================================================

import { databaseService } from "../../../services/database.service.js";

export class AuthRepository {
  private prisma = databaseService.getClient();

  async createNewRefreshToken(data: { userId: string; hashedToken: string }) {
    return await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        hashedToken: data.hashedToken,
      },
    });
  }

  async findRefreshToken(hashedToken: string) {
    return await this.prisma.refreshToken.findUnique({
      where: { hashedToken },
    });
  }

  async deleteRefreshToken(id: string) {
    return await this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteAllRefreshTokensForUser(userId: string) {
    return await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async revokeRefreshToken(id: string) {
    return await this.prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }
}
