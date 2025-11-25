import { databaseService } from "@/services/database.service";
import type {
  User,
  CourseSellerApplication,
  CourseSellerProfile,
} from "@/../generated/prisma";
import type {
  SafeUser,
  CreateUserInput,
  UserProfileResponse,
} from "@/modules/users/dtos/user.dto";

import type { PrismaTx } from "@/services/database.service";

export class UserRepository {
  private prisma = databaseService.getClient();

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async findUserProfileById(
    userId: string
  ): Promise<UserProfileResponse | null> {
    const userProfile = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        profilePicture: true,
        dateOfBirth: true,
        createdAt: true,
        englishLevel: true,
        learningGoals: true,
        role: true,
        // Lấy thông tin ví
        wallet: {
          select: {
            allowance: true,
          },
        },
        // Lấy thông tin profile giảng viên (nếu có)
        courseSellerProfile: {
          select: {
            certification: true,
            expertise: true,
          },
        },
        // Lấy đơn đăng ký giảng viên (nếu có)
        courseSellerApplication: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            message: true,
            rejectionReason: true,
            certification: true,
            expertise: true,
          },
        },
      },
    });

    // Ép kiểu 'allowance' từ Decimal sang number cho an toàn
    if (userProfile?.wallet?.allowance) {
      // @ts-ignore
      userProfile.wallet.allowance = Number(userProfile.wallet.allowance);
    }

    return userProfile as UserProfileResponse | null;
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
    userData: { certification: string[]; expertise: string[] }
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
