import { CartRepository } from "@/modules/cart/repositories/cart.repository";
import type { CartItem, Order } from "@/../generated/prisma";
import { CourseRepository } from "@/modules/courses/repositories/course.repository";
import { WalletRepository } from "@/modules/users/repositories/wallet.repository";
import { databaseService } from "@/services/database.service";
import { TransactionRepository } from "@/modules/transactions/repositories/transaction.repository";
import { OrderRepository } from "../repositories/order.repository";
import { UserActivityRepository } from "@/modules/users/repositories/userActivity.repository";
export class CartService {
  private cartRepository = new CartRepository();
  private courseRepository = new CourseRepository();
  private walletRepository = new WalletRepository();
  private orderRepository = new OrderRepository();
  private transactionRepository = new TransactionRepository();
  private userActivityRepository = new UserActivityRepository();
  public async addCourseToCart(
    userId: string,
    cartItemData: {
      courseId: string;
    }
  ): Promise<CartItem> {
    const existingCourse = await this.courseRepository.findCourseAvailableById(
      cartItemData.courseId
    );
    if (!existingCourse) {
      throw Error("Course is not exist or is Pending");
    }
    
    // Check if course has lessons
    const hasLessons = await this.courseRepository.hasLessons(cartItemData.courseId);
    if (!hasLessons) {
      throw new Error("Cannot enroll in a course with no lessons");
    }
    
    const existingActivity = await this.userActivityRepository.findActivity(
      userId,
      cartItemData.courseId
    );
    if (existingActivity) {
      throw new Error(
        `You have already possessed course ${existingCourse.title}.`
      );
    }
    const priceAtTime = parseFloat(existingCourse.price.toString());

    let exitsingCart = await this.cartRepository.findCartByUserId(userId);
    if (!exitsingCart) {
      // creaate cart
      exitsingCart = await this.cartRepository.createCart(userId);
    }

    const existingItem = await this.cartRepository.findCartItem(
      exitsingCart.id,
      cartItemData.courseId
    );
    if (existingItem) {
      throw Error("Course have already been in Cart");
    }

    const newCartItem = await this.cartRepository.createCartItem({
      cartId: exitsingCart.id,
      courseId: existingCourse.id,
      priceAtTime: priceAtTime,
    });
    return newCartItem;
  }

  public async checkoutCart(userId: string): Promise<Order> {
    const exitsingCart = await this.cartRepository.findCartWithItems(userId);
    if (!exitsingCart) {
      throw Error("Cart is not exist");
    }
    if (exitsingCart.cartItems.length === 0) {
      //create cart
      throw new Error("Your cart is empty");
    }
    
    for (const item of exitsingCart.cartItems) {
      const hasLessons = await this.courseRepository.hasLessons(item.courseId);
      if (!hasLessons) {
        const course = await this.courseRepository.findById(item.courseId);
        const courseTitle = course?.title || item.courseId;
        throw new Error(`Cannot enroll in course "${courseTitle}" - course has no lessons`);
      }
    }

    const wallet = await this.walletRepository.findWalletById(userId);
    const totalAmount = exitsingCart.cartItems.reduce(
      (sum, item) => sum + item.priceAtTime,
      0
    );
    if (!wallet || parseFloat(wallet.allowance.toString()) < totalAmount) {
      throw Error("Your allowance is not enough.");
    }

    try {
      return databaseService.transaction(async (tx) => {
        const order = await this.orderRepository.createOrder_InTx(
          {
            userId: userId,
            cartId: exitsingCart.id,
            totalAmount: totalAmount,
          },
          tx
        );

        // Decrease Balance
        await this.walletRepository.decrementBalance_InTx(
          wallet.id,
          totalAmount,
          tx
        );

        const transaction = await this.transactionRepository.createPayment_InTx(
          {
            walletId: wallet.id,
            amount: totalAmount,
            orderId: order.id,
          },
          tx
        );

        order.transactionId = transaction.id;

        const activitiesToCreate = exitsingCart.cartItems.map((item) => ({
          userId: userId,
          courseId: item.courseId,
          transactionId: transaction.id,
        }));

        await this.userActivityRepository.createMany_InTx(
          activitiesToCreate,
          tx
        );

        const cartItemIds = exitsingCart.cartItems.map((item) => item.id);
        // Delete item from cart
        await this.cartRepository.deleteItemsByIds_InTx(cartItemIds, tx);
        return order;
      });
    } catch (error: any) {
      throw Error("Fail to Check out ", error);
    }
  }
  public async directBuyCourse(
    userId: string,
    courseId: string
  ): Promise<Order> {
    const existingCourse = await this.courseRepository.findCourseAvailableById(
      courseId
    );
    if (!existingCourse) {
      throw Error("Course is not exist");
    }

    // Check if course has lessons
    const hasLessons = await this.courseRepository.hasLessons(courseId);
    if (!hasLessons) {
      throw new Error("Cannot enroll in a course with no lessons");
    }

    const existingActivity = await this.userActivityRepository.findActivity(
      userId,
      courseId
    );
    if (existingActivity) {
      throw new Error(
        `You have already possessed course ${existingCourse.title}.`
      );
    }
    const wallet = await this.walletRepository.findWalletById(userId);
    if (!wallet || wallet.allowance < existingCourse.price) {
      throw Error("Your allowance is not enough");
    }

    const coursePrice = parseFloat(existingCourse.price.toString());
    const exitsingCart = await this.cartRepository.findCartByUserId(userId);
    if (!exitsingCart) {
      throw Error("Cart is not exist");
    }
    try {
      return databaseService.transaction(async (tx) => {
        // Create  temp cart
        const tempCart = await this.cartRepository.createTempCart_InTx(tx);

        // add cart item to cart
        await this.cartRepository.addToTempCart_InTx({
          cartId: tempCart.id,
          courseId: existingCourse.id,
          priceAtTime: coursePrice,
        },
      tx);

        // Create temp order
        const newOrder = await this.orderRepository.createOrder_InTx(
          {
            userId: userId,
            cartId: tempCart.id,
            totalAmount: coursePrice,
          },
          tx
        );

        // decrease wallet
        await this.walletRepository.decrementBalance_InTx(
          wallet.id,
          coursePrice,
          tx
        );

        // Transaction
        const transaction = await this.transactionRepository.createPayment_InTx(
          {
            walletId: wallet.id,
            amount: coursePrice,
            orderId: newOrder.id,
          },
          tx
        );

        // User Activity
        await this.userActivityRepository.create_InTx(
          {
            userId: userId,
            courseId: courseId,
            transactionId: transaction.id,
          },
          tx
        );

        return newOrder;
      });
    } catch (error: any) {
      throw Error("Fail to Check out ", error);
    }
  }

