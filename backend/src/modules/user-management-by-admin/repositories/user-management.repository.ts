import { databaseService } from "@/services/database.service";

export class UserManagementRepository {
  private prisma = databaseService.getClient();

  public async findAllUsers() {
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
        wallet: {
          select: {
            allowance: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
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
        wallet: {
          select: {
            allowance: true,
          },
        },
        courseSellerProfile: {
          select: {
            certification: true,
            expertise: true,
            isActive: true,
          },
        },
      },
    });
  }

  public async createUser(data: any) {
    return this.prisma.user.create({
      data,
    });
  }
  public async createWalletWithAllowance(id: string, data: any) {
    return this.prisma.wallet.create({
      data: {
        ...data,
        userId: id,
      },
    });
  }

  public async createCourseSellerProfile(userId: string, data: any) {
    return this.prisma.courseSellerProfile.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  public async updateCourseSellerProfile(userId: string, data: any) {
    return this.prisma.courseSellerProfile.update({
      where: { userId },
      data,
    });
  }

  public async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  public async updateWalletAllowance(id: string, data: any) {
    return this.prisma.wallet.update({
      where: { userId: id },
      data,
    });
  }
  public async deleteUserCascade(id: string) {
    return databaseService.transaction(async (tx) => {
      await tx.userActivity.deleteMany({ where: { userId: id } });
      await tx.topupOrder.deleteMany({ where: { userId: id } });
      await tx.subscriptionContract.deleteMany({
        where: { courseSellerId: id },
      });
      await tx.wallet.deleteMany({ where: { userId: id } });
      const deleted = await tx.user.delete({ where: { id } });
      return deleted;
    });
  }
}
