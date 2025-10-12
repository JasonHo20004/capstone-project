import { databaseService } from "@/services/database.service";
import type { CourseSellerApplication } from "@/../generated/prisma";
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  public async approveCourseSellerApplication(
    userId: string,
    dataToUpdate: any
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: {
        userId: userId,
      },
      data: dataToUpdate,
    });
  }
}
