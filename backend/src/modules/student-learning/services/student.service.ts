import { StudentRepository } from "@/modules/student-learning/repositories/student.repository";

export interface LessonPlayerResponse {
  id: string;
  title: string;
  description: string | null;
  durationInSeconds: number | null;
  lessonOrder: number | null;
  courseId: string;
  courseTitle: string;
  mediaAssets: {
    id: string;
    assetType: string;
    assetUrl: string;
  }[];
  recentComments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      fullName: string;
      profilePicture: string | null;
    };
  }[];
}

export interface SyllabusItem {
  id: string;
  title: string;
  description: string | null;
  durationInSeconds: number | null;
  lessonOrder: number | null;
  materials: string[];
  commentCount: number | null;
  isCompleted?: boolean;
}

export interface CourseContextResponse {
  course: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    courseLevel: string | null;
    instructor: {
      id: string;
      fullName: string;
      profilePicture: string | null;
    };
    totalLessons: number;
    totalRatings: number;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
  };
  syllabus: SyllabusItem[];
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  parentCommentId: string | null;
  user: {
    id: string;
    fullName: string;
    profilePicture: string | null;
  };
}

export interface RatingResponse {
  id: string;
  score: number;
  content: string | null;
  createdAt: Date;
  replyContent: string | null;
  repliedAt: Date | null;
  user: {
    id: string;
    fullName: string;
    profilePicture: string | null;
  };
}

export class StudentService {
  private studentRepository = new StudentRepository();

