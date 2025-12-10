import { AdminRepository } from "@/modules/admin/repositories/admin.repository";
import { ApplicationStatus } from "@prisma/client";
import type { CourseSellerApplication, CourseSellerProfile } from "@prisma/client";
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
      throw new Error("Không tìm thấy đơn đăng ký hoặc đã bị xóa.");
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
          throw new Error("Người dùng này đã có hồ sơ Giảng viên khóa học.");
        }
        throw new Error("Không thể duyệt đơn đăng ký này.");
      }
    } else {
      if (!rejectionReason) {
        throw new Error("Cần cung cấp lý do từ chối.");
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