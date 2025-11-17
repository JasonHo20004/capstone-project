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
    const { walletAllowance, ...rest } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userRepository.createUser({
      ...rest,
      password: hashedPassword,
    });
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