  /**
   * Get lesson details for the lesson player (enrolled students only)
   */
  async getLessonForPlayer(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<LessonPlayerResponse> {
    // Verify enrollment
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new Error("Not enrolled in this course");
    }

    // Verify lesson belongs to course
    const belongsToCourse = await this.studentRepository.verifyLessonBelongsToCourse(
      lessonId,
      courseId
    );
    if (!belongsToCourse) {
      throw new Error("Lesson does not belong to this course");
    }

    // Get lesson with media assets
    const lesson = await this.studentRepository.getLessonWithMedia(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Mark lesson as viewed/started (optional tracking)
    await this.studentRepository.markLessonCompleted(userId, lessonId);

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      durationInSeconds: lesson.durationInSeconds,
      lessonOrder: lesson.lessonOrder,
      courseId: lesson.course.id,
      courseTitle: lesson.course.title,
      mediaAssets: (lesson.mediaAssets ?? []).map((ma) => ({
        id: ma.id,
        assetType: ma.assetType,
        assetUrl: ma.assetUrl,
      })),
      recentComments: (lesson.comments ?? []).map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
          id: c.user.id,
          fullName: c.user.fullName,
          profilePicture: c.user.profilePicture,
        },
      })),
    };
  }

  /**
   * Get course syllabus (structured tree of lessons)
   */
  async getCourseSyllabus(
    userId: string,
    courseId: string
  ): Promise<SyllabusItem[]> {
    // Check if user is enrolled (optional - could allow preview for non-enrolled)
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    
    const lessons = await this.studentRepository.getCourseSyllabus(courseId);
    
    if (lessons.length === 0) {
      throw new Error("Course not found or has no lessons");
    }

    // Get completed lessons if enrolled
    let completedLessonIds: string[] = [];
    if (isEnrolled) {
      completedLessonIds = await this.studentRepository.getUserCompletedLessons(
        userId,
        courseId
      );
    }

    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      durationInSeconds: lesson.durationInSeconds,
      lessonOrder: lesson.lessonOrder,
      materials: lesson.materials,
      commentCount: lesson.commentCount,
      isCompleted: completedLessonIds.includes(lesson.id),
    }));
  }

  /**
   * Get comprehensive course context (overview, progress, syllabus)
   */
  async getCourseContext(
    userId: string,
    courseId: string
  ): Promise<CourseContextResponse> {
    // Verify enrollment
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new Error("Not enrolled in this course");
    }

    const course = await this.studentRepository.getCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const syllabus = await this.studentRepository.getCourseSyllabus(courseId);
    const completedLessonIds = await this.studentRepository.getUserCompletedLessons(
      userId,
      courseId
    );

    const totalLessons = syllabus.length;
    const completedLessons = completedLessonIds.length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        instructor: {
          id: course.user.id,
          fullName: course.user.fullName,
          profilePicture: course.user.profilePicture,
        },
        totalLessons: course._count.lessons,
        totalRatings: course._count.ratings,
      },
      progress: {
        completedLessons,
        totalLessons,
        progressPercentage,
      },
      syllabus: syllabus.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        durationInSeconds: lesson.durationInSeconds,
        lessonOrder: lesson.lessonOrder,
        materials: lesson.materials,
        commentCount: lesson.commentCount,
        isCompleted: completedLessonIds.includes(lesson.id),
      })),
    };
  }

  /**
   * Get lesson comments with pagination
   */
  async getLessonComments(
    userId: string,
    courseId: string,
    lessonId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ comments: CommentResponse[]; total: number; page: number; limit: number }> {
    // Verify enrollment
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new Error("Not enrolled in this course");
    }

    // Verify lesson belongs to course
    const belongsToCourse = await this.studentRepository.verifyLessonBelongsToCourse(
      lessonId,
      courseId
    );
    if (!belongsToCourse) {
      throw new Error("Lesson does not belong to this course");
    }

    const { comments, total } = await this.studentRepository.getLessonComments(
      lessonId,
      page,
      limit
    );

    return {
      comments: comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        parentCommentId: c.parentCommentId,
        user: {
          id: c.user.id,
          fullName: c.user.fullName,
          profilePicture: c.user.profilePicture,
        },
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * Create a comment on a lesson
   */
  async createLessonComment(
    userId: string,
    courseId: string,
    lessonId: string,
    content: string,
    parentCommentId?: string
  ): Promise<CommentResponse> {
    // Verify enrollment
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new Error("Not enrolled in this course");
    }

    // Verify lesson belongs to course
    const belongsToCourse = await this.studentRepository.verifyLessonBelongsToCourse(
      lessonId,
      courseId
    );
    if (!belongsToCourse) {
      throw new Error("Lesson does not belong to this course");
    }

    if (!content || content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    const createData: {
      content: string;
      userId: string;
      lessonId: string;
      parentCommentId?: string;
    } = {
      content: content.trim(),
      userId,
      lessonId,
    };
    
    if (parentCommentId) {
      createData.parentCommentId = parentCommentId;
    }

    const comment = await this.studentRepository.createComment(createData);

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      parentCommentId: comment.parentCommentId,
      user: {
        id: comment.user.id,
        fullName: comment.user.fullName,
        profilePicture: comment.user.profilePicture,
      },
    };
  }

  /**
   * Get course ratings (publicly accessible)
   */
  async getCourseRatings(
    courseId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    ratings: RatingResponse[];
    total: number;
    averageScore: number;
    page: number;
    limit: number;
  }> {
    const { ratings, total, averageScore } =
      await this.studentRepository.getCourseRatings(courseId, page, limit);

    return {
      ratings: ratings.map((r) => ({
        id: r.id,
        score: r.score,
        content: r.content,
        createdAt: r.createdAt,
        replyContent: r.replyContent,
        repliedAt: r.repliedAt,
        user: {
          id: r.user.id,
          fullName: r.user.fullName,
          profilePicture: r.user.profilePicture,
        },
      })),
      total,
      averageScore,
      page,
      limit,
    };
  }

  /**
   * Create a rating for a course (verified purchasers only)
   */
  async createCourseRating(
    userId: string,
    courseId: string,
    score: number,
    content?: string
  ): Promise<RatingResponse> {
    // Verify purchase (enrollment)
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new Error("You must purchase this course to rate it");
    }

    // Check if already rated
    const hasRated = await this.studentRepository.hasUserRatedCourse(userId, courseId);
    if (hasRated) {
      throw new Error("You have already rated this course");
    }

    // Validate score
    if (score < 1 || score > 5) {
      throw new Error("Rating score must be between 1 and 5");
    }

    const createData: {
      score: number;
      content?: string;
      userId: string;
      courseId: string;
    } = {
      score,
      userId,
      courseId,
    };

    if (content) {
      createData.content = content.trim();
    }

    const rating = await this.studentRepository.createRating(createData);

    return {
      id: rating.id,
      score: rating.score,
      content: rating.content,
      createdAt: rating.createdAt,
      replyContent: rating.replyContent,
      repliedAt: rating.repliedAt,
      user: {
        id: rating.user.id,
        fullName: rating.user.fullName,
        profilePicture: rating.user.profilePicture,
      },
    };
  }

  /**
   * Get user's enrolled courses
   */
  async getUserEnrolledCourses(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const { courses, total } = await this.studentRepository.getUserEnrolledCourses(
      userId,
      page,
      limit
    );

    return {
      courses,
      total,
      page,
      limit,
    };
  }

  /**
   * Mark a lesson as completed
   */
  async markLessonAsCompleted(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<{ success: boolean; message: string }> {
    // Verify enrollment
    const isEnrolled = await this.studentRepository.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new Error("Not enrolled in this course");
    }

    // Verify lesson belongs to course
    const belongsToCourse = await this.studentRepository.verifyLessonBelongsToCourse(
      lessonId,
      courseId
    );
    if (!belongsToCourse) {
      throw new Error("Lesson does not belong to this course");
    }

    await this.studentRepository.markLessonCompleted(userId, lessonId);

    return {
      success: true,
      message: "Lesson marked as completed",
    };
  }
}

