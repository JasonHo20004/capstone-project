import { databaseService } from "@/services/database.service";
import type {  CourseSellerApplication, ApplicationStatus  } from "@/../generated/prisma";
export class AdminRepository {
  private prisma = databaseService.getClient();

  public async approveCourseSellerApplication(
    userId: string,
    dataToUpdate:any
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: {
        userId: userId,
      },
      data: dataToUpdate
    });
  }
}
