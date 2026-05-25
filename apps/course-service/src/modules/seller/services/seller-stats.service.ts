import { SellerStatsRepository } from "../repositories/seller-stats.repository.js";
import { identityClient } from "../../../clients/identity.client.js";
import { paymentClient } from "../../../clients/payment.client.js";
import { databaseService } from "../../../services/database.service.js";

export class SellerStatsService {
  private repository = new SellerStatsRepository();

  /**
   * Get seller dashboard statistics (aggregated, ready for FE rendering).
   * Includes:
   *   - counts (courses, learners, comments)
   *   - averageRating (1-5)
   *   - topCourses (max 3, ranked by enrollments)
   *   - financial summary from payment-service (earnings, withdrawals, MoM)
   */
  async getDashboardStats(sellerId: string) {
    const [coursesCount, learnersCount, commentsCount, averageRating, topCoursesRaw, financial] =
      await Promise.all([
        this.repository.getCoursesCount(sellerId),
        this.repository.getLearnersCount(sellerId),
        this.repository.getCommentsCount(sellerId),
        this.repository.getAverageRating(sellerId),
        this.repository.getTopCourses(sellerId, 3),
        paymentClient.getSellerFinancialSummary(sellerId),
      ]);

    const topCourses = topCoursesRaw.map((c) => ({
      id: c.id,
      title: c.title,
      price: Number(c.price),
      thumbnailUrl: c.thumbnailUrl,
      ratingCount: c.ratingCount,
      status: c.status,
      learners: c._count.userActivities,
      ratings: c._count.ratings,
    }));

    return {
      coursesCount,
      learnersCount,
      commentsCount,
      averageRating: Math.round(averageRating * 10) / 10,
      topCourses,
      financial: financial ?? {
        totalEarnings: 0,
        totalPending: 0,
        allowance: 0,
        pendingBalance: 0,
        pendingWithdrawalCount: 0,
        pendingWithdrawalTotal: 0,
        thisMonthNet: 0,
        prevMonthNet: 0,
      },
    };
  }

  /**
   * Get seller's learners with user enrichment.
   *   - `search`    → cross-service substring match on learner fullName/email
   *                   (resolved via identity-service before the DB query)
   *   - `courseId`  → filter to a single course
   *   - `sortBy`    → 'date' (default) | 'course'
   *   - `sortOrder` → 'desc' (default) | 'asc'
   * Also returns aggregate counts so the page can render stable header cards
   * (uniqueCoursesCount + newThisWeekCount) independent of pagination.
   */
  async getLearners(
    sellerId: string,
    page: number = 1,
    limit: number = 50,
    options?: {
      search?: string;
      courseId?: string;
      sortBy?: "date" | "course";
      sortOrder?: "asc" | "desc";
    }
  ) {
    // Pre-resolve userIds from identity-service when a search term is given.
    // No match → return an empty page early so we don't waste a DB round-trip.
    let userIdsFilter: string[] | undefined;
    if (options?.search && options.search.trim()) {
      const matched = await identityClient.searchUsersBasic(options.search.trim(), 500);
      userIdsFilter = matched.map((u) => u.id);
      if (userIdsFilter.length === 0) {
        const aggregate = await this.repository.getLearnersAggregateStats(sellerId);
        return {
          learners: [],
          pagination: { total: 0, page, limit, totalPages: 0 },
          stats: aggregate,
        };
      }
    }

    const [result, aggregate] = await Promise.all([
      this.repository.getLearners(sellerId, page, limit, {
        courseId: options?.courseId,
        userIds: userIdsFilter,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
      }),
      this.repository.getLearnersAggregateStats(sellerId),
    ]);

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
      stats: aggregate,
    };
  }

  /**
   * Get seller's comments. Adds optional courseId + status filters.
   */
  async getComments(
    sellerId: string,
    page: number = 1,
    limit: number = 50,
    search?: string,
    options?: { courseId?: string; status?: "all" | "unanswered" | "answered" }
  ) {
    const result = await this.repository.getComments(sellerId, page, limit, search, options);

    // Enrich with author identity (name / email / avatar) — same pattern as
    // getLearners. Batched in a single identity-service round-trip.
    const userIds = [...new Set(result.data.map((c) => c.userId))];
    const usersMap = await identityClient.getUsersBasicInfo(userIds);

    return {
      comments: result.data.map((comment) => {
        const user = usersMap.get(comment.userId);
        return {
          id: comment.id,
          content: comment.content,
          userId: comment.userId,
          userName: user?.fullName || "Người dùng",
          userEmail: user?.email || "",
          userProfilePicture: user?.profilePicture || null,
          lessonId: comment.lesson.id,
          lessonTitle: comment.lesson.title,
          courseId: comment.lesson.course.id,
          courseTitle: comment.lesson.course.title,
          createdAt: comment.createdAt,
          parentCommentId: (comment as any).parentCommentId ?? null,
          isOwn: (comment as any).isOwn ?? false,
          isReply: (comment as any).isReply ?? false,
          isAnswered: (comment as any).isAnswered ?? null,
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
   * Delete a comment on one of the seller's own courses. Throws if the
   * comment doesn't belong to this seller — verified inside the repository.
   */
  async deleteComment(sellerId: string, commentId: string) {
    return await this.repository.deleteCommentIfOwnedBySeller(sellerId, commentId);
  }

  /**
   * Comments-inbox summary (total / unanswered / answered) for the header
   * stat cards and filter counters.
   */
  async getCommentsSummary(sellerId: string) {
    return await this.repository.getCommentsSummary(sellerId);
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
   * Get seller's monthly earnings for a given year (12-month array).
   * Payment service now returns already-bucketed monthly data, so we just
   * normalize the shape here.
   */
  async getMonthlyFees(sellerId: string, year?: number) {
    const targetYear = year ?? new Date().getFullYear();
    const transactions = await paymentClient.getSellerTransactions(sellerId, targetYear);

    const fees = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const tx = transactions.find((t) => t.month === month);
      const grossAmount = tx?.grossAmount ?? 0;
      const gatewayFee = tx?.gatewayFee ?? 0;
      const platformFee = tx?.platformFee ?? 0;
      const sellerAmount = tx?.sellerAmount ?? (grossAmount - gatewayFee - platformFee);
      return {
        month,
        year: targetYear,
        grossAmount,
        gatewayFee,
        platformFee,
        // Fall through to (gross − gateway − platform) when payment-service
        // hasn't been redeployed yet so old responses still produce a sane net.
        netAmount: sellerAmount,
        salesCount: tx?.salesCount ?? 0,
      };
    });

    return { fees, year: targetYear };
  }

  /**
   * Drill-down: per-order detail for one (year, month) bucket. Enriches
   * each row with the course title so the FE doesn't have to do extra
   * lookups.
   */
  async getMonthlyFeeDetail(sellerId: string, year: number, month: number) {
    const rows = await paymentClient.getSellerMonthlyDetail(sellerId, year, month);
    if (rows.length === 0) return [];

    const courseIds = [...new Set(rows.map((r) => r.courseId))];
    const prisma = databaseService.getClient();
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, title: true },
    });
    const titleById = new Map(courses.map((c) => [c.id, c.title]));

    return rows.map((r) => ({
      ...r,
      courseTitle: titleById.get(r.courseId) ?? "(Đã xoá)",
    }));
  }
}
