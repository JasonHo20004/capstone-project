import { databaseService } from "@/services/database.service";
import type { PaymentMethod,OrderStatus, TopupOrder } from "@/../generated/prisma";
export class TopupOrderRepository {
  private prisma = databaseService.getClient();

  public async createOrder(topupOrderData: {
    userId: string;
    realMoney: number;
    realAmount: number;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    currency: "VND";
  }): Promise<TopupOrder> {
    return this.prisma.topupOrder.create({
      data:  topupOrderData 
    });
  }
   public async findPendingTopupOrder(userId:string): Promise<TopupOrder|null> {
    return this.prisma.topupOrder.findFirst({
      where:{
        userId:userId,
        status:"PENDING"
      }
    });
  }
}
