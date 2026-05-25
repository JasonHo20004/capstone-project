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
      courseSellerApplication: user.courseSellerApplication
        ? {
            id: user.courseSellerApplication.id,
            status: user.courseSellerApplication.status,
            certification: user.courseSellerApplication.certification,
            expertise: user.courseSellerApplication.expertise,
            message: user.courseSellerApplication.message,
            rejectionReason: user.courseSellerApplication.rejectionReason,
            createdAt: user.courseSellerApplication.createdAt,
          }
        : null,
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

  /**
   * Check seller active status. Returns:
   *   - hasProfile: true if user has a CourseSellerProfile row
   *   - active:     true if profile exists AND CourseSellerProfile.isActive
   * Used by other services to block actions from banned/inactive sellers.
   */
  async getSellerStatus(id: string): Promise<{ hasProfile: boolean; active: boolean }> {
    const user = await this.userRepository.findById(id);
    if (!user) return { hasProfile: false, active: false };

    const profile = user.courseSellerProfile;
    if (!profile) return { hasProfile: false, active: false };

    return { hasProfile: true, active: profile.isActive };
  }

  async getBasicInfoBatch(ids: string[]): Promise<UserBasicResponse[]> {
    if (!ids.length) return [];
    const users = await this.userRepository.findMany({
      where: { id: { in: ids } },
    });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      profilePicture: u.profilePicture,
    }));
  }

  /**
   * Internal cross-service search by fullName / email substring.
   * Used by course-service to filter a seller's learner list by learner identity.
   */
  async searchBasic(query: string, limit: number = 500): Promise<UserBasicResponse[]> {
    const q = query.trim();
    if (!q) return [];
    const where: Prisma.UserWhereInput = {
      OR: [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    };
    const users = await this.userRepository.findMany({ where, take: limit });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      profilePicture: u.profilePicture,
    }));
  }

  async update(id: string, data: UpdateUserInput): Promise<UserResponse> {
    const { dateOfBirth, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    if (dateOfBirth) {
      updateData.dateOfBirth = new Date(dateOfBirth);
    }
    const user = await this.userRepository.update(id, updateData as any);

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

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers,
      totalSellers,
      totalAdmins,
      newUsersThisMonth,
      newUsersLastMonth,
      pendingApplications,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ role: "COURSESELLER" as any }),
      this.userRepository.count({ role: "ADMINISTRATOR" as any }),
      this.userRepository.count({ createdAt: { gte: startOfMonth } }),
      this.userRepository.count({
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      }),
      this.userRepository.countPendingApplications(),
    ]);

    const userGrowthPercent =
      newUsersLastMonth > 0
        ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
        : newUsersThisMonth > 0
        ? 100
        : 0;

    // Monthly user growth (last 6 months)
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await this.userRepository.count({
        createdAt: { gte: monthStart, lt: monthEnd },
      });
      const monthLabel = `T${monthStart.getMonth() + 1}`;
      monthlyGrowth.push({ name: monthLabel, value: count });
    }

    return {
      totalUsers,
      totalStudents: totalUsers - totalSellers - totalAdmins,
      totalSellers,
      totalAdmins,
      newUsersThisMonth,
      userGrowthPercent,
      pendingApplications,
      monthlyGrowth,
    };
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
