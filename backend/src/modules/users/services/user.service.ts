import { UserRepository } from "@/modules/users/repositories/user.repository";
import bcrypt from 'bcrypt';
import type { CreateUserInput } from '@/modules/users/dtos/user.dto';
// const prisma = new PrismaClient();
// const { User } = prisma;
import type { User } from "@/../generated/prisma";
// import type { User } from "@/generated/prisma";

export class UserService {
  private userRepository = new UserRepository();
  public async getAllUsers() : Promise<Omit<User, 'password'>[]>{
    try {
      const users = await this.userRepository.findAll();

      return users;
    } catch (error) {
      console.error("Error in userService.getAllUsers:", error);
      throw new Error("Failed to retrieve users");
    }
  }
  
  public async createUser(userData: CreateUserInput ): Promise<Omit<User, 'password'>> {
    // 1. Kiểm tra nghiệp vụ: Email đã tồn tại chưa?
    const existingUser = await this.userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    // 2. Xử lý dữ liệu: Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Gọi Repository để lưu vào database
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
