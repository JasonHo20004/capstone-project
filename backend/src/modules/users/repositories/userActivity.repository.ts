// import { databaseService } from "@/services/database.service";
import type { UserActivity } from "@/../generated/prisma";
import type { PrismaTx, BatchPayload } from "@/services/database.service";


export class UserActivityRepository {
  //private prisma = databaseService.getClient();

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
}
