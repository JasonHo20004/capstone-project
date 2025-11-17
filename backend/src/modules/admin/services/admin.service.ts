import { AdminRepository } from "@/modules/admin/repositories/admin.repository";
import { ApplicationStatus } from "@/../generated/prisma";
import type { CourseSellerApplication, CourseSellerProfile } from "@/../generated/prisma";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { databaseService } from "@/services/database.service";

export class AdminService {
  private adminRepository = new AdminRepository();
  private userRepository = new UserRepository();
  private prisma = databaseService.getClient();
  

  public async upgradeToCourseSeller(
    applicationId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
    message?: any
  ): Promise<CourseSellerApplication | CourseSellerProfile> {
    
    const existingApplication = await this.adminRepository.findApplicationById(
      applicationId
    );

    
    if (!existingApplication) {
      throw new Error("Application not found or has been deleted.");
    }

    if (status === "APPROVED") {
      // Logic nghiệp vụ và Transaction NẰM TẠI SERVICE
      const { userId, certification, expertise } = existingApplication;

      try {
        await this.adminRepository.updateCourseSellerRole(userId);

        // Update application status
        await this.prisma.courseSellerApplication.update({
          where: { id: applicationId },
          data: {
            status: ApplicationStatus.APPROVED,
            rejectionReason: null,
            message: null,
          },
        });

        // Create course seller profile
        const newProfile = await this.userRepository.createCourseSellerProfile({
          userId: userId,
          certification: certification,
          expertise: expertise,
        });

        return newProfile;
      } catch (error: any) {
        if (error.code === "P2002") {
          // Lỗi unique constraint (user đã có profile)
          throw new Error("This user already has a Course Seller profile.");
        }

        throw new Error("Can not approve this application.");
      }
    } else {
      if (!rejectionReason) {
        throw new Error("Need to have Rejection Reason.");
      }

      const dataToUpdate = {
        status: ApplicationStatus.REJECTED,
        message: message ,
        rejectionReason: rejectionReason,
      };

      // 1. Repository CHỈ query (update)
      return this.adminRepository.updateApplicationStatus(
        applicationId,
        dataToUpdate
      );
    }
  }
  

 
}