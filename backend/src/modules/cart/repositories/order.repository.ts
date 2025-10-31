// import { databaseService } from "@/services/database.service";
import type { Order } from "@/../generated/prisma";
import type { PrismaTx } from "@/services/database.service";

export class OrderRepository {
  //private prisma = databaseService.getClient();

  public async createOrder_InTx(
    data: { userId: string; cartId: string; totalAmount: number },
    tx: PrismaTx
  ): Promise<Order> {
    return tx.order.create({
      data,
    });
  }
}
