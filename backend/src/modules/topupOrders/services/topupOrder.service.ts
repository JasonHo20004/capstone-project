import { UserRepository } from "@/modules/users/repositories/user.repository";

//import { databaseService } from "@/services/database.service";
import type { TopupOrder } from "@/../generated/prisma";
import { TopupOrderRepository } from "@/modules/topupOrders/repositories/topupOrder.repository";

export class TopupOrderService {
  private topupOrderRepository = new TopupOrderRepository();
  private userRepository = new UserRepository();
  
  public async createTopupOrder(userId: string, realMoney: number): Promise<TopupOrder> {
   
    const existingUser = await this.userRepository.findUserById(
      userId
    );
    if (!existingUser) {
      throw new Error("User is not existence");
    }

    const existingPendingTopupOrder = await this.topupOrderRepository.findPendingTopupOrder(userId)
    if (existingPendingTopupOrder){
      throw Error("Topup of this User is PENDING")
    }
    return this.topupOrderRepository.createOrder({
        userId: userId,
        realMoney: realMoney,
        realAmount: realMoney/1000, // 1:1000
        paymentMethod: "MOMO",
        status: 'PENDING',
        currency: 'VND',
      });
     
  }
}
