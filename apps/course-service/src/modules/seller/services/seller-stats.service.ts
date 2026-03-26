import { SellerStatsRepository } from "../repositories/seller-stats.repository.js";
import { identityClient } from "../../../clients/identity.client.js";

export class SellerStatsService {
  private repository = new SellerStatsRepository();

  /**
   * Get seller dashboard statistics
   */
  async getDashboardStats(sellerId: string) {
    const [coursesCount, learnersCount, commentsCount, averageRating] = await Promise.all([
      this.repository.getCoursesCount(sellerId),
      this.repository.getLearnersCount(sellerId),
      this.repository.getCommentsCount(sellerId),
      this.repository.getAverageRating(sellerId),
    ]);

    return {
      coursesCount,
      learnersCount,
      commentsCount,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  /**
   * Get seller's learners with user enrichment
   */
  async getLearners(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const result = await this.repository.getLearners(sellerId, page, limit, search);

    // Enrich with user info from identity service
    const userIds = [...new Set(result.data.map((a) => a.userId))];
    const usersMap = await identityClient.getUsersBasicInfo(userIds);

    return {
      learners: result.data.map((activity) => {
        const user = usersMap.get(activity.userId);
        return {
          id: activity.id,
          userId: activity.userId,
          userName: user?.fullName || "Người dùng",
          email: user?.email || "",
          profilePicture: user?.profilePicture || null,
          courseId: activity.courseId,
          courseTitle: activity.course.title,
          courseThumbnail: activity.course.thumbnailUrl,
          purchasedAt: activity.createdAt,
        };
      }),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get seller's comments
   */
  async getComments(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const result = await this.repository.getComments(sellerId, page, limit, search);

    return {
      comments: result.data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        lessonId: comment.lesson.id,
        lessonTitle: comment.lesson.title,
        courseId: comment.lesson.course.id,
        courseTitle: comment.lesson.course.title,
        createdAt: comment.createdAt,
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get seller's courses with stats
   */
  async getMyCourses(sellerId: string, page: number = 1, limit: number = 10) {
    const result = await this.repository.getSellerCourses(sellerId, page, limit);

    return {
      courses: result.data.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        price: Number(course.price),
        level: course.courseLevel,
        status: course.status,
        category: course.category,
        thumbnailUrl: course.thumbnailUrl,
        createdAt: course.createdAt,
        stats: {
          lessonsCount: course._count.lessons,
          ratingsCount: course._count.ratings,
          learnersCount: course._count.userActivities,
          ratingCount: course.ratingCount || 0,
        },
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get seller's monthly subscription fees (placeholder - fee data lives in payment-service)
   */
  async getMonthlyFees(sellerId: string, page: number = 1, limit: number = 10) {
    // Placeholder: returns empty fees. Full implementation would integrate with payment-service
    // to fetch subscription contract payments for the seller.
    return {
      fees: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }
}
