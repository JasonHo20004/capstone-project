import { UserManagementRepository } from "@/modules/user-management-by-admin/repositories/user-management.repository";
import { hashPassword } from "@/utils/password";

export class UserManagementService {
  private userRepository = new UserManagementRepository();

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
    }

    const { password, ...safe } = updatedUser;
    return safe;
  }
  public async deleteUser(id: any) {
    const deleted = await this.userRepository.deleteUserCascade(id);
    return { id: deleted.id };
  }
}
