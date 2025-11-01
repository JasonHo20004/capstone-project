// import { databaseService } from "@/services/database.service";
// import type { Order } from "@/../generated/prisma";
import type { PrismaTx } from "@/services/database.service";
import type{CreateOrderResponseDTO} from "@/modules/cart/dtos/order.dto"
export class OrderRepository {
  //private prisma = databaseService.getClient();

  public async createOrder_InTx(
    data: { userId: string; cartId: string; totalAmount: number },
    tx: PrismaTx
  ): Promise<CreateOrderResponseDTO> {
    return tx.order.create({
      data,
      include: {
        user: {
          select: {fullName:true,email:true},
        },
        cart:{
          select:{
            cartItems:{
              select:{
                id:true,
                course:{
                  select:{
                    id:true,
                    title:true
                  }
                },
                priceAtTime:true
              }
            }
          }
        }
      },
    });
  }
}
