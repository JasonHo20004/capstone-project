import { AdminRepository } from "@/modules/admin/repositories/admin.repository";
import type {
  CourseSellerApplication,
  ApplicationStatus,
  CourseSellerProfile,
} from "@/../generated/prisma";
import { UserRepository } from "@/modules/users/repositories/user.repository";

export class AdminService {
  private adminRepository = new AdminRepository();
  private userRepository = new UserRepository();

  public async upgradeToCourseSeller(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
    message?: any
  ): Promise<CourseSellerApplication | CourseSellerProfile> {
    const existingCourseSeller = await this.userRepository.findCourseSellerById(
      userId
    );
    // console.log(existingCourseSeller)
    if (!existingCourseSeller) {
      throw new Error("Course Seller is not Pending");
    }
    const dataToUpdate: {
      status: ApplicationStatus;
      rejectionReason?:any
      message?: any
    } = {
      status: status,
    };
    if (status === "APPROVED") {
      const approveCourseSellerApplication =
        await this.adminRepository.approveCourseSellerApplication(
          userId,
          dataToUpdate
        );

      const courseSellerData: {
        certification: string[];
        expertise: string[];
        userId: string;
      } = {
        certification: approveCourseSellerApplication.certification,
        expertise: approveCourseSellerApplication.expertise,
        userId: userId,
      };
      const courseSellerProfile =
        await this.userRepository.createCourseSellerProfile(courseSellerData);
      return courseSellerProfile;
    } else {
      dataToUpdate.message = message;
      dataToUpdate.rejectionReason = rejectionReason;
      const approveCourseSellerApplication =
        await this.adminRepository.approveCourseSellerApplication(
          userId,
          dataToUpdate
        );
      return approveCourseSellerApplication;
    }
  }
}
