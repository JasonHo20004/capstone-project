import { databaseService } from "../../../services/database.service.js";
import type { Prisma } from "../../../../generated/prisma/index.js";

export class SellerStatsRepository {
  private db = databaseService;

  /**
   * Get seller's courses count
   */
  async getCoursesCount(sellerId: string): Promise<number> {
    return this.db.getClient().course.count({
      where: { courseSellerId: sellerId },
    });
  }

  /**
   * Get seller's unique learners count (users who bought seller's courses)
   */
  async getLearnersCount(sellerId: string): Promise<number> {
    const result = await this.db.getClient().userActivity.groupBy({
      by: ["userId"],
      where: {
        course: {
          courseSellerId: sellerId,
        },
      },
    });
    return result.length;
  }

  /**
   * Get seller's total comments count
   */
  async getCommentsCount(sellerId: string): Promise<number> {
    return this.db.getClient().comment.count({
      where: {
        lesson: {
          course: {
            courseSellerId: sellerId,
          },
        },
      },
    });
  }

  /**
   * Get seller's average rating
   */
  async getAverageRating(sellerId: string): Promise<number> {
    const result = await this.db.getClient().rating.aggregate({
      _avg: {
        score: true,
      },
      where: {
        course: {
          courseSellerId: sellerId,
        },
      },
    });
    return result._avg.score || 0;
  }

