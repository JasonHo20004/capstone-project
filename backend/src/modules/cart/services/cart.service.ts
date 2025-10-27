import { CartRepository } from "@/modules/cart/repositories/cart.repository";
import type { CartItem } from "@/../generated/prisma";
import { CourseRepository } from "@/modules/courses/repositories/course.repository";

export class CartService {
  private cartRepository = new CartRepository();
  private courseRepository = new CourseRepository();
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
}
