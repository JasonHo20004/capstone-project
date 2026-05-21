import { databaseService } from "../../../services/database.service.js";
import type { ApplicationStatus, Prisma } from "../../../../generated/prisma/index.js";

export class SellerRepository {
  private db = databaseService;

  /**
   * Create a new seller application
   */
  async createApplication(data: {
    userId: string;
    certification: string[];
    expertise: string[];
    message?: string;
  }) {
    return this.db.getClient().courseSellerApplication.create({
      data: {
        userId: data.userId,
        certification: data.certification,
        expertise: data.expertise,
        message: data.message,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Find application by user ID
   */
  async findApplicationByUserId(userId: string) {
    return this.db.getClient().courseSellerApplication.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  /**
   * Find application by ID
   */
  async findApplicationById(applicationId: string) {
    return this.db.getClient().courseSellerApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  /**
   * Get all applications with pagination and filtering
   */
  async getApplications(
    page: number = 1,
    limit: number = 10,
    status?: ApplicationStatus
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.CourseSellerApplicationWhereInput = status ? { status } : {};

    const [applications, total] = await Promise.all([
      this.db.getClient().courseSellerApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              profilePicture: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.db.getClient().courseSellerApplication.count({ where }),
    ]);

    return {
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update application status (approve/reject) with audit fields.
   */
  async updateApplicationStatus(
    applicationId: string,
    data: {
      status: ApplicationStatus;
      rejectionReason?: string;
      message?: string;
      approvedBy?: string;
      approvedAt?: Date;
    }
  ) {
    return this.db.getClient().courseSellerApplication.update({
      where: { id: applicationId },
      data: {
        status: data.status,
        rejectionReason: data.rejectionReason,
        message: data.message,
        approvedBy: data.approvedBy,
        approvedAt: data.approvedAt,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Create course seller profile after approval
   */
  async createSellerProfile(data: {
    userId: string;
    certification: string[];
    expertise: string[];
  }) {
    return this.db.getClient().courseSellerProfile.create({
      data: {
        userId: data.userId,
        certification: data.certification,
        expertise: data.expertise,
        isActive: true,
      },
    });
  }

  /**
   * Update user role to COURSESELLER
   */
  async updateUserRole(userId: string) {
    return this.db.getClient().user.update({
      where: { id: userId },
      data: { role: "COURSESELLER" },
    });
  }

  /**
   * Get seller profile by user ID
   */
  async getSellerProfile(userId: string) {
    return this.db.getClient().courseSellerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  /**
   * Update seller profile
   */
  async updateSellerProfile(
    userId: string,
    data: {
      certification?: string[];
      expertise?: string[];
      isActive?: boolean;
    }
  ) {
    return this.db.getClient().courseSellerProfile.update({
      where: { userId },
      data,
    });
  }
}