  /**
   * Get seller's learners with pagination.
   *
   * Returns one row per (userId, courseId) pair so two activities on the same
   * course collapse. Pagination, course filter, and identity-based search (via
   * userIds resolved by the service layer) are pushed down to Prisma.
   *
   * Sort:
   *   - 'date'   → orderBy createdAt
   *   - 'course' → orderBy course.title
   * Learner-name sort is not supported at the DB layer (cross-service) and is
   * left to the service layer if needed.
   */
  async getLearners(
    sellerId: string,
    page: number = 1,
    limit: number = 50,
    options?: {
      courseId?: string;
      userIds?: string[];
      sortBy?: "date" | "course";
      sortOrder?: "asc" | "desc";
    }
  ) {
    const skip = (page - 1) * limit;
    const sortOrder = options?.sortOrder === "asc" ? "asc" : "desc";
    const sortBy = options?.sortBy === "course" ? "course" : "date";

    const where: Prisma.UserActivityWhereInput = {
      course: {
        courseSellerId: sellerId,
        ...(options?.courseId ? { id: options.courseId } : {}),
      },
      ...(options?.userIds ? { userId: { in: options.userIds } } : {}),
    };

    const orderBy: Prisma.UserActivityOrderByWithRelationInput =
      sortBy === "course"
        ? { course: { title: sortOrder } }
        : { createdAt: sortOrder };

    const [data, total] = await Promise.all([
      this.db.getClient().userActivity.findMany({
        where,
        select: {
          id: true,
          userId: true,
          courseId: true,
          createdAt: true,
          course: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
            },
          },
        },
        distinct: ["userId", "courseId"],
        orderBy,
        skip,
        take: limit,
      }),
      this.db.getClient().userActivity.findMany({
        where,
        select: { userId: true, courseId: true },
        distinct: ["userId", "courseId"],
      }),
    ]);

    return {
      data,
      total: total.length,
      page,
      limit,
      totalPages: Math.ceil(total.length / limit),
    };
  }

  /**
   * Aggregate stats for the seller-learners page header cards.
   *   - uniqueCoursesCount: distinct seller-owned courses that have ≥1 learner
   *   - newThisWeekCount:   userActivities (distinct user+course) in the last 7 days
   * Independent of pagination so the FE can show stable totals.
   */
  async getLearnersAggregateStats(sellerId: string) {
    const prisma = this.db.getClient();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [uniqueCourses, newThisWeek] = await Promise.all([
      prisma.userActivity.findMany({
        where: { course: { courseSellerId: sellerId } },
        select: { courseId: true },
        distinct: ["courseId"],
      }),
      prisma.userActivity.findMany({
        where: {
          course: { courseSellerId: sellerId },
          createdAt: { gte: weekAgo },
        },
        select: { userId: true, courseId: true },
        distinct: ["userId", "courseId"],
      }),
    ]);

    return {
      uniqueCoursesCount: uniqueCourses.length,
      newThisWeekCount: newThisWeek.length,
    };
  }

  /**
   * Get seller's comments with pagination. Supports:
   *   - search: content substring match
   *   - courseId: filter to a single course
   *   - status:
   *       'all'        → no status filter
   *       'unanswered' → top-level student comments where the seller has not replied
   *       'answered'   → top-level student comments where the seller has replied
   *
   * Status semantics are evaluated **before** pagination so `total` / `totalPages`
   * reflect the entire filtered set, not just the current page. The Comment model
   * has no Prisma self-relation, so we resolve "has a seller reply" with a separate
   * batched query over the candidate top-level IDs (cheap — one round-trip).
   */
  async getComments(
    sellerId: string,
    page: number = 1,
    limit: number = 50,
    search?: string,
    options?: { courseId?: string; status?: "all" | "unanswered" | "answered" }
  ) {
    const prisma = this.db.getClient();
    const skip = (page - 1) * limit;
    const status = options?.status ?? "all";

    const baseWhere: Prisma.CommentWhereInput = {
      lesson: {
        course: {
          courseSellerId: sellerId,
          ...(options?.courseId ? { id: options.courseId } : {}),
        },
      },
      ...(search
        ? { content: { contains: search, mode: "insensitive" as Prisma.QueryMode } }
        : {}),
    };

    const commentSelect = {
      id: true,
      content: true,
      userId: true,
      createdAt: true,
      parentCommentId: true,
      lesson: {
        select: {
          id: true,
          title: true,
          course: { select: { id: true, title: true } },
        },
      },
    } satisfies Prisma.CommentSelect;

    // ─── Fast path: no status filter ─────────────────────────────────────
    if (status === "all") {
      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where: baseWhere,
          select: commentSelect,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.comment.count({ where: baseWhere }),
      ]);

      // Compute answeredSet only for top-level student comments on this page.
      const topLevelStudentIds = comments
        .filter((c) => !c.parentCommentId && c.userId !== sellerId)
        .map((c) => c.id);
      const answeredSet = await this.fetchAnsweredSet(topLevelStudentIds, sellerId);

      return {
        data: comments.map((c) => this.annotateComment(c, sellerId, answeredSet)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // ─── Status filter: resolve answered/unanswered at DB level ─────────
    // 1. Enumerate every top-level student comment matching baseWhere (id + date only).
    const candidates = await prisma.comment.findMany({
      where: {
        ...baseWhere,
        parentCommentId: null,
        userId: { not: sellerId },
      },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    const candidateIds = candidates.map((c) => c.id);
    const answeredSet = await this.fetchAnsweredSet(candidateIds, sellerId);

    // 2. Filter to the requested status (ordering preserved from step 1).
    const targets =
      status === "unanswered"
        ? candidates.filter((c) => !answeredSet.has(c.id))
        : candidates.filter((c) => answeredSet.has(c.id));

    const total = targets.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const pageIds = targets.slice(skip, skip + limit).map((c) => c.id);

    if (pageIds.length === 0) {
      return { data: [], total, page, limit, totalPages };
    }

    // 3. Fetch the page's full comments; preserve the createdAt-desc order.
    const pageRows = await prisma.comment.findMany({
      where: { id: { in: pageIds } },
      select: commentSelect,
    });
    const byId = new Map(pageRows.map((r) => [r.id, r]));
    const ordered = pageIds
      .map((id) => byId.get(id))
      .filter((c): c is (typeof pageRows)[number] => !!c);

    return {
      data: ordered.map((c) => this.annotateComment(c, sellerId, answeredSet)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Given top-level comment IDs, return the set of those that have at least
   * one reply from `sellerId`. Empty input → empty set.
   */
  private async fetchAnsweredSet(
    topLevelIds: string[],
    sellerId: string
  ): Promise<Set<string>> {
    if (topLevelIds.length === 0) return new Set();
    const replies = await this.db.getClient().comment.findMany({
      where: {
        parentCommentId: { in: topLevelIds },
        userId: sellerId,
      },
      select: { parentCommentId: true },
      distinct: ["parentCommentId"],
    });
    return new Set(
      replies.map((r) => r.parentCommentId).filter((x): x is string => !!x)
    );
  }

  /**
   * Compute the FE-facing flags for one comment row. Generic so the rest of
   * the fields (content, lesson, createdAt …) pass through unchanged.
   * `isAnswered` is null for non-top-level rows and for the seller's own
   * top-level comments.
   */
  private annotateComment<
    T extends { id: string; userId: string; parentCommentId: string | null }
  >(c: T, sellerId: string, answeredSet: Set<string>) {
    const isOwn = c.userId === sellerId;
    const isReply = !!c.parentCommentId;
    const isAnswered =
      c.parentCommentId || isOwn ? null : answeredSet.has(c.id);
    return { ...c, isOwn, isReply, isAnswered };
  }

  /**
   * Aggregate counts for the comments inbox header — total volume,
   * unanswered student threads (need seller action), seller's own replies.
   * Returned counts ignore the seller's own top-level comments (those
   * never need an "answered/unanswered" classification).
   */
  async getCommentsSummary(sellerId: string) {
    const prisma = this.db.getClient();

    const [topLevelStudent, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          parentCommentId: null,
          userId: { not: sellerId },
          lesson: { course: { courseSellerId: sellerId } },
        },
        select: { id: true },
      }),
      prisma.comment.count({
        where: {
          lesson: { course: { courseSellerId: sellerId } },
        },
      }),
    ]);

    if (topLevelStudent.length === 0) {
      return { total, unanswered: 0, answered: 0 };
    }

    const ids = topLevelStudent.map((c) => c.id);
    const sellerReplies = await prisma.comment.findMany({
      where: {
        parentCommentId: { in: ids },
        userId: sellerId,
      },
      select: { parentCommentId: true },
      distinct: ['parentCommentId'],
    });
    const answeredSet = new Set(
      sellerReplies.map((r) => r.parentCommentId).filter((x): x is string => !!x)
    );

    const answered = answeredSet.size;
    const unanswered = topLevelStudent.length - answered;
    return { total, unanswered, answered };
  }

  /**
   * Verify that a comment belongs to one of the seller's courses, then
   * delete it. Used by the seller-moderation endpoint.
   */
  async deleteCommentIfOwnedBySeller(sellerId: string, commentId: string) {
    const comment = await this.db.getClient().comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        lesson: { select: { course: { select: { courseSellerId: true } } } },
      },
    });
    if (!comment) throw Object.assign(new Error("Bình luận không tồn tại"), { statusCode: 404 });
    if (comment.lesson.course.courseSellerId !== sellerId) {
      throw Object.assign(new Error("Không có quyền xoá bình luận này"), { statusCode: 403 });
    }
    await this.db.getClient().comment.delete({ where: { id: commentId } });
    return { id: commentId };
  }

  /**
   * Top N courses of the seller ranked by buyer count (userActivities).
   * Used by the seller dashboard "Top Courses" widget.
   */
  async getTopCourses(sellerId: string, limit: number = 3) {
    return this.db.getClient().course.findMany({
      where: { courseSellerId: sellerId },
      select: {
        id: true,
        title: true,
        price: true,
        thumbnailUrl: true,
        ratingCount: true,
        status: true,
        _count: {
          select: { userActivities: true, ratings: true },
        },
      },
      orderBy: { userActivities: { _count: "desc" } },
      take: limit,
    });
  }

  /**
   * Get seller's courses with stats
   */
  async getSellerCourses(sellerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.db.getClient().course.findMany({
        where: { courseSellerId: sellerId },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          courseLevel: true,
          status: true,
          category: true,
          thumbnailUrl: true,
          createdAt: true,
          ratingCount: true,
          _count: {
            select: {
              lessons: true,
              ratings: true,
              userActivities: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.db.getClient().course.count({ where: { courseSellerId: sellerId } }),
    ]);

    return {
      data: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
