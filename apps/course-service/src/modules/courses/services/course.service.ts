// =============================================================================
// Course Service - Business logic for course operations
// =============================================================================

import { CourseRepository } from "../repositories/course.repository.js";
import { identityClient } from "../../../clients/identity.client.js";
import { notificationClient } from "../../../clients/notification.client.js";
import { databaseService } from "../../../services/database.service.js";
import { EventBusService, EventNames, getPaginationMeta } from "@capstone/common";
import type { CreateCourseInput, UpdateCourseInput, GetCoursesQuery, CourseResponse } from "../dtos/course.dto.js";
import type { CourseStatus, Prisma } from "../../../../generated/prisma/index.js";

export class CourseService {
  private courseRepository = new CourseRepository();
  private eventBus: EventBusService;

  constructor() {
    this.eventBus = EventBusService.getInstance("course-service");
  }

  async getById(id: string): Promise<CourseResponse | null> {
    const course = await this.courseRepository.findById(id);
    if (!course) return null;

    // Fetch seller info from Identity Service
    const seller = await identityClient.getUserBasicInfo(course.courseSellerId);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      sellerName: seller?.fullName,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: course.lessons.length,
      createdAt: course.createdAt,
    };
  }

  async create(sellerId: string, input: CreateCourseInput): Promise<CourseResponse> {
    const course = await this.courseRepository.create({
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      courseLevel: input.courseLevel as any,
      thumbnailUrl: input.thumbnailUrl,
      courseSellerId: sellerId,
      status: "DRAFT" as CourseStatus,
    });

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: 0,
      createdAt: course.createdAt,
    };
  }

  async update(id: string, sellerId: string, input: UpdateCourseInput): Promise<CourseResponse> {
    const existing = await this.courseRepository.findById(id);
    
    if (!existing) {
      throw new Error("Course not found");
    }

    if (existing.courseSellerId !== sellerId) {
      throw new Error("Not authorized to update this course");
    }

    const course = await this.courseRepository.update(id, {
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      courseLevel: input.courseLevel as any,
      thumbnailUrl: input.thumbnailUrl,
      status: input.status as CourseStatus,
    });

    const result: CourseResponse = {
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: existing.lessons.length,
      createdAt: course.createdAt,
    };

    // Notify enrolled users about course update (only for active courses with meaningful changes)
    if (existing.status === "ACTIVE" && (input.title || input.description || input.price !== undefined)) {
      this.notifyEnrolledUsers(id, existing.title, "Khóa học đã được cập nhật", `Khóa học "${existing.title}" vừa được cập nhật nội dung mới.`);
    }

    return result;
  }

  async publish(id: string, sellerId: string): Promise<CourseResponse> {
    const course = await this.update(id, sellerId, { status: "ACTIVE" });

    // Publish event for other services
    await this.eventBus.publish(EventNames.COURSE_PUBLISHED, {
      courseId: course.id,
      sellerId: course.courseSellerId,
      title: course.title,
      price: course.price,
    });

    return course;
  }

  async delete(id: string, sellerId: string): Promise<void> {
    const existing = await this.courseRepository.findById(id);
    
    if (!existing) {
      throw new Error("Course not found");
    }

    if (existing.courseSellerId !== sellerId) {
      throw new Error("Not authorized to delete this course");
    }

    await this.courseRepository.delete(id);

    await this.eventBus.publish(EventNames.COURSE_DELETED, {
      courseId: id,
      sellerId,
    });
  }

  async getMany(query: GetCoursesQuery) {
    const where: Prisma.CourseWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.level) {
      where.courseLevel = query.level;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.sellerId) {
      where.courseSellerId = query.sellerId;
    }

    const [courses, total] = await Promise.all([
      this.courseRepository.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where,
      }),
      this.courseRepository.count(where),
    ]);

    // Fetch seller names
    const sellerIds = [...new Set(courses.map((c) => c.courseSellerId))];
    const sellers = await identityClient.getUsersBasicInfo(sellerIds);

    const data = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      sellerName: sellers.get(course.courseSellerId)?.fullName,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: course.lessons.length,
      createdAt: course.createdAt,
    }));

    return {
      data,
      ...getPaginationMeta(total, query.page, query.limit),
    };
  }

  async getPublishedCourses(query: GetCoursesQuery) {
    // Show all ACTIVE (admin-approved / published) courses for user browsing
    const where: Prisma.CourseWhereInput = {
      status: "ACTIVE",
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.level) {
      where.courseLevel = query.level;
    }

    const [courses, total] = await Promise.all([
      this.courseRepository.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where,
      }),
      this.courseRepository.count(where),
    ]);

    // Fetch seller names
    const sellerIds = [...new Set(courses.map((c) => c.courseSellerId))];
    const sellers = await identityClient.getUsersBasicInfo(sellerIds);

    const data = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      sellerName: sellers.get(course.courseSellerId)?.fullName,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: course.lessons.length,
      createdAt: course.createdAt,
    }));

    return {
      data,
      ...getPaginationMeta(total, query.page, query.limit),
    };
  }

  async getMyCourses(sellerId: string, query: GetCoursesQuery) {
    return await this.getMany({ ...query, sellerId });
  }

  async getEnrolledCourses(userId: string) {
    const courses = await this.courseRepository.findEnrolledByUserId(userId);

    const sellerIds = [...new Set(courses.map((c) => c.courseSellerId))];
    const sellers = await identityClient.getUsersBasicInfo(sellerIds);

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      courseLevel: course.courseLevel,
      courseSellerId: course.courseSellerId,
      sellerName: sellers.get(course.courseSellerId)?.fullName,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      ratingCount: course.ratingCount,
      lessonCount: course.lessons.length,
      createdAt: course.createdAt,
    }));
  }

  async grantAccess(userId: string, courseId: string, transactionId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    
    if (!course) {
      throw new Error("Course not found");
    }

    // Create user activity record
    await this.courseRepository.update(courseId, {
      userActivities: {
        create: {
          userId,
          transactionId,
        },
      },
    });

    await this.eventBus.publish(EventNames.COURSE_ACCESS_GRANTED, {
      userId,
      courseId,
      orderId: transactionId,
      grantedAt: new Date(),
    });

    // Notify seller about new enrollment (fire-and-forget)
    notificationClient.createNotification({
      userId: course.courseSellerId,
      title: "Có học viên mới đăng ký khóa học",
      content: `Có một học viên mới đã đăng ký khóa học "${course.title}"`,
      type: "course_enrollment",
      courseId,
      metadata: { enrolledUserId: userId, transactionId },
    }).catch(err => console.error("[Course Service] Error sending enrollment notification:", err));
  }

  async setFinalTest(courseId: string, sellerId: string, testId: string): Promise<void> {
    const existing = await this.courseRepository.findById(courseId);
    if (!existing) throw new Error("Course not found");
    if (existing.courseSellerId !== sellerId) throw new Error("Not authorized");

    await this.courseRepository.update(courseId, { finalTestId: testId });
  }

  async removeFinalTest(courseId: string, sellerId: string): Promise<void> {
    const existing = await this.courseRepository.findById(courseId);
    if (!existing) throw new Error("Course not found");
    if (existing.courseSellerId !== sellerId) throw new Error("Not authorized");

    await this.courseRepository.update(courseId, { finalTestId: null });
  }

  async createLesson(courseId: string, sellerId: string, input: {
    title: string;
    description?: string;
    durationInSeconds?: number;
    lessonOrder?: number;
    materials?: string[];
    moduleId?: string;
    videoUrl?: string;
  }) {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.courseSellerId !== sellerId) throw new Error("Not authorized");

    const lesson = await this.courseRepository.createLesson({
      title: input.title,
      description: input.description,
      durationInSeconds: input.durationInSeconds,
      lessonOrder: input.lessonOrder,
      materials: input.materials,
      courseId,
      moduleId: input.moduleId,
      videoUrl: input.videoUrl,
    });

    // Notify enrolled users about new lesson (fire-and-forget)
    if (course.status === "ACTIVE") {
      this.notifyEnrolledUsers(courseId, course.title, "Bài học mới", `Khóa học "${course.title}" vừa thêm bài học mới: "${input.title}"`);
    }

    return lesson;
  }

  async getLessonById(courseId: string, lessonId: string) {
    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new Error("Lesson not found");
    }
    return lesson;
  }

  async updateLesson(courseId: string, lessonId: string, sellerId: string, input: {
    title?: string;
    description?: string;
    durationInSeconds?: number;
    lessonOrder?: number;
    materials?: string[];
    videoUrl?: string;
  }) {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.courseSellerId !== sellerId) throw new Error("Not authorized");

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) throw new Error("Lesson not found");

    const updatedLesson = await this.courseRepository.updateLesson(lessonId, input);

    // Notify enrolled users about lesson update (fire-and-forget)
    if (course.status === "ACTIVE") {
      this.notifyEnrolledUsers(courseId, course.title, "Bài học đã được cập nhật", `Bài học "${lesson.title}" trong khóa học "${course.title}" vừa được cập nhật.`);
    }

    return updatedLesson;
  }

  // ============== Helper: Notify enrolled users ==============

  private async notifyEnrolledUsers(courseId: string, courseTitle: string, title: string, content: string): Promise<void> {
    try {
      const prisma = databaseService.getClient();
      const enrolledUsers = await prisma.userActivity.findMany({
        where: { courseId },
        select: { userId: true },
      });

      const userIds = [...new Set(enrolledUsers.map((u: { userId: string }) => u.userId))];
      if (userIds.length === 0) return;

      await notificationClient.createBulkNotifications({
        userIds,
        title,
        content,
        type: "course_update",
        metadata: { courseId },
      });
    } catch (err) {
      console.error("[Course Service] Error sending course update notifications:", err);
    }
  }
}
