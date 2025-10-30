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
    const existingCourse = await this.courseRepository.findById(
      cartItemData.courseId
    );
    if (!existingCourse) {
      throw Error("Course is not exitst");
    }
    const priceAtTime = parseFloat(existingCourse.price.toString());

    const exitsingCart = await this.cartRepository.findCartByUserId(userId);
    if (!exitsingCart) {
      throw Error("Cart is not exist");
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
    // Update create

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

        const activitiesToCreate = exitsingCart.cartItems.map((item) => ({
          userId: userId,
          courseId: item.courseId,
          transactionId: transaction.id,
        }));

        await this.userActivityRepository.createMany_InTx(
          activitiesToCreate,
          tx
        );

        const cartItemIds =exitsingCart.cartItems.map((item)=>(item.id))
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
    const existingCourse = await this.courseRepository.findById(courseId);
    if (!existingCourse) {
      throw Error("Course is not exitst");
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
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      throw Error('Can not find cart')
    }

    // Find item in cart (use cartItem id)
    const itemsToCheckout = await this.cartRepository.findItemsByIds_InCart(
      cart.id,
      cartItemIds
    );

    // Validate length 
    
    if (itemsToCheckout.length !== cartItemIds.length) {
      throw Error("Having some item is not available in cart")
    }

    // Total
    const totalAmount = itemsToCheckout.reduce(
      (sum, item) => sum + item.priceAtTime,
      0
    );
    const totalAmountFloat =parseFloat(totalAmount.toString());

    // Check wallet
    const wallet = await this.walletRepository.findWalletById(userId);
    if (!wallet || parseFloat(wallet.allowance.toString())<totalAmountFloat) {
      throw Error("Your allowance is not enough");
    }
    try {
      return databaseService.transaction(async (tx) => {
        
        const order = await this.orderRepository.createOrder_InTx(
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
            orderId: order.id
          },
          tx
        );

      
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
}
