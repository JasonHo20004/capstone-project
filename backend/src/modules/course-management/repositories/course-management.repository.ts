import { databaseService } from "@/services/database.service";

export class CourseManagementRepository {
  private prisma = databaseService.getClient();

  public async findAllCourses() {
    return this.prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        courseLevel: true,
        courseSellerId: true,
        finalTestId: true,
        ratingCount: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
          },
        },
        ratings: {
          select: {
            score: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        courseLevel: true,
        courseSellerId: true,
        finalTestId: true,
        ratingCount: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePicture: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            description: true,
            durationInSeconds: true,
            lessonOrder: true,
            materials: true,
            commentCount: true,
          },
          orderBy: { lessonOrder: "asc" },
        },
        ratings: {
          select: {
            id: true,
            score: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                fullName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        test: {
          select: {
            id: true,
            title: true,
            durationInMinutes: true,
            totalScore: true,
            passingScore: true,
          },
        },
      },
    });
  }

  public async findCourseLessons(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        lessons: {
          select: {
            id: true,
            title: true,
            description: true,
            durationInSeconds: true,
            lessonOrder: true,
            materials: true,
            commentCount: true,
          },
          orderBy: { lessonOrder: "asc" },
        },
      },
    });
  }

  public async findCourseRatings(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        ratings: {
          select: {
            id: true,
            score: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                fullName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  public async findLessonById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        durationInSeconds: true,
        lessonOrder: true,
        materials: true,
        commentCount: true,
        courseId: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                fullName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  public async updateLesson(id: string, data: any) {
    return this.prisma.lesson.update({
      where: { id },
      data,
    });
  }

  public async deleteLesson(id: string) {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  public async findCommentById(id: string) {
    return this.prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        userId: true,
        lessonId: true,
        createdAt: true,
        parentCommentId: true,
      },
    });
  }

  public async deleteComment(id: string) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }

  public async updateCourse(id: string, data: any) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  public async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
