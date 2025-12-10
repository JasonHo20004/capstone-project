import { databaseService } from '@/services/database.service';
import type { Rating } from '@prisma/client';

export interface RatingFilter {
  starRating?: number;
  startDate?: Date;
  endDate?: Date;
}

export class RatingService {
  private prisma = databaseService.getClient();

  async getCourseRatings(
    courseId: string,
    filters?: RatingFilter
  ): Promise<Rating[]> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      throw new Error('Khóa học không tồn tại');
    }

    const where: any = {
      courseId,
    };

    if (filters?.starRating !== undefined) {
      where.score = filters.starRating;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return this.prisma.rating.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async replyToRating(
    ratingId: string,
    replyContent: string
  ): Promise<Rating> {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new Error('Đánh giá không tồn tại');
    }

    if (!replyContent || replyContent.trim() === '') {
      throw new Error('Vui lòng nhập nội dung phản hồi');
    }

    return this.prisma.rating.update({
      where: { id: ratingId },
      data: {
        replyContent: replyContent.trim(),
        repliedAt: new Date(),
      },
    });
  }

  async reportRating(ratingId: string): Promise<Rating> {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new Error('Đánh giá không tồn tại');
    }

    if (rating.isReported) {
      throw new Error('Đánh giá này đã được báo cáo');
    }

    return this.prisma.rating.update({
      where: { id: ratingId },
      data: {
        isReported: true,
      },
    });
  }
}