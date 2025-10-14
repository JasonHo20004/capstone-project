import { UserRepository } from "@/modules/users/repositories/user.repository";
import bcrypt from "bcrypt";
import type {
  SafeUser,
  CreateUserInput,
  UpdateUserInput,
  CreateCourseSellerApplicationInput,
} from "@/modules/users/dtos/user.dto";

import type { CourseSellerApplication } from "@/../generated/prisma"

export class UserService {
  private userRepository = new UserRepository(); 
  

  public async getUserInformation(userId:string): Promise<SafeUser> {
    const existingUser = await this.userRepository.findUserById(
      userId
    );
    if (!existingUser) {
      throw new Error("Email is already in use");
    }

     
    return existingUser;
  }
  public async createUser(userData: CreateUserInput['body']): Promise<SafeUser> {
    const existingUser = await this.userRepository.findUserByEmail(
      userData.email
    );
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  public async updateUser(
    userId: string,
    updateData: UpdateUserInput["body"]
  ): Promise<SafeUser | null> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const dataToUpdate: any = {};

    Object.keys(updateData).forEach((key) => {
      const value = updateData[key as keyof typeof updateData];
      if (value !== undefined) {
        dataToUpdate[key as keyof typeof dataToUpdate] = value;
      }
    });

    if (Object.keys(dataToUpdate).length === 0) {
      const { password, ...userWithoutPassword } = existingUser;
      return userWithoutPassword;
    }

    const updatedUser = await this.userRepository.updateUser(
      userId,
      dataToUpdate
    );

    if (updatedUser) {
      return updatedUser;
    }

    return null;
  }

  public async createCourseSellerApplication(
    userId: string,
    updateData: CreateCourseSellerApplicationInput["body"]
  ): Promise<CourseSellerApplication | null> {

    const existingCourseSeller = await this.userRepository.findCourseSellerById(
      userId
    );
    // console.log(existingCourseSeller)
    if (existingCourseSeller) {
      throw new Error("Course Seller is Pending");
    }

    const newCourseSellerApplication = await this.userRepository.createCourseSellerApplication(
      userId,
      updateData
    );

    return newCourseSellerApplication;
  }
}
