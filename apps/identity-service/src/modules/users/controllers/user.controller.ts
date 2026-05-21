// =============================================================================
// User Controller - HTTP handlers for user endpoints
// =============================================================================

import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { asyncHandler, NotFoundError } from "@capstone/common";
import bcrypt from "bcrypt";
import { databaseService } from "../../../services/database.service.js";

export class UserController {
  private userService = new UserService();

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ success: true, data: user });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getById(id as string);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ success: true, data: user });
  });

  // Internal endpoint for other services to get basic user info
  getBasicInfo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getBasicInfo(id as string);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ success: true, data: user });
  });

  // Internal endpoint: check seller active status (used by course/payment services
  // to gate publish/withdraw actions for banned/inactive sellers)
  getSellerStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = await this.userService.getSellerStatus(id as string);
    res.json({ success: true, data: status });
  });

  // Internal batch endpoint for other services
  getBasicInfoBatch = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids array is required" });
    }
    const users = await this.userService.getBasicInfoBatch(ids.slice(0, 100));
    res.json({ success: true, data: users });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.userService.update(userId, req.body);
    
    res.json({ success: true, data: user });
  });

  getMany = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as any;
    const result = await this.userService.getMany({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      role: query.role,
    });

    res.json({ success: true, ...result });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.userService.delete(id as string);
    
    res.json({ success: true, message: "User deleted successfully" });
  });

  // Admin: Create a new user
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { fullName, email, password, phoneNumber, dateOfBirth, englishLevel, learningGoals, role, courseSellerProfile, walletAllowance } = req.body;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ success: false, message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phoneNumber: phoneNumber || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        englishLevel: englishLevel || null,
        learningGoals: learningGoals || [],
        role: role || "STUDENT",
        isEmailVerified: true, // Admin-created users are pre-verified
        ...(role === "COURSESELLER" && courseSellerProfile
          ? {
              courseSellerProfile: {
                create: {
                  certification: courseSellerProfile.certification || [],
                  expertise: courseSellerProfile.expertise || [],
                  isActive: courseSellerProfile.isActive ?? true,
                },
              },
            }
          : {}),
      },
      include: { courseSellerProfile: true },
    });

    res.status(201).json({ success: true, data: user });
  });

  // Admin: Update a user
  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const prisma = databaseService.getClient();
    const { id } = req.params;
    const { fullName, email, phoneNumber, dateOfBirth, englishLevel, learningGoals, role, courseSellerProfile } = req.body;

    const existing = await prisma.user.findUnique({ where: { id: id as string } });
    if (!existing) {
      throw new NotFoundError("User not found");
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
    if (englishLevel !== undefined) updateData.englishLevel = englishLevel;
    if (learningGoals !== undefined) updateData.learningGoals = learningGoals;
    if (role !== undefined) updateData.role = role;

    const user = await prisma.user.update({
      where: { id: id as string },
      data: updateData,
      include: { courseSellerProfile: true, administratorProfile: true },
    });

    // Update seller profile if provided
    if (role === "COURSESELLER" && courseSellerProfile) {
      if (user.courseSellerProfile) {
        await prisma.courseSellerProfile.update({
          where: { id: user.courseSellerProfile.id },
          data: {
            certification: courseSellerProfile.certification ?? user.courseSellerProfile.certification,
            expertise: courseSellerProfile.expertise ?? user.courseSellerProfile.expertise,
            isActive: courseSellerProfile.isActive ?? user.courseSellerProfile.isActive,
          },
        });
      } else {
        await prisma.courseSellerProfile.create({
          data: {
            userId: user.id,
            certification: courseSellerProfile.certification || [],
            expertise: courseSellerProfile.expertise || [],
            isActive: courseSellerProfile.isActive ?? true,
          },
        });
      }
    }

    const updatedUser = await this.userService.getById(user.id);
    res.json({ success: true, data: updatedUser });
  });

  // Internal stats endpoint for admin dashboard
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await this.userService.getStats();
    res.json({ success: true, data: stats });
  });
}
