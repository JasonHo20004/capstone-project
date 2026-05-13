// =============================================================================
// Cart Service - Business logic for cart operations
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import { OrderService } from "../../orders/services/order.service.js";
import { getCourseById } from "../../../clients/course.client.js";

export class CartService {
  private prisma = databaseService.getClient();
  private orderService = new OrderService();

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { cartItems: true },
      });
    }

    const cartItemsWithCourse = await Promise.all(
      cart.cartItems.map(async (item) => {
        const course = await getCourseById(item.courseId);
        return {
          id: item.id,
          courseId: item.courseId,
          addedAt: item.addedAt,
          priceAtTime: item.priceAtTime,
          cartId: item.cartId,
          course: {
            id: item.courseId,
            title: course?.title || "Unknown Course",
            price: course?.price ?? item.priceAtTime,
            thumbnailUrl: course?.thumbnailUrl,
          },
        };
      })
    );

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      cartItems: cartItemsWithCourse,
    };
  }

  async addToCart(userId: string, courseId: string) {
    const course = await getCourseById(courseId);
    if (!course || course.price <= 0) {
      throw new Error("Course not found or invalid price");
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { cartItems: true },
      });
    }

    const existing = cart.cartItems.find((i) => i.courseId === courseId);
    if (existing) {
      return this.getCart(userId);
    }

    await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        courseId,
        priceAtTime: course.price,
      },
    });

    return this.getCart(userId);
  }

  async checkoutFullCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const order = await this.orderService.createOrder(userId, cart.id);
    const payResult = await this.orderService.payOrder(userId, order.id);

    const transaction = await this.prisma.transaction.findFirst({
      where: { orderId: order.id },
    });

    return {
      id: order.id,
      userId: order.userId,
      cartId: cart.id,
      totalAmount: order.totalAmount,
      transactionId: transaction?.id ?? "",
      status: payResult.status,
      createdAt: order.createdAt,
    };
  }

  async checkoutPartial(userId: string, cartItemIds: string[]) {
    if (cartItemIds.length === 0) {
      throw new Error("No items selected");
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const selectedItems = cart.cartItems.filter((i) => cartItemIds.includes(i.id));
    if (selectedItems.length !== cartItemIds.length) {
      throw new Error("Some selected items not found in cart");
    }

    const totalAmount = selectedItems.reduce((sum, i) => sum + i.priceAtTime, 0);
    const courseIds = selectedItems.map((i) => i.courseId);

    const order = await this.prisma.order.create({
      data: {
        userId,
        cartId: cart.id,
        totalAmount,
      },
    });

    await this.orderService.payOrderPartial(
      userId,
      order.id,
      courseIds,
      cartItemIds
    );

    const transaction = await this.prisma.transaction.findFirst({
      where: { orderId: order.id },
    });

    return {
      id: order.id,
      userId: order.userId,
      cartId: cart.id,
      totalAmount: order.totalAmount,
      transactionId: transaction?.id ?? "",
      status: "PAID",
      createdAt: order.createdAt,
    };
  }

  async directBuy(userId: string, courseId: string) {
    const course = await getCourseById(courseId);
    if (!course || course.price <= 0) {
      throw new Error("Course not found or invalid price");
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { cartItems: true },
      });
    }

    // Reuse existing cart item if user double-clicked Buy Now — prevents
    // duplicate orders / payment race on rapid clicks.
    let cartItem = cart.cartItems.find((i) => i.courseId === courseId);
    if (!cartItem) {
      cartItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          courseId,
          priceAtTime: course.price,
        },
      });
    }

    return this.checkoutPartial(userId, [cartItem.id]);
  }
}
