import { databaseService } from "@/services/database.service";
import type { PracticeSession } from "@/../generated/prisma";
import type { PrismaTx } from "@/services/database.service";
import type {
  CreateSessionResponse,
  FindSessionResponse,
} from "@/modules/practice_sessions/dtos/practiceSession.dto";
export class PracticeSessionRepository {
  private prisma = databaseService.getClient();

  public async createSession(data: {
    userId: string;
    testId: string;
    selectedSections: string[];
  }): Promise<CreateSessionResponse> {
    return this.prisma.practiceSession.create({
      data: { ...data, status: "ONGOING" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
       test: {
          select: {
            title: true,
            durationInMinutes: true,
            totalScore: true,

            englishTestType: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }

  public async findOnGoingSessionByTest(data: {
    userId: string;
    testId: string;
  }): Promise<FindSessionResponse | null> {
    return this.prisma.practiceSession.findFirst({
      where: { ...data, status: "ONGOING" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        test: {
          select: {
            title: true,
            durationInMinutes: true,
            totalScore: true,

            englishTestType: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }
  public async findOnGoingSessionById(data: {
    userId: string;
    sessionId: string;
  }): Promise<FindSessionResponse | null> {
    return this.prisma.practiceSession.findFirst({
      where: { userId: data.userId, id: data.sessionId, status: "ONGOING" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        test: {
          select: {
            title: true,
            durationInMinutes: true,
            totalScore: true,
            englishTestType: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }

  public async submitSession_InTx(data:{
    sessionId:string;
    rawScoresBySkill: any;
    scaledScoresBySkill: any
overallScaledScore:number
  },tx:PrismaTx): Promise<PracticeSession> {
    return tx.practiceSession.update({
        where: { id: data.sessionId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          rawScoresBySkill: data.rawScoresBySkill ,
          scoresBySkill:data.scaledScoresBySkill , 
          overallScaledScore: data.overallScaledScore, 
        },
      });
  }
}
