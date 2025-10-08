import { databaseService } from '../../../services/database.service';
import type { User } from "../../../../generated/prisma";
import type { CreateUserInput } from '../dtos/user.dto';

export class UserRepository  {

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
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc' 
      }
    });

  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  public async createUser(userData: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }
};