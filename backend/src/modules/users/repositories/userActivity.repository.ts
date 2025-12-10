import { databaseService } from "@/services/database.service";
import type { UserActivity } from "@prisma/client";
import type { PrismaTx, BatchPayload } from "@/services/database.service";


export class UserActivityRepository {
  private prisma = databaseService.getClient();

  public async createMany_InTx(
    data: {
      userId: string;
      courseId: string;
      transactionId: string;
    }[],
    tx: PrismaTx
  ): Promise<BatchPayload> {
    return tx.userActivity.createMany({
      data: data,
    });
  }
  public async create_InTx(
    data: {
      userId: string;
      courseId: string;
      transactionId: string;
    },
    tx: PrismaTx
  ): Promise<UserActivity> {
    return tx.userActivity.create({
      data: data,
    });
  }
  public async findActivity(
    userId: string,
    courseId: string
  ): Promise<any | null> {
    return this.prisma.userActivity.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
      include:{
        user:{
          select:{
            id:true,
            fullName:true,
            email:true
          }
        },
       course:{
        select:{
          id:true,
          title:true
        }
       } 
      }
    });
  }
}
