// =============================================================================
// Course Service — Demo Seed
// -----------------------------------------------------------------------------
// Idempotent, deterministic seed for the course-service schema. Every row's id
// is derived from seed-shared/ids.ts so re-running upserts in place and never
// duplicates. Cross-service references (sellers, admins, learners, tests,
// orders) are resolved via the shared typed UUID helpers so the rows actually
// join against identity-service / assessment-service / payment-service.
//
// UI strings are Vietnamese; learning content is English.
// Run via: tsx prisma/seed-demo.ts  (DO NOT auto-run against a live DB).
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import {
  COURSES,
  ENROLLMENTS,
  LEARNERS,
  daysAgo,
  daysFromNow,
  id,
  userId,
  courseId,
  moduleId,
  lessonId,
  testId,
  orderId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.COURSE_DIRECT_URL ?? process.env.COURSE_DATABASE_URL } },
});

// Set of valid learner keys — used to assert rating/comment authors are real
// learners from the shared catalog (fail-fast on typos in the curated data).
const LEARNER_KEY_SET = new Set(LEARNERS.map((l) => l.key));
function assertLearner(key: string): string {
  if (!LEARNER_KEY_SET.has(key)) {
    throw new Error(`Unknown learner key in seed data: ${key}`);
  }
  return key;
}

// Status → workflow timestamp offsets (in days ago). DRAFT has no timestamps.
type CourseStatus = "PENDING" | "ACTIVE" | "REFUSE" | "INACTIVE" | "DRAFT";

// Resolve a course's modules→lessons in declared order, flattened, so we can
// pick "the first N lessons" deterministically for completion tracking.
function orderedLessonKeys(course: (typeof COURSES)[number]): string[] {
  const keys: string[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      keys.push(lesson.key);
    }
  }
  return keys;
}

