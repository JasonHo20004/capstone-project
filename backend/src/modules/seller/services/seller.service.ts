import { SellerRepository } from '../repositories/seller.repository';

export class SellerService {
  private repository = new SellerRepository();

  /**
   * Get seller dashboard statistics
   */
  async getDashboardStats(sellerId: string) {
    const [coursesCount, learnersCount, commentsCount, subscriptionContract] = await Promise.all([
      this.repository.getCoursesCount(sellerId),
      this.repository.getLearnersCount(sellerId),
      this.repository.getCommentsCount(sellerId),
      this.repository.getSubscriptionContract(sellerId)
    ]);

    return {
      coursesCount,
      learnersCount,
      commentsCount,
      subscription: subscriptionContract ? {
        planName: subscriptionContract.subscriptionPlan.name,
        monthlyFee: Number(subscriptionContract.subscriptionPlan.monthlyFee),
        status: subscriptionContract.status,
        expiresAt: subscriptionContract.expiresAt
      } : {
        planName: 'Chưa đăng ký',
        monthlyFee: 0,
        status: false,
        expiresAt: null
      }
    };
  }

  /**
   * Get seller's learners
   */
  async getLearners(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const result = await this.repository.getLearners(sellerId, page, limit, search);
    
    return {
      learners: result.data.map(activity => ({
        id: activity.id,
        userId: activity.userId,
        userName: activity.user.fullName,
        email: activity.user.email,
        courseId: activity.courseId,
        courseTitle: activity.course.title,
        purchasedAt: activity.createdAt
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    };
  }

  /**
   * Get seller's comments
   */
  async getComments(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const result = await this.repository.getComments(sellerId, page, limit, search);
    
    return {
      comments: result.data.map(comment => ({
        id: comment.id,
        content: comment.content,
        userName: comment.user.fullName,
        userEmail: comment.user.email,
        lessonId: comment.lessonId,
        lessonTitle: comment.lesson.title,
        courseId: comment.lesson.course.id,
        courseTitle: comment.lesson.course.title,
        createdAt: comment.createdAt
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    };
  }

  /**
   * Get seller's monthly fees
   */
  async getMonthlyFees(sellerId: string, page: number = 1, limit: number = 50) {
    const result = await this.repository.getMonthlyFees(sellerId, page, limit);
    
    return {
      fees: result.data.map(transaction => ({
        id: transaction.id,
        amount: Number(transaction.amount),
        status: transaction.status,
        createdAt: transaction.createdAt,
        description: transaction.description,
        planName: transaction.subscriptionContract?.subscriptionPlan?.name || '-'
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    };
  }
}

