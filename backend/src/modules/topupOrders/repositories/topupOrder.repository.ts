import { databaseService } from "@/services/database.service";
import type { PaymentMethod,OrderStatus, TopupOrder } from "@prisma/client";
import type { PrismaTx } from "@/services/database.service";

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
   public async findPendingTopupOrderById(userId:string): Promise<TopupOrder|null> {
    return this.prisma.topupOrder.findFirst({
      where:{
        userId:userId,
        status:"PENDING"
      }
    });
  }
  //transaction
  public async findPendingTopupOrderById_InTx(id: string, tx: PrismaTx): Promise<TopupOrder | null> {
  return tx.topupOrder.findFirst({
    where: { id: id, status: 'PENDING' },
  });
}
  public async updateStatus_InTx(id: string, status: OrderStatus, tx: PrismaTx): Promise<TopupOrder> {
  return tx.topupOrder.update({
    where: { id: id },
    data: { status: status },
  });
}
public async findById(id: string): Promise<TopupOrder | null> {
    return this.prisma.topupOrder.findUnique({
      where: { id: id },
    });
  }
}
