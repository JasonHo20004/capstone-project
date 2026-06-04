// =============================================================================
// Course Service - Business logic for course operations
// =============================================================================

import { CourseRepository } from "../repositories/course.repository.js";
import { identityClient } from "../../../clients/identity.client.js";
import { paymentClient } from "../../../clients/payment.client.js";
import { assessmentClient } from "../../../clients/assessment.client.js";
import { databaseService } from "../../../services/database.service.js";
import { s3Service } from "../../../services/s3.service.js";
import { publishNotification, publishBulkNotification } from "../../../helpers/notification.helper.js";
import { EventBusService, EventNames, getPaginationMeta, ConflictError } from "@capstone/common";
import DOMPurify from "isomorphic-dompurify";
import type { CreateCourseInput, UpdateCourseInput, GetCoursesQuery, CourseResponse } from "../dtos/course.dto.js";
import type { CourseStatus, Prisma } from "../../../../generated/prisma/index.js";

export class CourseService {
  private courseRepository = new CourseRepository();
  private eventBus: EventBusService;

  constructor() {
    this.eventBus = EventBusService.getInstance("course-service");
  }

  /**
   * Throws if the seller is missing a CourseSellerProfile or has been deactivated.
   * Network error to identity-service is treated as fail-open to avoid taking
   * down course actions when identity-service is briefly unavailable.
   */
  private async assertActiveSeller(sellerId: string): Promise<void> {
    const status = await identityClient.getSellerStatus(sellerId);
    if (status === null) return; // fail-open on transport error
    if (!status.hasProfile) {
      throw Object.assign(new Error("You don't have a course-seller profile"), { statusCode: 403 });
    }
    if (!status.active) {
      throw Object.assign(new Error("Your seller account has been deactivated"), { statusCode: 403 });
    }
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
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        durationInSeconds: lesson.durationInSeconds,
        lessonOrder: lesson.lessonOrder,
        materials: lesson.materials,
        commentCount: lesson.commentCount,
        courseId: lesson.courseId,
        moduleId: lesson.moduleId,
        testId: lesson.testId,
      })),
      createdAt: course.createdAt,
      submittedAt: (course as any).submittedAt ?? null,
      approvedAt: (course as any).approvedAt ?? null,
      rejectedAt: (course as any).rejectedAt ?? null,
      rejectionReason: (course as any).rejectionReason ?? null,
      reviewedById: (course as any).reviewedById ?? null,
    };
  }

  async create(sellerId: string, input: CreateCourseInput): Promise<CourseResponse> {
    await this.assertActiveSeller(sellerId);
    const course = await this.courseRepository.create({
      title: input.title,
      description: input.description ? DOMPurify.sanitize(input.description, { ALLOWED_TAGS: [] }) : input.description,
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

    // Allowed seller transitions:
    //   DRAFT     → PENDING (send for review)
    //   PENDING   → DRAFT (cancel review)
    //   ACTIVE    → INACTIVE (pause)
    //   INACTIVE  → ACTIVE (re-enable, only if previously approved)
    //   REFUSE    → DRAFT or PENDING (revise + optionally resubmit in one step)
    // Admin uses the admin route for DRAFT/PENDING → ACTIVE/REFUSE.
    if (input.status && input.status !== existing.status) {
      const ALLOWED: Record<string, string[]> = {
        DRAFT: ["PENDING"],
        PENDING: ["DRAFT"],
        ACTIVE: ["INACTIVE"],
        INACTIVE: ["ACTIVE"],
        REFUSE: ["DRAFT", "PENDING"],
      };
      const allowed = ALLOWED[existing.status] ?? [];
      if (!allowed.includes(input.status)) {
        throw Object.assign(
          new Error(
            `Không thể chuyển trạng thái từ ${existing.status} sang ${input.status}`
          ),
          { statusCode: 400 }
        );
      }
    }

    const course = await this.courseRepository.update(id, {
      title: input.title,
      description: input.description ? DOMPurify.sanitize(input.description, { ALLOWED_TAGS: [] }) : input.description,
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

  /**
   * Submit a course for admin review. Transitions DRAFT or REFUSE → PENDING,
   * stamps submittedAt, records a CourseReviewHistory row, and emits
   * COURSE_SUBMITTED so admins can be notified. Idempotent enough — calling
   * twice from PENDING is rejected by the transition check inside update().
   */
  async publish(id: string, sellerId: string): Promise<CourseResponse> {
    await this.assertActiveSeller(sellerId);

    const existing = await this.courseRepository.findById(id);
    if (!existing) {
      throw Object.assign(new Error("Course not found"), { statusCode: 404 });
    }
    if (existing.courseSellerId !== sellerId) {
      throw Object.assign(new Error("Not authorized to submit this course"), { statusCode: 403 });
    }
    if (existing.status === "PENDING") {
      throw Object.assign(
        new Error("Khóa học đã được gửi và đang chờ duyệt"),
        { statusCode: 400 }
      );
    }
    if (existing.status === "ACTIVE") {
      throw Object.assign(
        new Error("Khóa học đã được duyệt, không cần gửi lại"),
        { statusCode: 400 }
      );
    }

    this.assertSubmittable(existing);

    const fromStatus = existing.status;
    const now = new Date();
    const prisma = databaseService.getClient();

    // Single transaction: flip status to PENDING, record submission timestamp,
    // and append the audit-log row so a crash between can't desync them.
    await prisma.$transaction([
      prisma.course.update({
        where: { id },
        data: {
          status: "PENDING",
          submittedAt: now,
          // Clear previous rejection metadata so the seller-facing UI doesn't
          // keep showing a stale "đã bị từ chối" banner after resubmission.
          rejectionReason: null,
          rejectedAt: null,
        },
      }),
      prisma.courseReviewHistory.create({
        data: {
          courseId: id,
          fromStatus: fromStatus as CourseStatus,
          toStatus: "PENDING" as CourseStatus,
          actorId: sellerId,
          actorRole: "seller",
        },
      }),
    ]);

    // Refetch through the standard projection so the response shape stays
    // consistent with getById.
    const refreshed = await this.getById(id);
    if (!refreshed) {
      throw new Error("Course disappeared during submit");
    }

    await this.eventBus.publish(EventNames.COURSE_SUBMITTED, {
      courseId: refreshed.id,
      sellerId: refreshed.courseSellerId,
      title: refreshed.title,
      submittedAt: now,
    });

    return refreshed;
  }

  /**
   * Server-side gate for the seller's "Gửi duyệt" action. Mirrors the
   * frontend checklist so a malicious or out-of-sync client can't submit
   * an incomplete course. Throws a single 400 with a Vietnamese message
   * listing every missing requirement so the FE can surface it in one toast.
   */
  private assertSubmittable(course: {
    title: string;
    description: string | null;
    price: any;
    courseLevel: string | null;
    thumbnailUrl: string | null;
    lessons: { id: string; durationInSeconds: number | null }[];
  }): void {
    const errors: string[] = [];

    if (!course.thumbnailUrl) errors.push("thiếu ảnh thumbnail");
    if (!course.description || course.description.trim().length < 20) {
      errors.push("mô tả khóa học cần ít nhất 20 ký tự");
    }
    if (course.price === null || course.price === undefined || Number(course.price) < 0) {
      errors.push("chưa đặt giá hợp lệ");
    }
    if (!course.courseLevel) errors.push("chưa chọn trình độ");
    if (!course.lessons || course.lessons.length === 0) {
      errors.push("cần ít nhất 1 bài học");
    } else if (course.lessons.length < 3) {
      errors.push("cần ít nhất 3 bài học");
    }
    // Block submissions where every lesson is empty (no video AND no quiz).
    const hasNonEmptyLesson = course.lessons.some(
      (l) => (l.durationInSeconds ?? 0) > 0 || (l as { testId?: string | null }).testId
    );
    if (course.lessons.length > 0 && !hasNonEmptyLesson) {
      errors.push("ít nhất 1 bài học cần có nội dung (video hoặc bài kiểm tra)");
    }

    if (errors.length > 0) {
      throw Object.assign(
        new Error(`Chưa đủ điều kiện gửi duyệt: ${errors.join("; ")}`),
        { statusCode: 400, missing: errors }
      );
    }
  }

  /**
   * Returns the full review-workflow history of a course (submission, approval,
   * rejection events) in chronological order. Seller-facing — only the course
   * owner can read this.
   */
  async getReviewHistory(courseId: string, requesterId: string) {
    const prisma = databaseService.getClient();
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseSellerId: true },
    });
    if (!course) {
      throw Object.assign(new Error("Course not found"), { statusCode: 404 });
    }
    if (course.courseSellerId !== requesterId) {
      throw Object.assign(new Error("Not authorized"), { statusCode: 403 });
    }
    return await prisma.courseReviewHistory.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
    });
  }

  async delete(id: string, sellerId: string): Promise<void> {
    const existing = await this.courseRepository.findById(id);

    if (!existing) {
      throw new Error("Course not found");
    }

    if (existing.courseSellerId !== sellerId) {
      throw new Error("Not authorized to delete this course");
    }

    // If the course was published (ACTIVE/PENDING), it may already have buyers.
    // Refund their earnings + revoke access BEFORE deleting, mirroring the admin
    // REFUSE/INACTIVE flow. Skipping this would leave money in seller's wallet for
    // a course that no longer exists.
    const HAD_BUYERS_STATUSES = new Set<string>(["ACTIVE", "PENDING"]);
    if (HAD_BUYERS_STATUSES.has(existing.status)) {
      try {
        const refund = await paymentClient.refundCourse(id, "course deleted by seller");
        console.log(
          `💸 [CourseService] Seller-delete refund: ${refund.refunded} earnings ` +
            `(${refund.totalRefunded}đ to ${refund.buyers} buyers) for course ${id}`
        );
      } catch (err) {
        console.error(
          `⚠️ [CourseService] refundCourse failed for seller-delete ${id}:`,
          err
        );
      }

      const prisma = databaseService.getClient();
      const revoked = await prisma.userActivity.deleteMany({ where: { courseId: id } });
      console.log(
        `🚫 [CourseService] Seller-delete revoked access for ${revoked.count} learners on course ${id}`
      );
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

    // Aggregate average rating per course — Rating has no `averageRating` column.
    const courseIds = courses.map((c) => c.id);
    const ratingAverages = courseIds.length
      ? await this.courseRepository.getAverageRatings(courseIds)
      : new Map<string, number>();

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
      averageRating: ratingAverages.get(course.id) ?? 0,
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

    publishNotification({
      userId: course.courseSellerId,
      title: "Có học viên mới đăng ký khóa học",
      content: `Có một học viên mới đã đăng ký khóa học "${course.title}"`,
      type: "course_enrollment",
      courseId,
      metadata: { enrolledUserId: userId, transactionId },
    });
  }

  async setFinalTest(courseId: string, sellerId: string, testId: string): Promise<void> {
    const existing = await this.courseRepository.findById(courseId);
    if (!existing) throw new Error("Course not found");
    if (existing.courseSellerId !== sellerId) throw new Error("Not authorized");

    // Guard: prevent silently overwriting an existing final test.
    // The frontend pre-check catches most cases; this is the authoritative server-side guard.
    if (existing.finalTestId && existing.finalTestId !== testId) {
      throw new ConflictError("Course already has a final test", {
        code: "FINAL_TEST_EXISTS",
        data: { finalTestId: existing.finalTestId },
      });
    }

    const test = await assessmentClient.getTest(testId, sellerId);
    if (!test) throw Object.assign(new Error("Test not found"), { statusCode: 404 });
    if (test.sellerId !== sellerId) throw Object.assign(new Error("Not authorized to use this test"), { statusCode: 403 });

    const previousTestId = existing.finalTestId;
    await this.courseRepository.update(courseId, { finalTestId: testId });

    // Sync the join table that drives `_count.courseTests` on the seller's
    // test list — without this the page shows "Chưa liên kết với khoá nào".
    try {
      await assessmentClient.linkCourseTest(testId, courseId, sellerId);
    } catch (err) {
      console.warn(`[CourseService] Failed to sync course-test link for ${testId}:`, err);
    }

    // If we just replaced an older final test, hard-delete the orphan so it
    // doesn't linger in /seller/tests as a phantom the seller no longer
    // recognises. Best-effort — failure here doesn't roll back the link.
    // The cascade on test deletion also clears the previous CourseTest row.
    if (previousTestId && previousTestId !== testId) {
      try {
        await assessmentClient.deleteTest(previousTestId, sellerId);
      } catch (err) {
        console.warn(
          `[CourseService] Failed to clean up replaced final test ${previousTestId}:`,
          err
        );
      }
    }
  }

  /**
   * One-shot backfill: walk all courses owned by `sellerId`, and for every
   * finalTestId + every lesson.testId, push a CourseTest link to assessment
   * service. Idempotent. Used to repair legacy data where links were created
   * before course-test sync existed.
   */
  async syncCourseTestsForSeller(sellerId: string): Promise<{ linked: number }> {
    const prisma = databaseService.getClient();
    const courses = await prisma.course.findMany({
      where: { courseSellerId: sellerId },
      select: {
        id: true,
        finalTestId: true,
        lessons: { select: { testId: true }, where: { testId: { not: null } } },
      },
    });

    let linked = 0;
    for (const c of courses) {
      const testIds = new Set<string>();
      if (c.finalTestId) testIds.add(c.finalTestId);
      for (const l of c.lessons) {
        if (l.testId) testIds.add(l.testId);
      }
      for (const testId of testIds) {
        try {
          await assessmentClient.linkCourseTest(testId, c.id, sellerId);
          linked++;
        } catch (err) {
          // Best-effort — one bad row shouldn't stop the rest.
          console.warn(`[CourseService] Backfill link ${testId} ↔ ${c.id} failed:`, err);
        }
      }
    }
    return { linked };
  }

  async removeFinalTest(courseId: string, sellerId: string): Promise<void> {
    const existing = await this.courseRepository.findById(courseId);
    if (!existing) throw new Error("Course not found");
    if (existing.courseSellerId !== sellerId) throw new Error("Not authorized");

    const previousTestId = existing.finalTestId;
    await this.courseRepository.update(courseId, { finalTestId: null });

    // Remove the join-table record so `_count.courseTests` reflects reality.
    // Best-effort — failure doesn't undo the unlink in course_db.
    if (previousTestId) {
      try {
        await assessmentClient.unlinkCourseTest(previousTestId, courseId, sellerId);
      } catch (err) {
        console.warn(
          `[CourseService] Failed to remove course-test link for ${previousTestId}:`,
          err
        );
      }
    }
  }

  async createLesson(courseId: string, sellerId: string, input: {
    title: string;
    description?: string;
    durationInSeconds?: number;
    lessonOrder?: number;
    materials?: string[];
    moduleId?: string;
    videoUrl?: string;
    /** Optional: when set, this becomes a quiz lesson pointing to a Test. */
    testId?: string;
  }) {
    await this.assertActiveSeller(sellerId);
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.courseSellerId !== sellerId) throw new Error("Not authorized");

    // If linking to a quiz test, verify the seller actually owns the test.
    if (input.testId) {
      const test = await assessmentClient.getTest(input.testId, sellerId);
      if (!test) throw Object.assign(new Error("Test not found"), { statusCode: 404 });
      if (test.sellerId && test.sellerId !== sellerId) {
        throw Object.assign(new Error("Not authorized to use this test"), { statusCode: 403 });
      }
    }

    const lesson = await this.courseRepository.createLesson({
      title: DOMPurify.sanitize(input.title, { ALLOWED_TAGS: [] }),
      description: input.description ? DOMPurify.sanitize(input.description, { ALLOWED_TAGS: [] }) : input.description,
      durationInSeconds: input.durationInSeconds,
      lessonOrder: input.lessonOrder,
      materials: input.materials,
      courseId,
      moduleId: input.moduleId,
      videoUrl: input.videoUrl,
      testId: input.testId,
    });

    // Sync course-test join row so the seller's test list shows accurate usage.
    if (input.testId) {
      try {
        await assessmentClient.linkCourseTest(input.testId, courseId, sellerId);
      } catch (err) {
        console.warn(`[CourseService] Failed to sync course-test for lesson ${lesson.id}:`, err);
      }
    }

    // Notify enrolled users about new lesson (fire-and-forget)
    if (course.status === "ACTIVE") {
      this.notifyEnrolledUsers(courseId, course.title, "Bài học mới", `Khóa học "${course.title}" vừa thêm bài học mới: "${input.title}"`);
    }

    return lesson;
  }

  /**
   * Fetch a lesson. Allowed when the requester is:
   *   - the course owner (seller), OR
   *   - an enrolled student (has a UserActivity row).
   * Otherwise throws ForbiddenError so we don't leak paid content.
   */
  async getLessonById(courseId: string, lessonId: string, userId: string) {
    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw Object.assign(new Error("Lesson not found"), { statusCode: 404 });
    }

    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw Object.assign(new Error("Course not found"), { statusCode: 404 });
    }

    if (course.courseSellerId !== userId) {
      const prisma = databaseService.getClient();
      const enrolled = await prisma.userActivity.findFirst({
        where: { userId, courseId },
        select: { id: true },
      });
      if (!enrolled) {
        throw Object.assign(new Error("You don't have access to this lesson"), { statusCode: 403 });
      }
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
    /** Set to a Test UUID to convert into a quiz lesson, or null to unlink. */
    testId?: string | null;
  }) {
    await this.assertActiveSeller(sellerId);

    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.courseSellerId !== sellerId) throw new Error("Not authorized");

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) throw new Error("Lesson not found");

    // If switching to a quiz, verify seller owns the test. `null` clears the link.
    if (typeof input.testId === "string" && input.testId.length > 0) {
      const test = await assessmentClient.getTest(input.testId, sellerId);
      if (!test) throw Object.assign(new Error("Test not found"), { statusCode: 404 });
      if (test.sellerId && test.sellerId !== sellerId) {
        throw Object.assign(new Error("Not authorized to use this test"), { statusCode: 403 });
      }
    }

    // Forward only whitelisted fields — caller could otherwise smuggle FK
    // fields (e.g. courseId) to move the lesson into another course.
    const { title, description, durationInSeconds, lessonOrder, materials, videoUrl, testId } = input;
    const previousTestId = lesson.testId;
    const { lesson: updatedLesson, deletedVideoUrls } = await this.courseRepository.updateLesson(lessonId, {
      title: title ? DOMPurify.sanitize(title, { ALLOWED_TAGS: [] }) : title,
      description: description ? DOMPurify.sanitize(description, { ALLOWED_TAGS: [] }) : description,
      durationInSeconds,
      lessonOrder,
      materials,
      videoUrl,
      testId,
    });

    // Sync course-test join rows so seller's test list usage count stays accurate.
    if (testId !== undefined && testId !== previousTestId) {
      if (previousTestId) {
        try {
          await assessmentClient.unlinkCourseTest(previousTestId, courseId, sellerId);
        } catch (err) {
          console.warn(`[CourseService] Failed to unlink old course-test ${previousTestId}:`, err);
        }
      }
      if (testId) {
        try {
          await assessmentClient.linkCourseTest(testId, courseId, sellerId);
        } catch (err) {
          console.warn(`[CourseService] Failed to link course-test ${testId}:`, err);
        }
      }
    }

    // Fire-and-forget S3 cleanup of replaced videos.
    deletedVideoUrls.forEach((url) => {
      s3Service.deleteFile(url).catch((err) =>
        console.error(`[CourseService] Failed to delete old video ${url}:`, err)
      );
    });

    // Notify enrolled users about lesson update (fire-and-forget)
    if (course.status === "ACTIVE") {
      this.notifyEnrolledUsers(courseId, course.title, "Bài học đã được cập nhật", `Bài học "${lesson.title}" trong khóa học "${course.title}" vừa được cập nhật.`);
    }

    return updatedLesson;
  }

  async deleteLesson(courseId: string, lessonId: string, sellerId: string): Promise<void> {
    await this.assertActiveSeller(sellerId);

    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");
    if (course.courseSellerId !== sellerId) throw new Error("Not authorized");

    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) throw new Error("Lesson not found");

    const lessonTestId = lesson.testId;
    const { deletedVideoUrls } = await this.courseRepository.deleteLesson(lessonId);

    // If this was a quiz lesson, drop the course-test link so usage count is accurate.
    if (lessonTestId) {
      try {
        await assessmentClient.unlinkCourseTest(lessonTestId, courseId, sellerId);
      } catch (err) {
        console.warn(`[CourseService] Failed to unlink course-test ${lessonTestId} on delete:`, err);
      }
    }

    // Fire-and-forget S3 cleanup.
    deletedVideoUrls.forEach((url) => {
      s3Service.deleteFile(url).catch((err) =>
        console.error(`[CourseService] Failed to delete video ${url}:`, err)
      );
    });
  }

  // ============== Helper: Notify enrolled users ==============

  private async notifyEnrolledUsers(courseId: string, _courseTitle: string, title: string, content: string): Promise<void> {
    try {
      const prisma = databaseService.getClient();
      const enrolledUsers = await prisma.userActivity.findMany({
        where: { courseId },
        select: { userId: true },
      });

      const userIds = [...new Set(enrolledUsers.map((u: { userId: string }) => u.userId))];
      if (userIds.length === 0) return;

      await publishBulkNotification(userIds, {
        title,
        content,
        type: "course_update",
        courseId,
        metadata: { courseId },
      });
    } catch (err) {
      console.error("[Course Service] Error sending course update notifications:", err);
    }
  }
}