  public async checkoutPartial(
    userId: string,
    cartItemIds: string[]
  ): Promise<Order> {
    let cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }
    // Find item in cart (use cartItem id)
    const itemsToCheckout = await this.cartRepository.findItemsByIds_InCart(
      cart.id,
      cartItemIds
    );

    // Validate length

    if (itemsToCheckout.length !== cartItemIds.length) {
      throw Error("Having some item is not available in cart");
    }

    for (const item of itemsToCheckout) {
      const hasLessons = await this.courseRepository.hasLessons(item.courseId);
      if (!hasLessons) {
        const course = await this.courseRepository.findById(item.courseId);
        const courseTitle = course?.title || item.courseId;
        throw new Error(`Cannot enroll in course "${courseTitle}" - course has no lessons`);
      }
    }

    // Total
    const totalAmount = itemsToCheckout.reduce(
      (sum, item) => sum + item.priceAtTime,
      0
    );
    const totalAmountFloat = parseFloat(totalAmount.toString());

    // Check wallet
    const wallet = await this.walletRepository.findWalletById(userId);
    if (!wallet || parseFloat(wallet.allowance.toString()) < totalAmountFloat) {
      throw Error("Your allowance is not enough");
    }
    try {
      return databaseService.transaction(async (tx) => {
        let order = await this.orderRepository.createOrder_InTx(
          {
            userId: userId,
            cartId: cart.id,
            totalAmount: totalAmountFloat,
          },
          tx
        );

        // Decrease wallet
        await this.walletRepository.decrementBalance_InTx(
          wallet.id,
          totalAmountFloat,
          tx
        );

        // Create transaction
        const transaction = await this.transactionRepository.createPayment_InTx(
          {
            walletId: wallet.id,
            amount: totalAmountFloat,
            orderId: order.id,
          },
          tx
        );
        order.transactionId = transaction.id;
        const activitiesToCreate = itemsToCheckout.map((item) => ({
          userId: userId,
          courseId: item.courseId,
          transactionId: transaction.id,
        }));
        await this.userActivityRepository.createMany_InTx(
          activitiesToCreate,
          tx
        );

        // Delete item from cart
        await this.cartRepository.deleteItemsByIds_InTx(cartItemIds, tx);

        return order;
      });
    } catch (error: any) {
      throw new Error(`Checkout fail: ${error.message}`);
    }
  }
  public async getUserCart(userId: string) {
    let cart = await this.cartRepository.findCartWithCourse(userId);

    if (!cart) {
      throw Error("Cart is not exist");
    }

    const totalAmount = (cart.cartItems || []).reduce(
      (sum, item) => sum + item.priceAtTime,
      0
    );

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      totalAmount: totalAmount,
      cartItems: cart.cartItems,
    };
  }
}
