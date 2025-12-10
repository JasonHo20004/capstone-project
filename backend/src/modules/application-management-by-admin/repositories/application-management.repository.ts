import { databaseService } from "@/services/database.service";
import type {
  CourseSellerApplication,
  ApplicationStatus,
  User,
  CourseSellerProfile,
} from "@prisma/client";

export class ApplicationManagementRepository {
  private prisma = databaseService.getClient();

  public async findAllApplications(): Promise<CourseSellerApplication[]> {
    return this.prisma.courseSellerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phoneNumber: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findApplicationById(
    id: string
  ): Promise<CourseSellerApplication | null> {
    return this.prisma.courseSellerApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phoneNumber: true,
            profilePicture: true,
            dateOfBirth: true,
            englishLevel: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  }

  public async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: { id: applicationId },
      data: {
        status,
      },
    });
  }

  public async updateUserRole(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: "COURSESELLER",
      },
    });
  }

  public async createCourseSellerProfile(
    userId: string,
    certification: string[],
    expertise: string[]
  ): Promise<CourseSellerProfile> {
    return this.prisma.courseSellerProfile.create({
      data: {
        userId,
        certification,
        expertise,
        isActive: true,
      },
    });
  }

  public async findUserRole(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role ?? null;
  }
}
