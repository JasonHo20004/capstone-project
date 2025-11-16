import { databaseService } from '@/services/database.service';

export interface CompletionAnalytics {
  courseId: string;
  totalEnrolled: number;
  completedCount: number;
  completionRate: number;
}

export class AnalyticsService {
  private prisma = databaseService.getClient();

  async getCompletionRate(courseId: string): Promise<CompletionAnalytics> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: { id: true },
        },
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const enrolledStudents = await this.prisma.userActivity.findMany({
      where: {
        courseId,
        expiresAt: {
          gt: new Date(), // Only active enrollments
        },
      },
      select: {
        userId: true,
      },
    });

    const totalEnrolled = enrolledStudents.length;

    if (totalEnrolled === 0) {
      return {
        courseId,
        totalEnrolled: 0,
        completedCount: 0,
        completionRate: 0,
      };
    }

    const totalLessons = course.lessons.length;

    if (totalLessons === 0) {
      return {
        courseId,
        totalEnrolled,
        completedCount: 0,
        completionRate: 0,
      };
    }

    const userIds = enrolledStudents.map((s) => s.userId);
    const userLessons = await this.prisma.userLesson.findMany({
      where: {
        userId: { in: userIds },
        lesson: {
          courseId,
        },
      },
      select: {
        userId: true,
        lessonId: true,
      },
    });

    const lessonCountsByUser = new Map<string, number>();
    userLessons.forEach((ul) => {
      const count = lessonCountsByUser.get(ul.userId) || 0;
      lessonCountsByUser.set(ul.userId, count + 1);
    });

    let completedCount = 0;
    lessonCountsByUser.forEach((count) => {
      if (count === totalLessons) {
        completedCount++;
      }
    });

    const completionRate = totalEnrolled > 0 
      ? Math.round((completedCount / totalEnrolled) * 100 * 100) / 100
      : 0;

    return {
      courseId,
      totalEnrolled,
      completedCount,
      completionRate,
    };
  }

  /**
   * Mock export service - generates a download URL for CSV or PDF
   */
  async exportCompletionReport(
    courseId: string,
    format: 'csv' | 'pdf'
  ): Promise<{ downloadUrl: string; filename: string }> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    const courseTitle = course?.title || 'Course';
    const sanitizedTitle = courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${sanitizedTitle}_completion_${timestamp}.${format}`;

    // Mock download URL - in production, this would generate the actual file
    const downloadUrl = `/api/exports/${courseId}/completion.${format}?token=${Date.now()}`;

    return {
      downloadUrl,
      filename,
    };
  }
}

