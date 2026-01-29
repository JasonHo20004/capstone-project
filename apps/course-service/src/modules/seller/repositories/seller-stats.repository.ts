import { databaseService } from "../../../services/database.service.js";

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
   * Get seller's learners with pagination
   */
  async getLearners(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      course: {
        courseSellerId: sellerId,
      },
    };

    const allActivities = await this.db.getClient().userActivity.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by userId and courseId to get unique combinations
    const uniqueMap = new Map<string, (typeof allActivities)[0]>();
    for (const activity of allActivities) {
      const key = `${activity.userId}-${activity.courseId}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, activity);
      }
    }

    const uniqueActivities = Array.from(uniqueMap.values());
    const total = uniqueActivities.length;
    const paginatedActivities = uniqueActivities.slice(skip, skip + limit);

    return {
      data: paginatedActivities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get seller's comments with pagination
   */
  async getComments(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      lesson: {
        course: {
          courseSellerId: sellerId,
        },
      },
    };

    if (search) {
      where.content = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [comments, total] = await Promise.all([
      this.db.getClient().comment.findMany({
        where,
        select: {
          id: true,
          content: true,
          userId: true,
          createdAt: true,
          lesson: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.db.getClient().comment.count({ where }),
    ]);

    return {
      data: comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
