import { databaseService } from "@/services/database.service";
import type { User, CourseSellerProfile } from "@/../generated/prisma";
import type {
  SafeUser,
  CreateUserInput,
  CreateCourseSellerInput,
} from "@/modules/users/dtos/user.dto";
export class UserRepository {
  private prisma = databaseService.getClient();

  public async findAll() {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async findCourseSellerById(
    id: string
  ): Promise<CourseSellerProfile | null> {
    return this.prisma.courseSellerProfile.findUnique({
      where: { userId: id },
    });
  }
  public async createUser(userData: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  public async createCourseSellerProfile(
    idUser: string,
    userData: CreateCourseSellerInput["body"]
  ): Promise<CourseSellerProfile> {
    const profileDataToCreate = {
      userId: idUser,
      certification: userData.certification,
      expertise: userData.expertise,
    };

    return this.prisma.courseSellerProfile.create({
      data: profileDataToCreate,
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
