// =============================================================================
// Order Service - Business logic for order operations
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import { WalletService } from "../../wallet/services/wallet.service.js";
import { CommissionService } from "../../commission/services/commission.service.js";
import { getCourseById } from "../../../clients/course.client.js";
import { EventBusService, EventNames } from "@capstone/common";

export class OrderService {
  private prisma = databaseService.getClient();
  private walletService = new WalletService();
  private commissionService = new CommissionService();
  private eventBus: EventBusService;

  constructor() {
    this.eventBus = EventBusService.getInstance("payment-service");
  }

  async createOrder(userId: string, cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: true },
    });

    if (!cart || cart.userId !== userId) {
      throw new Error("Cart not found");
    }

    if (cart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = cart.cartItems.reduce((sum, item) => sum + Number(item.priceAtTime), 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        cartId,
        totalAmount,
      },
    });

    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: cart.cartItems,
    };
  }

  async payOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        cart: { include: { cartItems: true } },
        transaction: true,
      },
    });

    if (!order || order.userId !== userId) {
      throw new Error("Order not found");
    }

    if (order.transaction) {
      throw new Error("Order already paid");
    }

    // Deduct from wallet
    await this.walletService.deduct(
      userId,
      Number(order.totalAmount),
      `Payment for order ${orderId}`,
      orderId
    );

    // Extract course IDs from cart items
    const courseIds = order.cart.cartItems.map((item) => item.courseId);

    // Revenue split for each course
    for (const courseId of courseIds) {
      try {
        const course = await getCourseById(courseId);
        if (course?.courseSellerId) {
          await this.commissionService.processRevenueSplit({
            orderId,
            courseId,
            sellerId: course.courseSellerId,
            buyerId: userId,
            coursePrice: course.price,
          });
        }
      } catch (err) {
        console.error(`⚠️ Revenue split failed for course ${courseId}:`, err);
      }
    }

    // Publish payment success event
    await this.eventBus.publish(EventNames.ORDER_PAID, {
      userId,
      orderId,
      courseIds,
      totalAmount: order.totalAmount,
    });

    // Clear the cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: order.cartId },
    });

    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: "PAID",
      courseIds,
    };
  }

  async payOrderPartial(
    userId: string,
    orderId: string,
    courseIds: string[],
    cartItemIdsToRemove: string[]
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { transaction: true },
    });

    if (!order || order.userId !== userId) {
      throw new Error("Order not found");
    }

    if (order.transaction) {
      throw new Error("Order already paid");
    }

    await this.walletService.deduct(
      userId,
      Number(order.totalAmount),
      `Payment for order ${orderId}`,
      orderId
    );

    // Revenue split for each course
    for (const courseId of courseIds) {
      try {
        const course = await getCourseById(courseId);
        if (course?.courseSellerId) {
          await this.commissionService.processRevenueSplit({
            orderId,
            courseId,
            sellerId: course.courseSellerId,
            buyerId: userId,
            coursePrice: course.price,
          });
        }
      } catch (err) {
        console.error(`⚠️ Revenue split failed for course ${courseId}:`, err);
      }
    }

    await this.eventBus.publish(EventNames.ORDER_PAID, {
      userId,
      orderId,
      courseIds,
      totalAmount: order.totalAmount,
    });

    await this.prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIdsToRemove } },
    });

    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: "PAID",
      courseIds,
    };
  }

  async getOrderHistory(userId: string, page: number = 1, limit: number = 10) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          transaction: true,
          cart: { include: { cartItems: true } },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map((order) => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.transaction ? "PAID" : "PENDING",
        createdAt: order.createdAt,
        itemCount: order.cart.cartItems.length,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
