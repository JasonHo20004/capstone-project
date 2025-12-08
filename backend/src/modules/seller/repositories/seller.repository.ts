import { databaseService } from '@/services/database.service';
import { TransactionType, TransactionStatus } from '@prisma/client';

export class SellerRepository {
  private prisma = databaseService.getClient();

  /**
   * Get seller's courses count
   */
  async getCoursesCount(sellerId: string): Promise<number> {
    return this.prisma.course.count({
      where: { courseSellerId: sellerId }
    });
  }

  /**
   * Get seller's unique learners count (users who bought seller's courses)
   */
  async getLearnersCount(sellerId: string): Promise<number> {
    const result = await this.prisma.userActivity.groupBy({
      by: ['userId'],
      where: {
        course: {
          courseSellerId: sellerId
        },
        transaction: {
          status: TransactionStatus.SUCCESS
        }
      }
    });
    return result.length;
  }

  /**
   * Get seller's comments count (comments on seller's lessons)
   */
  async getCommentsCount(sellerId: string): Promise<number> {
    return this.prisma.comment.count({
      where: {
        lesson: {
          course: {
            courseSellerId: sellerId
          }
        }
      }
    });
  }

  /**
   * Get seller's subscription contract
   */
  async getSubscriptionContract(sellerId: string) {
    return this.prisma.subscriptionContract.findFirst({
      where: {
        courseSellerId: sellerId
      },
      include: {
        subscriptionPlan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get seller's learners with pagination
   */
  async getLearners(sellerId: string, page: number = 1, limit: number = 50, search?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      course: {
        courseSellerId: sellerId
      },
      transaction: {
        status: TransactionStatus.SUCCESS
      }
    };

    if (search) {
      where.OR = [
        {
          user: {
            fullName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          course: {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Get all user activities first, then group by userId and courseId
    const allActivities = await this.prisma.userActivity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePicture: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group by userId and courseId to get unique combinations
    const uniqueMap = new Map<string, typeof allActivities[0]>();
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
      totalPages: Math.ceil(total / limit)
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
          courseSellerId: sellerId
        }
      }
    };

    if (search) {
      where.AND = [
        {
          lesson: {
            course: {
              courseSellerId: sellerId
            }
          }
        },
        {
          content: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profilePicture: true
            }
          },
          lesson: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.comment.count({ where })
    ]);

    return {
      data: comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get seller's monthly fee transactions
   */
  async getMonthlyFees(sellerId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const where = {
      transactionType: TransactionType.MONTHLYFEE,
      subscriptionContract: {
        courseSellerId: sellerId,
      },
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          subscriptionContract: {
            include: {
              subscriptionPlan: {
                select: {
                  id: true,
                  name: true,
                  monthlyFee: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

