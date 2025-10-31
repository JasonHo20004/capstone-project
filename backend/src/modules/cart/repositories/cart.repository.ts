import { databaseService } from "@/services/database.service";
import type { Prisma, Cart, CartItem } from "@/../generated/prisma";
import type { PrismaTx, BatchPayload } from "@/services/database.service";

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
  public async findCartByUserId(userId: string): Promise<Cart | null> {
    return this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });
  }
  public async findCartWithItems(
    userId: string
  ): Promise<CartWithItems | null> {
    return this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { cartItems: true },
    });
  }
  public async findCartWithCourse(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        cartItems: {
          orderBy: { addedAt: "desc" }, 
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
  public async findCartItem(
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
  public async createCartItem(data: {
    cartId: string;
    courseId: string;
    priceAtTime: number;
  }): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data: data,
    });
  }
  public async findItemsByIds_InCart(
    cartId: string,
    itemIds: string[]
  ): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany({
      where: {
        cartId: cartId,
        id: { in: itemIds },
      },
    });
  }
  public async deleteItemsByIds_InTx(
    itemIds: string[],
    tx: PrismaTx
  ): Promise<BatchPayload> {
    return tx.cartItem.deleteMany({
      where: {
        id: { in: itemIds },
      },
    });
  }
}
