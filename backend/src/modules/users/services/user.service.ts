import { UserRepository } from "@/modules/users/repositories/user.repository";
import bcrypt from "bcrypt";
import type {
  SafeUser,
  CreateUserInput,
  UserProfileResponse,
} from "@/modules/users/dtos/user.dto";
import { CartRepository } from "@/modules/cart/repositories/cart.repository";
import type { CourseSellerApplication } from "@/../generated/prisma";
import { WalletRepository } from "@/modules/users/repositories/wallet.repository";
import { AuthService } from "@/modules/auth/services/auth.service";
import { emailService } from "@/services";
export class UserService {
  private userRepository = new UserRepository();
  private walletRepository = new WalletRepository();
  private cartRepository = new CartRepository();
  private authService = new AuthService();
  public async getUserInformation(
    userId: string
  ): Promise<UserProfileResponse> {
    const userProfile = await this.userRepository.findUserProfileById(userId);
    if (!userProfile) {
      throw new Error("User Profile is not existece");
    }
    return userProfile;
  }
  public async createUser(
    userData: CreateUserInput["body"]
  ): Promise<SafeUser> {
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
    // wallet
    await this.walletRepository.createWallet(newUser.id);
    await this.cartRepository.createCart(newUser.id);

    // Fire-and-forget email verification (log error, do not block registration)
    if (emailService.isEmailConfigured()) {
      this.authService
        .sendVerificationEmail(newUser.id)
        .catch((err) => {
          console.error("Failed to send verification email:", err.message || err);
          console.error("User registration completed, but email verification was not sent.");
        });
    } else {
      console.warn(
        "Email service is not configured. Verification email will not be sent."
      );
      console.warn(
        "Please configure SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) to enable email verification."
      );
    }
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  public async updateUser(
    userId: string,
    updateData: {
      fullName: string;
      phoneNumber: string;
      dateOfBirth: Date;
      englishLevel: string[];
      learningGoals: string;
      profilePicture: string;
    }
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
    updateData: { certification: string[]; expertise: string[] }
  ): Promise<CourseSellerApplication | null> {
    const existingCourseSeller = await this.userRepository.findCourseSellerById(
      userId
    );

    if (existingCourseSeller) {
      throw new Error("Course Seller is Existence");
    }

    const existingApplication =
      await this.userRepository.findApplicationIsPending(userId);
    if (existingApplication) {
      throw new Error("Application of this user is Pending");
    }
    const newCourseSellerApplication =
      await this.userRepository.createCourseSellerApplication(
        userId,
        updateData
      );

    return newCourseSellerApplication;
  }
}
