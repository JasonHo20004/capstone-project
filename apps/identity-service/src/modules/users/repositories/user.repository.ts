// =============================================================================
// User Repository - Database operations for users
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type { Prisma } from "../../../../generated/prisma/index.js";

export class UserRepository {
  private prisma = databaseService.getClient();

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        courseSellerProfile: true,
        administratorProfile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    password: string;
    fullName: string;
    dateOfBirth: Date;
    phoneNumber?: string;
  }) {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        learningGoals: [],
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateEmailVerified(id: string, isVerified: boolean) {
    return await this.prisma.user.update({
      where: { id },
      data: { isEmailVerified: isVerified },
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findMany(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
  }) {
    return await this.prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        isEmailVerified: true,
      },
    });
  }

  async count(where?: Prisma.UserWhereInput) {
    return await this.prisma.user.count({ where });
  }
}
