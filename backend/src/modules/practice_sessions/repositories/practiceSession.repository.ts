import { databaseService } from "@/services/database.service";
import type { PracticeSession } from "@/../generated/prisma";
// import type { PrismaTx } from "@/services/database.service";
import type { CreateSessionResponse } from "@/modules/practice_sessions/dtos/practiceSession.dto";
export class PracticeSessionRepository {
  private prisma = databaseService.getClient();

  public async createSession(data: {
    userId: string;
    testId: string;
    selectedSections:string[]
  }): Promise<CreateSessionResponse> {
    return this.prisma.practiceSession.create({
      data: { ...data, status: "ONGOING" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        test: {
          select: { title: true, durationInMinutes: true, totalScore: true },
        },
      },
    });
  }

  public async findOnGoingSession(data: {
    userId: string;
    testId: string;
  }): Promise<PracticeSession|null> {
    return this.prisma.practiceSession.findFirst({
      where:{...data, status: "ONGOING"}
    });
  }
}
