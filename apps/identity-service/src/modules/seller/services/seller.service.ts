import { SellerRepository } from "../repositories/seller.repository";
import { EventBusService } from "@capstone/common";
import { EventNames } from "@capstone/common";
import type { ApplyForSellerInput, UpdateApplicationStatusInput } from "../dtos/seller.dto";

export class SellerService {
  private repository = new SellerRepository();
  private eventBus: EventBusService;

  constructor() {
    this.eventBus = EventBusService.getInstance("identity-service");
  }

  /**
   * Apply to become a course seller
   */
  async applyForSeller(userId: string, data: ApplyForSellerInput) {
    // Check if user already has an application
    const existingApplication = await this.repository.findApplicationByUserId(userId);
    if (existingApplication) {
      if (existingApplication.status === "PENDING") {
        throw new Error("You already have a pending application");
      }
      if (existingApplication.status === "APPROVED") {
        throw new Error("You are already a course seller");
      }
      // If rejected, allow re-application
    }

    // Check if user already has a seller profile
    const existingProfile = await this.repository.getSellerProfile(userId);
    if (existingProfile) {
      throw new Error("You already have a course seller profile");
    }

    const application = await this.repository.createApplication({
      userId,
      certification: data.certification,
      expertise: data.expertise,
      message: data.message,
    });

    return {
      id: application.id,
      status: application.status,
      certification: application.certification,
      expertise: application.expertise,
      message: application.message,
      createdAt: application.createdAt,
      user: application.user,
    };
  }

  /**
   * Get current user's application status
   */
  async getMyApplication(userId: string) {
    const application = await this.repository.findApplicationByUserId(userId);
    if (!application) {
      return null;
    }

    return {
      id: application.id,
      status: application.status,
      certification: application.certification,
      expertise: application.expertise,
      message: application.message,
      rejectionReason: application.rejectionReason,
      createdAt: application.createdAt,
    };
  }

  /**
   * Get all applications (Admin only)
   */
  async getAllApplications(page: number, limit: number, status?: string) {
    const result = await this.repository.getApplications(
      page,
      limit,
      status as any
    );

    return {
      applications: result.data.map((app) => ({
        id: app.id,
        status: app.status,
        certification: app.certification,
        expertise: app.expertise,
        message: app.message,
        rejectionReason: app.rejectionReason,
        createdAt: app.createdAt,
        user: {
          id: app.user.id,
          email: app.user.email,
          fullName: app.user.fullName,
          profilePicture: app.user.profilePicture,
          joinedAt: app.user.createdAt,
        },
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Approve or reject an application (Admin only).
   * `adminId` is recorded for audit (who actioned the application + when).
   */
  async updateApplicationStatus(
    applicationId: string,
    data: UpdateApplicationStatusInput,
    adminId?: string
  ) {
    const application = await this.repository.findApplicationById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "PENDING") {
      throw new Error("This application has already been processed");
    }

    const processedAt = new Date();

    if (data.status === "APPROVED") {
      // Update application status (with audit fields)
      await this.repository.updateApplicationStatus(applicationId, {
        status: "APPROVED",
        rejectionReason: undefined,
        message: data.message,
        approvedBy: adminId,
        approvedAt: processedAt,
      });

      // Update user role
      await this.repository.updateUserRole(application.userId);

      // Create seller profile
      await this.repository.createSellerProfile({
        userId: application.userId,
        certification: application.certification,
        expertise: application.expertise,
      });

      // Publish event
      await this.eventBus.publish(EventNames.SELLER_APPROVED, {
        userId: application.userId,
        sellerId: application.userId,
        email: application.user.email,
        fullName: application.user.fullName,
      });

      return {
        success: true,
        message: "Application approved successfully",
        applicationId,
        userId: application.userId,
      };
    } else {
      // Reject
      if (!data.rejectionReason) {
        throw new Error("Rejection reason is required");
      }

      await this.repository.updateApplicationStatus(applicationId, {
        status: "REJECTED",
        rejectionReason: data.rejectionReason,
        message: data.message,
        approvedBy: adminId,
        approvedAt: processedAt,
      });

      // Publish event
      await this.eventBus.publish(EventNames.SELLER_REJECTED, {
        userId: application.userId,
        email: application.user.email,
        fullName: application.user.fullName,
        reason: data.rejectionReason,
      });

      return {
        success: true,
        message: "Application rejected",
        applicationId,
        userId: application.userId,
      };
    }
  }

  /**
   * Get seller profile
   */
  async getSellerProfile(userId: string) {
    const profile = await this.repository.getSellerProfile(userId);
    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      certification: profile.certification,
      expertise: profile.expertise,
      isActive: profile.isActive,
      user: profile.user,
    };
  }

  /**
   * Update seller profile
   */
  async updateSellerProfile(
    userId: string,
    data: { certification?: string[]; expertise?: string[] }
  ) {
    const profile = await this.repository.getSellerProfile(userId);
    if (!profile) {
      throw new Error("Seller profile not found");
    }

    const updated = await this.repository.updateSellerProfile(userId, data);
    return {
      id: updated.id,
      certification: updated.certification,
      expertise: updated.expertise,
      isActive: updated.isActive,
    };
  }
}
