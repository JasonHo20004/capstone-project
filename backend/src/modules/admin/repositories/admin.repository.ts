import { databaseService } from "@/services/database.service";
import type { CourseSellerApplication, ApplicationStatus } from "@/../generated/prisma";

export class AdminRepository {
  private prisma = databaseService.getClient();

  public async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        profilePicture: true,
        dateOfBirth: true,
        englishLevel: true,
        learningGoals: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async updateApplicationStatus(
    applicationId: string,
    dataToUpdate: {
      status: ApplicationStatus;
      rejectionReason?: string;
      message?: string;
    }
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: { id: applicationId },
      data: dataToUpdate,
    });
  }

  public async updateCourseSellerRole(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: "COURSESELLER" },
    });
  }

  public async approveCourseSellerApplication(
    applicationId: string,
    dataToUpdate: any
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: { id: applicationId },
      data: dataToUpdate,
    });
  }

  public async findApplicationById(
    id: string
  ): Promise<CourseSellerApplication | null> {
    return this.prisma.courseSellerApplication.findUnique({
      where: { id: id, status: "PENDING" },
    });
  }
}