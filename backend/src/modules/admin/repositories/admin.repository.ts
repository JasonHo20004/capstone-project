import { databaseService } from "@/services/database.service";
import type { CourseSellerApplication, ApplicationStatus } from "@prisma/client";

export class AdminRepository {
  private prisma = databaseService.getClient();


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