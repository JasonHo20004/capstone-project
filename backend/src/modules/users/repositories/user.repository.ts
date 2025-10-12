import { databaseService } from "@/services/database.service";
import type { User, CourseSellerApplication , CourseSellerProfile} from "@/../generated/prisma";
import type {
  SafeUser,
  CreateUserInput,
  CreateCourseSellerApplicationInput,
} from "@/modules/users/dtos/user.dto";
export class UserRepository {
  private prisma = databaseService.getClient();


  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async findCourseSellerById(
    id: string
  ): Promise<CourseSellerApplication | null> {
    return this.prisma.courseSellerApplication.findUnique({
      where: { userId: id,
        status: "PENDING"
      },
    });
  }
  public async createUser(userData: CreateUserInput['body']): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  public async createCourseSellerApplication(
    idUser: string,
    userData: CreateCourseSellerApplicationInput["body"]
  ): Promise<CourseSellerApplication> {
    const applicationDataToCreate = {
      userId: idUser,
      certification: userData.certification,
      expertise: userData.expertise,
    };

    return this.prisma.courseSellerApplication.create({
      data: applicationDataToCreate,
    });
  }

  public async createCourseSellerProfile(
    userData: any
  ): Promise<CourseSellerProfile> {
    return this.prisma.courseSellerProfile.create({
      data: userData,
    });
  }
  public async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async updateUser(userId: string, data: any): Promise<SafeUser> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        dateOfBirth: true,
        profilePicture: true,
        englishLevel: true,
        learningGoals: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
