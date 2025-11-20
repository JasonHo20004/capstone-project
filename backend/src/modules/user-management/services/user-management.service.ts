import { UserManagementRepository } from '@/modules/user-management/repositories/user-management.repository';
import bcrypt from 'bcrypt';


export class UserManagementService {
  private userRepository = new UserManagementRepository();

  public async getAllUsers() {
    const users = await this.userRepository.findAllUsers();
    return users.map((u: any) => ({
      ...u,
      wallet: u.wallet ? { allowance: Number(u.wallet.allowance) } : null,
    }));
  }
  
  public async createUser(data: any) {
    const { walletAllowance, courseSellerProfile, ...rest } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Prepare user data
    const userData: any = {
      ...rest,
      password: hashedPassword,
    };

    // If creating a course seller, wrap the profile in a create object
    if (courseSellerProfile && data.role === 'COURSESELLER') {
      userData.courseSellerProfile = {
        create: {
          certification: courseSellerProfile.certification || [],
          expertise: courseSellerProfile.expertise || [],
          isActive: courseSellerProfile.isActive ?? false,
        },
      };
    }

    const newUser = await this.userRepository.createUser(userData);
    await this.userRepository.createWalletWithAllowance(newUser.id, {
      allowance: walletAllowance,
    });
    const { password, ...safe } = newUser;
    return safe;
  }

  public async updateUser(id: any, data: any) {
    const { walletAllowance, ...rest } = data;
    const updatedUser = await this.userRepository.updateUser(id, rest);
    if (walletAllowance !== undefined) {
      await this.userRepository.updateWalletAllowance(id, {
        allowance: walletAllowance,
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