async function main() {
  // ───────────────────────────────────────────────────────────────────────
  // 1. Courses, Modules, Lessons, MediaAssets, CourseReviewHistory
  // ───────────────────────────────────────────────────────────────────────
  // We precompute ratingCount per ACTIVE course (see section 4 logic) so the
  // Course.ratingCount column matches the number of Rating rows we create.
  const ratingPlan = buildRatingPlan();

  for (const course of COURSES) {
    const status = course.status as CourseStatus;
    const cId = courseId(course.key);
    const sellerId = userId(course.sellerKey);
    const adminId = userId("admin");

    // Workflow timestamps + review trail vary by status.
    const workflow: {
      submittedAt: Date | null;
      approvedAt: Date | null;
      rejectedAt: Date | null;
      rejectionReason: string | null;
      reviewedById: string | null;
    } = {
      submittedAt: null,
      approvedAt: null,
      rejectedAt: null,
      rejectionReason: null,
      reviewedById: null,
    };

    if (status === "ACTIVE") {
      workflow.submittedAt = daysAgo(85);
      workflow.approvedAt = daysAgo(80);
      workflow.reviewedById = adminId;
    } else if (status === "PENDING") {
      workflow.submittedAt = daysAgo(3);
    } else if (status === "REFUSE") {
      workflow.submittedAt = daysAgo(20);
      workflow.rejectedAt = daysAgo(18);
      workflow.rejectionReason = course.rejectionReason ?? null;
      workflow.reviewedById = adminId;
    } else if (status === "INACTIVE") {
      workflow.submittedAt = daysAgo(300);
      workflow.approvedAt = daysAgo(295);
      workflow.reviewedById = adminId;
    }
    // DRAFT → all null.

    const ratingCount = ratingPlan.get(course.key)?.length ?? 0;

    const courseData = {
      title: course.title,
      description: course.description,
      price: course.price,
      courseLevel: course.level,
      courseSellerId: sellerId,
      finalTestId: course.finalTestKey ? testId(course.finalTestKey) : null,
      ratingCount,
      status,
      category: course.category,
      thumbnailUrl: `https://cdn.demo.capstone.local/thumbs/${course.key}.jpg`,
      createdAt: workflow.submittedAt ?? daysAgo(2),
      submittedAt: workflow.submittedAt,
      approvedAt: workflow.approvedAt,
      rejectedAt: workflow.rejectedAt,
      rejectionReason: workflow.rejectionReason,
      reviewedById: workflow.reviewedById,
    };

    await prisma.course.upsert({
      where: { id: cId },
      update: courseData,
      create: { id: cId, ...courseData },
    });

    // Modules + lessons (+ video media assets).
    let moduleIndex = 0;
    for (const mod of course.modules) {
      moduleIndex += 1;
      const mId = moduleId(mod.key);
      const moduleData = {
        title: mod.title,
        description: null,
        moduleOrder: moduleIndex,
        courseId: cId,
      };
      await prisma.module.upsert({
        where: { id: mId },
        update: moduleData,
        create: { id: mId, ...moduleData },
      });

      let lessonIndex = 0;
      for (const lesson of mod.lessons) {
        lessonIndex += 1;
        const lId = lessonId(lesson.key);
        const lessonData = {
          title: lesson.title,
          description: null,
          durationInSeconds: lesson.durationInSeconds,
          lessonOrder: lessonIndex,
          materials: [] as string[],
          commentCount: commentCountPlan.get(lesson.key) ?? 0,
          courseId: cId,
          moduleId: mId,
          testId: lesson.testKey ? testId(lesson.testKey) : null,
        };
        await prisma.lesson.upsert({
          where: { id: lId },
          update: lessonData,
          create: { id: lId, ...lessonData },
        });

        // One VIDEO asset per playable (non-quiz) lesson.
        if (lesson.durationInSeconds > 0) {
          const mediaId = id("media", lesson.key);
          const mediaData = {
            assetType: "VIDEO" as const,
            assetUrl: `https://cdn.demo.capstone.local/video/${lesson.key}.mp4`,
            lessonId: lId,
          };
          await prisma.mediaAsset.upsert({
            where: { id: mediaId },
            update: mediaData,
            create: { id: mediaId, ...mediaData },
          });
        }
      }
    }

    // CourseReviewHistory — append-only workflow trail (non-DRAFT only).
    if (status !== "DRAFT") {
      const e1Id = id("review", `${course.key}-1`);
      const e1 = {
        courseId: cId,
        fromStatus: "DRAFT" as const,
        toStatus: "PENDING" as const,
        actorId: sellerId,
        actorRole: "seller",
        reason: "Nộp khoá học để duyệt",
        createdAt: workflow.submittedAt!,
      };
      await prisma.courseReviewHistory.upsert({
        where: { id: e1Id },
        update: e1,
        create: { id: e1Id, ...e1 },
      });

      if (status === "ACTIVE" || status === "INACTIVE") {
        const e2Id = id("review", `${course.key}-2`);
        const e2 = {
          courseId: cId,
          fromStatus: "PENDING" as const,
          toStatus: "ACTIVE" as const,
          actorId: adminId,
          actorRole: "admin",
          reason: "Đã duyệt",
          createdAt: workflow.approvedAt!,
        };
        await prisma.courseReviewHistory.upsert({
          where: { id: e2Id },
          update: e2,
          create: { id: e2Id, ...e2 },
        });
      } else if (status === "REFUSE") {
        const e2Id = id("review", `${course.key}-2`);
        const e2 = {
          courseId: cId,
          fromStatus: "PENDING" as const,
          toStatus: "REFUSE" as const,
          actorId: adminId,
          actorRole: "admin",
          reason: course.rejectionReason ?? null,
          createdAt: workflow.rejectedAt!,
        };
        await prisma.courseReviewHistory.upsert({
          where: { id: e2Id },
          update: e2,
          create: { id: e2Id, ...e2 },
        });
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // 2. UserActivity — one entitlement per enrollment
  // ───────────────────────────────────────────────────────────────────────
  for (const enr of ENROLLMENTS) {
    const actId = id("activity", enr.key);
    const actData = {
      userId: userId(enr.learnerKey),
      transactionId: orderId(enr.key),
      courseId: courseId(enr.courseKey),
      createdAt: daysAgo(enr.daysAgo),
      expiresAt: daysFromNow(365),
    };
    await prisma.userActivity.upsert({
      where: { id: actId },
      update: actData,
      create: { id: actId, ...actData },
    });
  }

  // ───────────────────────────────────────────────────────────────────────
  // 3. UserLesson — first 2 lessons of each enrolled course marked complete
  // ───────────────────────────────────────────────────────────────────────
  const courseByKey = new Map(COURSES.map((c) => [c.key, c]));
  for (const enr of ENROLLMENTS) {
    const course = courseByKey.get(enr.courseKey);
    if (!course) continue;
    const firstTwo = orderedLessonKeys(course).slice(0, 2);
    const uId = userId(enr.learnerKey);
    for (const lessonKey of firstTwo) {
      const lId = lessonId(lessonKey);
      await prisma.userLesson.upsert({
        where: { lessonId_userId: { lessonId: lId, userId: uId } },
        update: {},
        create: { lessonId: lId, userId: uId },
      });
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // 4. Ratings — ACTIVE courses only, by enrolled learners
  // ───────────────────────────────────────────────────────────────────────
  await seedRatings(ratingPlan);

  // ───────────────────────────────────────────────────────────────────────
  // 5. Comments + CommentReports
  // ───────────────────────────────────────────────────────────────────────
  await seedComments();

  // ───────────────────────────────────────────────────────────────────────
  // 6. Course-level Reports
  // ───────────────────────────────────────────────────────────────────────
  await seedReports();

  // ───────────────────────────────────────────────────────────────────────
  // 7. NotificationOutbox events
  // ───────────────────────────────────────────────────────────────────────
  await seedOutbox();
}

// =============================================================================
// Rating plan — deterministic per-course rating authors + scores
// =============================================================================
interface PlannedRating {
  learnerKey: string;
  score: number;
  content: string | null;
  daysAgo: number;
  reply?: string;
  isReported?: boolean;
}

// Curated 3–6 ratings per ACTIVE course, drawn only from enrolled learners.
// Vietnamese review text. Exactly one rating overall is flagged isReported.
function buildRatingPlan(): Map<string, PlannedRating[]> {
  const plan = new Map<string, PlannedRating[]>();

  plan.set("ielts-foundation", [
    { learnerKey: "an", score: 4.5, content: "Khoá học nền tảng rất chắc chắn, giảng viên dạy dễ hiểu.", daysAgo: 30, reply: "Cảm ơn bạn An, chúc bạn sớm đạt 6.5!" },
    { learnerKey: "dung", score: 5, content: "Phương pháp Reading cực kỳ hiệu quả, mình tăng được 1 band.", daysAgo: 25 },
    { learnerKey: "giang", score: 4, content: "Nội dung tốt nhưng mong có thêm bài tập về nhà.", daysAgo: 12 },
    { learnerKey: "lan", score: 4.5, content: "Phù hợp cho người mới bắt đầu luyện IELTS.", daysAgo: 60, reply: "Cảm ơn chị Lan đã tin tưởng khoá học." },
    { learnerKey: "binh", score: 5, content: null, daysAgo: 1 },
  ]);

  plan.set("ielts-advanced", [
    { learnerKey: "dung", score: 5, content: "Phần chữa Writing Task 2 quá chi tiết, đáng đồng tiền.", daysAgo: 28 },
    { learnerKey: "lan", score: 4.5, content: "Giúp mình hệ thống lại cách viết essay mạch lạc hơn.", daysAgo: 65 },
    { learnerKey: "an", score: 4, content: "Hơi khó với band thấp nhưng rất bổ ích.", daysAgo: 5 },
  ]);

  plan.set("toeic-bootcamp", [
    { learnerKey: "binh", score: 4.5, content: "Lộ trình 8 tuần rõ ràng, đề luyện sát đề thật.", daysAgo: 40 },
    { learnerKey: "ha", score: 4, content: "Phần nghe Part 3 rất hữu ích.", daysAgo: 20 },
    { learnerKey: "nam", score: 3.5, content: "Tốt nhưng tốc độ hơi nhanh với mình.", daysAgo: 10, isReported: true },
    { learnerKey: "dung", score: 5, content: "Tăng từ 600 lên 820, quá ổn!", daysAgo: 4 },
  ]);

  plan.set("grammar-essentials", [
    { learnerKey: "an", score: 5, content: "Khoá miễn phí mà chất lượng như khoá trả phí.", daysAgo: 35 },
    { learnerKey: "binh", score: 4.5, content: "Ôn lại ngữ pháp rất tốt.", daysAgo: 50 },
    { learnerKey: "chi", score: 4, content: "Dễ hiểu cho người mất gốc như mình.", daysAgo: 25 },
    { learnerKey: "khanh", score: 4.5, content: "Bài giảng ngắn gọn, dễ theo.", daysAgo: 4 },
  ]);

  plan.set("business-english", [
    { learnerKey: "dung", score: 4.5, content: "Mẫu email và ngôn ngữ họp hành rất thực tế.", daysAgo: 7, reply: "Cảm ơn bạn, chúc bạn thành công trong công việc!" },
    { learnerKey: "ha", score: 5, content: "Áp dụng được ngay vào công việc văn phòng.", daysAgo: 20 },
    { learnerKey: "binh", score: 4, content: null, daysAgo: 15 },
  ]);

  plan.set("pronunciation-pro", [
    { learnerKey: "an", score: 4.5, content: "Luyện âm theo từng bước rất dễ làm theo.", daysAgo: 10 },
    { learnerKey: "chi", score: 4, content: "Phát âm của mình cải thiện rõ rệt.", daysAgo: 8 },
    { learnerKey: "lan", score: 5, content: "Giảng viên chỉnh ngữ điệu cực kỳ tỉ mỉ.", daysAgo: 30 },
    { learnerKey: "ha", score: 4.5, content: "Hữu ích cho việc thuyết trình.", daysAgo: 3 },
  ]);

  return plan;
}

async function seedRatings(plan: Map<string, PlannedRating[]>) {
  for (const [courseKey, ratings] of plan.entries()) {
    const cId = courseId(courseKey);
    for (const r of ratings) {
      const rId = id("rating", `${courseKey}-${r.learnerKey}`);
      const uId = userId(assertLearner(r.learnerKey));
      const data = {
        score: r.score,
        userId: uId,
        courseId: cId,
        content: r.content,
        createdAt: daysAgo(r.daysAgo),
        isReported: r.isReported ?? false,
        repliedAt: r.reply ? daysAgo(Math.max(0, r.daysAgo - 1)) : null,
        replyContent: r.reply ?? null,
      };
      await prisma.rating.upsert({
        where: { userId_courseId: { userId: uId, courseId: cId } },
        update: data,
        create: { id: rId, ...data },
      });
    }
  }
}

// =============================================================================
// Comments + CommentReports
// =============================================================================
// commentCount per lesson is precomputed so Lesson.commentCount stays accurate.
const commentCountPlan = new Map<string, number>([
  ["if-l1", 3], // skimming & scanning — 2 root + 1 reply
  ["tb-l2", 2], // conversations — 1 root (edited) + 1 root (hidden)
  ["ge-l1", 1], // present tenses — 1 root
  ["pp-l1", 1], // vowel sounds — 1 root
]);

async function seedComments() {
  // ── Lesson if-l1 (ielts-foundation): 2 roots + 1 reply ──
  const ifL1 = lessonId("if-l1");
  await upsertComment("c-if-l1-1", {
    content: "Phần scanning giúp mình tiết kiệm rất nhiều thời gian làm bài.",
    userId: userId("an"),
    lessonId: ifL1,
    createdAt: daysAgo(20),
  });
  await upsertComment("c-if-l1-2", {
    content: "Giảng viên có thể nói chậm hơn ở đoạn ví dụ được không ạ?",
    userId: userId("giang"),
    lessonId: ifL1,
    createdAt: daysAgo(11),
  });
  await upsertComment("c-if-l1-3", {
    content: "@giang bạn có thể tua chậm 0.75x trong trình phát nhé.",
    userId: userId("dung"),
    lessonId: ifL1,
    parentCommentId: id("comment", "c-if-l1-2"),
    createdAt: daysAgo(10),
  });

  // ── Lesson tb-l2 (toeic-bootcamp): edited comment + hidden comment ──
  const tbL2 = lessonId("tb-l2");
  await upsertComment("c-tb-l2-1", {
    content: "Part 3 nghe hội thoại khó nhưng mẹo paraphrase rất hay. Đã cải thiện nhiều!",
    userId: userId("ha"),
    lessonId: tbL2,
    createdAt: daysAgo(18),
    editedAt: daysAgo(17),
    editHistory: [
      { content: "Part 3 nghe hội thoại khó.", editedAt: daysAgo(18).toISOString() },
    ],
  });
  await upsertComment("c-tb-l2-2", {
    content: "Mua tài liệu lậu giá rẻ liên hệ mình nhé 0900xxxxxx",
    userId: userId("nam"),
    lessonId: tbL2,
    createdAt: daysAgo(6),
    hiddenAt: daysAgo(2),
    hiddenReason: "Tự động ẩn do bị báo cáo nhiều lần",
  });

  // ── Lesson ge-l1 (grammar-essentials): 1 root ──
  await upsertComment("c-ge-l1-1", {
    content: "Cách phân biệt hiện tại đơn và hiện tại tiếp diễn cuối cùng cũng rõ ràng.",
    userId: userId("chi"),
    lessonId: lessonId("ge-l1"),
    createdAt: daysAgo(22),
  });

  // ── Lesson pp-l1 (pronunciation-pro): 1 root ──
  await upsertComment("c-pp-l1-1", {
    content: "Bảng nguyên âm rất trực quan, luyện theo thấy hiệu quả.",
    userId: userId("lan"),
    lessonId: lessonId("pp-l1"),
    createdAt: daysAgo(9),
  });

  // ── CommentReports ──
  // Report 1+2 target the hidden spam comment (drove the auto-hide).
  await upsertCommentReport("cr-1", {
    commentId: id("comment", "c-tb-l2-2"),
    reporterId: userId("binh"),
    reasonType: "SPAM",
    note: "Bình luận rao bán tài liệu lậu.",
    status: "RESOLVED_KEPT",
    resolvedById: userId("admin"),
    resolvedAt: daysAgo(1),
    resolutionNote: "Đã ẩn bình luận và cảnh cáo người dùng.",
  });
  await upsertCommentReport("cr-2", {
    commentId: id("comment", "c-tb-l2-2"),
    reporterId: userId("ha"),
    reasonType: "SPAM",
    note: "Spam quảng cáo.",
    status: "RESOLVED_KEPT",
    resolvedById: userId("admin"),
    resolvedAt: daysAgo(1),
    resolutionNote: "Đã ẩn bình luận và cảnh cáo người dùng.",
  });
  // Report 3 — still pending, off-topic.
  await upsertCommentReport("cr-3", {
    commentId: id("comment", "c-if-l1-2"),
    reporterId: userId("dung"),
    reasonType: "OFF_TOPIC",
    note: "Bình luận lạc đề so với bài học.",
    status: "PENDING",
    resolvedById: null,
    resolvedAt: null,
    resolutionNote: null,
  });
}

interface CommentInput {
  content: string;
  userId: string;
  lessonId: string;
  createdAt: Date;
  parentCommentId?: string;
  editedAt?: Date;
  editHistory?: unknown;
  hiddenAt?: Date;
  hiddenReason?: string;
}

async function upsertComment(key: string, input: CommentInput) {
  const cId = id("comment", key);
  const data = {
    content: input.content,
    userId: input.userId,
    lessonId: input.lessonId,
    createdAt: input.createdAt,
    parentCommentId: input.parentCommentId ?? null,
    editedAt: input.editedAt ?? null,
    editHistory: input.editHistory ?? undefined,
    hiddenAt: input.hiddenAt ?? null,
    hiddenReason: input.hiddenReason ?? null,
  };
  await prisma.comment.upsert({
    where: { id: cId },
    update: data,
    create: { id: cId, ...data },
  });
}

interface CommentReportInput {
  commentId: string;
  reporterId: string;
  reasonType: "SPAM" | "ABUSE" | "SCAM" | "MISINFORMATION" | "OFF_TOPIC" | "OTHER";
  note: string | null;
  status: "PENDING" | "RESOLVED_REMOVED" | "RESOLVED_KEPT" | "DISMISSED";
  resolvedById: string | null;
  resolvedAt: Date | null;
  resolutionNote: string | null;
}

async function upsertCommentReport(key: string, input: CommentReportInput) {
  const crId = id("creport", key);
  const data = {
    commentId: input.commentId,
    reporterId: input.reporterId,
    reasonType: input.reasonType,
    note: input.note,
    status: input.status,
    resolvedById: input.resolvedById,
    resolvedAt: input.resolvedAt,
    resolutionNote: input.resolutionNote,
  };
  await prisma.commentReport.upsert({
    where: { commentId_reporterId: { commentId: input.commentId, reporterId: input.reporterId } },
    update: data,
    create: { id: crId, ...data },
  });
}

// =============================================================================
// Course-level Reports
// =============================================================================
async function seedReports() {
  const reports: {
    key: string;
    content: string;
    reasonType: "INAPPROPRIATE_CONTENT" | "NOT_AS_DESCRIBED";
    learnerKey: string;
    courseKey: string;
  }[] = [
    {
      key: "rep-1",
      content: "Tiêu đề cam kết điểm số nhưng nội dung không tương xứng.",
      reasonType: "NOT_AS_DESCRIBED",
      learnerKey: "nam",
      courseKey: "toeic-bootcamp",
    },
    {
      key: "rep-2",
      content: "Một video trong khoá có nội dung không phù hợp.",
      reasonType: "INAPPROPRIATE_CONTENT",
      learnerKey: "an",
      courseKey: "pronunciation-pro",
    },
  ];

  for (const r of reports) {
    const rId = id("report", r.key);
    const data = {
      content: r.content,
      reasonType: r.reasonType,
      userId: userId(r.learnerKey),
      courseId: courseId(r.courseKey),
      createdAt: daysAgo(5),
    };
    await prisma.report.upsert({
      where: { id: rId },
      update: data,
      create: { id: rId, ...data },
    });
  }
}

// =============================================================================
// NotificationOutbox
// =============================================================================
async function seedOutbox() {
  const events: {
    key: string;
    eventType: string;
    payload: object;
    status: "PENDING" | "SENT" | "FAILED";
    retryCount: number;
    daysAgo: number;
    processed: boolean;
  }[] = [
    {
      key: "evt-course-approved",
      eventType: "COURSE_APPROVED",
      payload: {
        courseId: courseId("ielts-foundation"),
        sellerId: userId("seller-minh"),
        title: "IELTS Foundation 5.0 → 6.5",
      },
      status: "SENT",
      retryCount: 0,
      daysAgo: 80,
      processed: true,
    },
    {
      key: "evt-new-rating",
      eventType: "NEW_RATING",
      payload: {
        courseId: courseId("toeic-bootcamp"),
        sellerId: userId("seller-trang"),
        userId: userId("dung"),
        score: 5,
      },
      status: "SENT",
      retryCount: 1,
      daysAgo: 4,
      processed: true,
    },
    {
      key: "evt-comment-hidden",
      eventType: "COMMENT_HIDDEN",
      payload: {
        commentId: id("comment", "c-tb-l2-2"),
        lessonId: lessonId("tb-l2"),
        reason: "Tự động ẩn do bị báo cáo nhiều lần",
      },
      status: "PENDING",
      retryCount: 0,
      daysAgo: 2,
      processed: false,
    },
  ];

  for (const ev of events) {
    const oId = id("outbox", ev.key);
    const data = {
      eventType: ev.eventType,
      payload: ev.payload,
      status: ev.status,
      retryCount: ev.retryCount,
      createdAt: daysAgo(ev.daysAgo),
      processedAt: ev.processed ? daysAgo(Math.max(0, ev.daysAgo - 1)) : null,
    };
    await prisma.notificationOutbox.upsert({
      where: { id: oId },
      update: data,
      create: { id: oId, ...data },
    });
  }
}

main()
  .then(() => console.log("✓ course demo seed complete"))
  .catch((err) => {
    console.error("✗ course demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
