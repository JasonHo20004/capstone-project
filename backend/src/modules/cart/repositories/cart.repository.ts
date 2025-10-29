import { databaseService } from "@/services/database.service";
import type { Prisma, Cart, CartItem } from "@/../generated/prisma";
import type { PrismaTx } from "@/services/database.service";

type CartWithItems = Prisma.CartGetPayload<{
  include: { cartItems: true };
}>;
export class CartRepository {
  private prisma = databaseService.getClient();

  public async createCart(userId: string): Promise<Cart> {
    return this.prisma.cart.create({
      data: { userId },
    });
  }
  public async createTempCart_InTx(tx: PrismaTx): Promise<Cart> {
    return tx.cart.create({
      data: {},
    });
  }
  async findCartByUserId(userId: string): Promise<Cart | null> {
    return this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });
  }
  async findCartWithItems(userId: string): Promise<CartWithItems | null> {
    return this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { cartItems: true },
    });
  }
  async findCartItem(
    cartId: string,
    courseId: string
  ): Promise<CartItem | null> {
    return this.prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        courseId: courseId,
      },
    });
  }
  async createCartItem(data: {
    cartId: string;
    courseId: string;
    priceAtTime: number;
  }): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data: data,
    });
  }
}
