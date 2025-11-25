import { ApplicationManagementRepository } from "@/modules/application-management-by-admin/repositories/application-management.repository";
// import { ApplicationStatus } from "@/../generated/prisma";

export class ApplicationManagementService {
  private repository = new ApplicationManagementRepository();

  public async getAllApplications() {
    return this.repository.findAllApplications();
  }

  public async getApplicationById(id: string) {
    const application = await this.repository.findApplicationById(id);
    if (!application) {
      throw new Error("Không tìm thấy đơn đăng ký");
    }
    return application;
  }

  public async updateApplicationStatus(
    applicationId: string,
    status: "APPROVED" | "REJECTED"
  ) {
    const application = await this.repository.findApplicationById(
      applicationId
    );
    if (!application) {
      throw new Error("Không tìm thấy đơn đăng ký");
    }

    if (status === "APPROVED") {
      
      if (application.status === "APPROVED") {
        throw new Error("Đơn đăng ký đã được duyệt rồi");
      }
      const checkUserRole = await this.repository.findUserRole(application.userId);
      
      if (checkUserRole === "COURSESELLER") {
        throw new Error("User đã là Course Seller rồi");
      }

      try {
        await this.repository.updateUserRole(application.userId);

        await this.repository.createCourseSellerProfile(
          application.userId,
          application.certification,
          application.expertise
        );

        return this.repository.updateApplicationStatus(
          applicationId,
          status
        );
      } catch (error: any) {
        throw new Error("Lỗi khi chấp nhận đơn đăng ký: " + error.message);
      }
    }

    return this.repository.updateApplicationStatus(
      applicationId,
      status
    );
  }
}
