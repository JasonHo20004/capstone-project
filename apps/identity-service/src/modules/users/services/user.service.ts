// =============================================================================
// User Service - Business logic for user operations
// =============================================================================

import { UserRepository } from "../repositories/user.repository.js";
import type { UpdateUserInput, GetUsersQuery, UserResponse, UserBasicResponse } from "../dtos/user.dto.js";
import { getPaginationMeta } from "@capstone/common";
import type { Prisma } from "../../../../generated/prisma/index.js";

export class UserService {
  private userRepository = new UserRepository();

  async getById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      englishLevel: user.englishLevel,
      learningGoals: user.learningGoals,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }

  async getBasicInfo(id: string): Promise<UserBasicResponse | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      profilePicture: user.profilePicture,
    };
  }

  async update(id: string, data: UpdateUserInput): Promise<UserResponse> {
    const user = await this.userRepository.update(id, data);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      englishLevel: user.englishLevel,
      learningGoals: user.learningGoals,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }

  async getMany(query: GetUsersQuery) {
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        { fullName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.role) {
      where.role = query.role;
    }

    const [users, total] = await Promise.all([
      this.userRepository.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where,
      }),
      this.userRepository.count(where),
    ]);

    return {
      data: users,
      ...getPaginationMeta(total, query.page, query.limit),
    };
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
