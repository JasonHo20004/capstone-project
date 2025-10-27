import { databaseService } from "@/services/database.service";
import type { Cart, CartItem } from "@/../generated/prisma";

export class CartRepository {
  private prisma = databaseService.getClient();

  public async createCart(userId: string): Promise<Cart> {
    return this.prisma.cart.create({
      data: { userId },
    });
  }
  async findCartByUserId(userId: string): Promise<Cart | null> {
    return this.prisma.cart.findFirst({
      where: {
        userId,
      },
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
  async createCartItem(
   data: {
      cartId: string;
      courseId: string;
      priceAtTime: number;
    },
  ): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data: data,
    });
  }
}
