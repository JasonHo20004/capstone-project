import { databaseService } from "@/services/database.service";

export class StudentRepository {
  private prisma = databaseService.getClient();

  /**
   * Check if a user is enrolled in a course
   */
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.prisma.userActivity.findFirst({
      where: {
        userId,
        courseId,
      },
    });
    return !!enrollment;
  }

  /**
   * Get user's enrollment for a specific course
   */
  async getEnrollment(userId: string, courseId: string) {
    return this.prisma.userActivity.findFirst({
      where: {
        userId,
        courseId,
      },
    });
  }

  /**
   * Get course by ID with basic info (for enrolled students)
   */
  async getCourseById(courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePicture: true,
          },
        },
        lessons: {
          orderBy: { lessonOrder: "asc" },
          select: {
            id: true,
            title: true,
            description: true,
            durationInSeconds: true,
            lessonOrder: true,
          },
        },
        test: true,
        _count: {
          select: {
            lessons: true,
            ratings: true,
          },
        },
      },
    });
  }

  /**
   * Get lesson by ID with media assets (for enrolled students)
   */
  async getLessonWithMedia(lessonId: string) {
    return this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            courseSellerId: true,
          },
        },
        mediaAssets: {
          select: {
            id: true,
            assetType: true,
            assetUrl: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get course syllabus (structured tree of lessons)
   */
  async getCourseSyllabus(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { lessonOrder: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        durationInSeconds: true,
        lessonOrder: true,
        materials: true,
        commentCount: true,
        courseId: true,
      },
    });
  }

  /**
   * Get lesson comments with pagination
   */
  async getLessonComments(
    lessonId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { lessonId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              profilePicture: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where: { lessonId } }),
    ]);

    return { comments, total };
  }

  /**
   * Create a comment on a lesson
   */
  async createComment(data: {
    content: string;
    userId: string;
    lessonId: string;
    parentCommentId?: string;
  }) {
    const comment = await this.prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        lessonId: data.lessonId,
        parentCommentId: data.parentCommentId ?? null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });

    // Update comment count on lesson
    await this.prisma.lesson.update({
      where: { id: data.lessonId },
      data: {
        commentCount: { increment: 1 },
      },
    });

    return comment;
  }

  /**
   * Get course ratings with pagination
   */
  async getCourseRatings(
    courseId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [ratings, total, avgResult] = await Promise.all([
      this.prisma.rating.findMany({
        where: { courseId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              profilePicture: true,
            },
          },
        },
      }),
      this.prisma.rating.count({ where: { courseId } }),
      this.prisma.rating.aggregate({
        where: { courseId },
        _avg: { score: true },
      }),
    ]);

    return {
      ratings,
      total,
      averageScore: avgResult._avg.score ?? 0,
    };
  }

  /**
   * Check if user has already rated the course
   */
  async hasUserRatedCourse(userId: string, courseId: string): Promise<boolean> {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    return !!rating;
  }

  /**
   * Create a rating for a course
   */
  async createRating(data: {
    score: number;
    content?: string;
    userId: string;
    courseId: string;
  }) {
    const rating = await this.prisma.rating.create({
      data: {
        score: data.score,
        content: data.content ?? null,
        userId: data.userId,
        courseId: data.courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });

    // Update rating count on course
    await this.prisma.course.update({
      where: { id: data.courseId },
      data: {
        ratingCount: { increment: 1 },
      },
    });

    return rating;
  }

  /**
   * Get user's completed lessons for a course
   */
  async getUserCompletedLessons(userId: string, courseId: string): Promise<string[]> {
    const userLessons = await this.prisma.userLesson.findMany({
      where: {
        userId,
        lesson: {
          courseId,
        },
      },
      select: {
        lessonId: true,
      },
    });

    return userLessons.map((ul) => ul.lessonId);
  }

  /**
   * Mark a lesson as completed for a user
   */
  async markLessonCompleted(userId: string, lessonId: string): Promise<void> {
    await this.prisma.userLesson.upsert({
      where: {
        lessonId_userId: {
          lessonId,
          userId,
        },
      },
      create: {
        lessonId,
        userId,
      },
      update: {},
    });
  }

  /**
   * Get user's enrolled courses
   */
  async getUserEnrolledCourses(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.prisma.userActivity.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          course: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  profilePicture: true,
                },
              },
              _count: {
                select: {
                  lessons: true,
                  ratings: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.userActivity.count({ where: { userId } }),
    ]);

    const courses = activities.map((a) => a.course);

    return { courses, total };
  }

  /**
   * Verify lesson belongs to course
   */
  async verifyLessonBelongsToCourse(lessonId: string, courseId: string): Promise<boolean> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
      },
    });
    return !!lesson;
  }
}

