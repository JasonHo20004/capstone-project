// =============================================================================
// Course Service - Business logic for course operations
// =============================================================================

import { CourseRepository } from "../repositories/course.repository.js";
import { identityClient } from "../../../clients/identity.client.js";
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
      lessonCount: existing.lessons.length,
      createdAt: course.createdAt,
    };
  }

  async publish(id: string, sellerId: string): Promise<CourseResponse> {
    const course = await this.update(id, sellerId, { status: "PUBLISHED" });

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
    return await this.getMany({ ...query, status: "PUBLISHED" });
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
          courseId,
        },
      },
    });

    await this.eventBus.publish(EventNames.COURSE_ACCESS_GRANTED, {
      userId,
      courseId,
      orderId: transactionId,
      grantedAt: new Date(),
    });
  }
}
