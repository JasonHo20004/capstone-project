import { databaseService } from "@/services/database.service";
import type {
  User,
  CourseSellerApplication,
  CourseSellerProfile,
} from "@/../generated/prisma";
import type {
  SafeUser,
  CreateUserInput,
  CreateCourseSellerApplicationInput,
} from "@/modules/users/dtos/user.dto";

import type { PrismaTx } from "@/services/database.service";

export class UserRepository {
  private prisma = databaseService.getClient();

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async findCourseSellerById(id: string): Promise<SafeUser | null> {
    return this.prisma.user.findUnique({
      where: { id: id, role: "COURSESELLER" },
    });
  }
  public async createUser(userData: CreateUserInput["body"]): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  public async findApplicationIsPending(
    userId: string
  ): Promise<CourseSellerApplication | null> {
    return this.prisma.courseSellerApplication.findUnique({
      where: { userId: userId, status: "PENDING" },
    });
  }
  public async createCourseSellerApplication(
    idUser: string,
    userData: CreateCourseSellerApplicationInput["body"]
  ): Promise<CourseSellerApplication> {
    const applicationDataToCreate = {
      userId: idUser,
      certification: userData.certification,
      expertise: userData.expertise,
    };

    return this.prisma.courseSellerApplication.create({
      data: applicationDataToCreate,
    });
  }

  public async createCourseSellerProfile(userData: {
    userId: string;
    certification: string[];
    expertise: string[];
  }): Promise<CourseSellerProfile> {
    return this.prisma.courseSellerProfile.create({
      data: { ...userData, isActive: false },
    });
  }
  public async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // Transation
  public async findUserById_InTx(
    id: string,
    tx: PrismaTx 
  ): Promise<User | null> {
    return tx.user.findUnique({ where: { id } }); 
    
  }
  public async updateUser(userId: string, data: any): Promise<SafeUser> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        dateOfBirth: true,
        profilePicture: true,
        englishLevel: true,
        learningGoals: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
