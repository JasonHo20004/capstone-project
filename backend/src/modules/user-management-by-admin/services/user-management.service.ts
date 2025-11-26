import { UserManagementRepository } from "@/modules/user-management-by-admin/repositories/user-management.repository";
import { hashPassword } from "@/utils/password";
import { NotificationService, NOTIFICATION_TYPES } from "@/modules/notifications/services/notification.service";

export class UserManagementService {
  private userRepository = new UserManagementRepository();
  private notificationService = new NotificationService();

  public async getAllUsers() {
    const users = await this.userRepository.findAllUsers();

    const totalWallet = users.reduce((sum: number, user: any) => {
      return sum + (user.wallet ? Number(user.wallet.allowance) : 0);
    }, 0);
    return {
      users,
      totalWallet,
      userCount: users.length,
    };
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    return user;
  }

  public async createUser(data: any) {
    const { walletAllowance, courseSellerProfile, ...rest } = data;
    const hashedPassword = await hashPassword(data.password);

    const userData: any = {
      ...rest,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.createUser(userData);

    await this.userRepository.createWalletWithAllowance(newUser.id, {
      allowance: walletAllowance,
    });

    if (courseSellerProfile && data.role === "COURSESELLER") {
      await this.userRepository.createCourseSellerProfile(newUser.id, {
        certification: courseSellerProfile.certification || [],
        expertise: courseSellerProfile.expertise || [],
        isActive: courseSellerProfile.isActive ?? false,
      });
    }

    const { password, ...safe } = newUser;
    return safe;
  }

  public async updateUser(id: any, data: any) {
    const { walletAllowance, courseSellerProfile, ...rest } = data;

    // Load current user state to detect status transitions
    const existingUser = await this.userRepository.findUserById(id);

    const updatedUser = await this.userRepository.updateUser(id, rest);

    if (walletAllowance !== undefined) {
      await this.userRepository.updateWalletAllowance(id, {
        allowance: walletAllowance,
      });
    }

    if (courseSellerProfile && data.role === "COURSESELLER") {
      await this.userRepository.updateCourseSellerProfile(id, {
        certification: courseSellerProfile.certification || [],
        expertise: courseSellerProfile.expertise || [],
        isActive: courseSellerProfile.isActive ?? false,
      });

      const previouslyActive =
        existingUser?.courseSellerProfile?.isActive ?? false;
      const nowActive = courseSellerProfile.isActive ?? false;

      // Account disabled by admin: notify seller and all affected students
      if (previouslyActive && !nowActive && existingUser) {
        const sellerName = existingUser.fullName;

        // Notify enrolled students
        const studentNotifications =
          await this.notificationService.createEnrolledStudentNotifications(
            existingUser.id,
            sellerName
          );
        if (studentNotifications.length > 0) {
          await this.notificationService.sendBulkNotifications(
            studentNotifications
          );
        }

        // Notify the course seller
        const sellerNotification = {
          recipientId: existingUser.id,
          recipientEmail: existingUser.email,
          recipientName: sellerName,
          notificationTypeName: NOTIFICATION_TYPES.SELLER_ACCOUNT_LOCKED,
          title: "Your instructor account has been disabled",
          content: `Dear ${sellerName},\n\nYour instructor account has been disabled by an administrator. You can no longer create or manage courses until your account is reviewed.\n\nIf you have any questions, please contact support.`,
        };

        await this.notificationService.sendNotification(sellerNotification);
      }
    }

    const { password, ...safe } = updatedUser;
    return safe;
  }
  public async deleteUser(id: any) {
    const deleted = await this.userRepository.deleteUserCascade(id);
    return { id: deleted.id };
  }
}
