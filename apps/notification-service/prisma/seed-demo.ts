import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/index.js";
import {
  LEARNERS,
  SELLERS,
  ALL_USERS,
  daysAgo,
  hoursAgo,
  id,
  userId,
  courseId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.NOTIFICATION_DIRECT_URL ?? process.env.NOTIFICATION_DATABASE_URL } },
});

// =============================================================================
// Notification Service — Demo Seed
// -----------------------------------------------------------------------------
// Tables seeded (all idempotent via deterministic UUIDv5 ids + upsert):
//   • notification_types       — 6 canonical types
//   • notifications            — 3 broadcast templates
//   • user_notifications       — per-recipient links (composite PK)
//   • in_app_notifications     — ~32 per-user toast/bell notifications
//
// Cross-service references (userId / courseId) are resolved through the shared
// deterministic id registry so they line up with the identity & course DBs.
// =============================================================================

// ─── NotificationType ────────────────────────────────────────────────────────

interface TypeSpec {
  name: string;
  isLocked: boolean;
}

const NOTIFICATION_TYPES: TypeSpec[] = [
  { name: "SYSTEM", isLocked: true }, // only SYSTEM is locked (non-deletable)
  { name: "COURSE", isLocked: false },
  { name: "PAYMENT", isLocked: false },
  { name: "MODERATION", isLocked: false },
  { name: "ACHIEVEMENT", isLocked: false },
  { name: "MARKETING", isLocked: false },
];

async function seedNotificationTypes(): Promise<number> {
  for (const t of NOTIFICATION_TYPES) {
    const typeId = id("ntype", t.name);
    await prisma.notificationType.upsert({
      where: { id: typeId },
      create: { id: typeId, name: t.name, isLocked: t.isLocked },
      update: { name: t.name, isLocked: t.isLocked },
    });
  }
  return NOTIFICATION_TYPES.length;
}

// ─── Notification (broadcast templates) + UserNotification (recipients) ───────

interface BroadcastSpec {
  key: string;
  title: string;
  content: string;
  typeName: string;
  createdAt: Date;
  // learner keys that receive this broadcast (~8 each)
  recipientKeys: string[];
}

// First 8 learners as the default broadcast audience; vary per broadcast.
const LEARNER_KEYS = LEARNERS.map((l) => l.key);

const BROADCASTS: BroadcastSpec[] = [
  {
    key: "maintenance-jun",
    title: "Bảo trì hệ thống",
    content:
      "Hệ thống sẽ tạm ngưng để bảo trì từ 23:00 ngày 10/06 đến 01:00 ngày 11/06 (giờ Việt Nam). Trong thời gian này bạn có thể không truy cập được khoá học và bài luyện tập. Mong bạn thông cảm!",
    typeName: "SYSTEM",
    createdAt: daysAgo(2),
    recipientKeys: LEARNER_KEYS.slice(0, 8),
  },
  {
    key: "summer-sale-25",
    title: "Khuyến mãi hè - giảm 25%",
    content:
      "Ưu đãi mùa hè đã đến! Giảm ngay 25% toàn bộ khoá học IELTS và TOEIC khi thanh toán trước ngày 30/06. Nhập mã SUMMER25 tại bước thanh toán để nhận ưu đãi.",
    typeName: "MARKETING",
    createdAt: daysAgo(5),
    recipientKeys: LEARNER_KEYS.slice(2, 10),
  },
  {
    key: "ai-speaking-launch",
    title: "Tính năng AI chấm Speaking đã ra mắt",
    content:
      "Bạn giờ đã có thể luyện nói và nhận điểm band cùng nhận xét chi tiết từ AI ngay lập tức. Thử ngay tính năng AI chấm Speaking trong mục Luyện tập để cải thiện phát âm và độ trôi chảy!",
    typeName: "COURSE",
    createdAt: hoursAgo(6),
    recipientKeys: LEARNER_KEYS.slice(0, 8),
  },
];

async function seedBroadcasts(): Promise<{ notifications: number; links: number }> {
  let links = 0;
  for (const b of BROADCASTS) {
    const notifId = id("notif", b.key);
    const typeId = id("ntype", b.typeName);
    await prisma.notification.upsert({
      where: { id: notifId },
      create: {
        id: notifId,
        title: b.title,
        content: b.content,
        notificationTypeId: typeId,
        createdAt: b.createdAt,
        seen: false,
      },
      update: {
        title: b.title,
        content: b.content,
        notificationTypeId: typeId,
        createdAt: b.createdAt,
        seen: false,
      },
    });

    for (const learnerKey of b.recipientKeys) {
      const recipientId = userId(learnerKey);
      await prisma.userNotification.upsert({
        where: {
          notificationId_userId: {
            notificationId: notifId,
            userId: recipientId,
          },
        },
        create: { notificationId: notifId, userId: recipientId },
        update: {},
      });
      links += 1;
    }
  }
  return { notifications: BROADCASTS.length, links };
}

// ─── InAppNotification (per-user toasts / bell items) ─────────────────────────

interface InAppSpec {
  key: string; // 'an-1' style
  userKey: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  courseKey?: string; // → courseId(); only for course-related types
  metadata: Prisma.InputJsonValue;
}

// Helper to keep the spec terse and consistent.
const inApp = (s: InAppSpec): InAppSpec => s;

const IN_APP_NOTIFICATIONS: InAppSpec[] = [
  // ── Learner: an (active, recent buyer + achiever) ──────────────────────────
  inApp({
    key: "an-1",
    userKey: "an",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “IELTS Foundation 5.0 → 6.5”.",
    type: "PAYMENT_SUCCESS",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(40),
    metadata: { amount: 1161000, orderId: "ord-an-ielts-f", currency: "VND" },
  }),
  inApp({
    key: "an-2",
    userKey: "an",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã được ghi danh vào khoá “American Pronunciation Pro”. Bắt đầu học ngay nhé!",
    type: "COURSE_PURCHASED",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(15),
    courseKey: "pronunciation-pro",
    metadata: { courseTitle: "American Pronunciation Pro" },
  }),
  inApp({
    key: "an-3",
    userKey: "an",
    title: "Chúc mừng thành tích mới!",
    content: "Bạn vừa đạt band 6.5 ở bài luyện IELTS Listening. Tiếp tục phát huy nhé!",
    type: "ACHIEVEMENT",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(3),
    metadata: { band: 6.5, skill: "Listening" },
  }),
  inApp({
    key: "an-4",
    userKey: "an",
    title: "Bình luận mới",
    content: "Giảng viên đã trả lời bình luận của bạn trong bài “True/False/Not Given”.",
    type: "NEW_COMMENT",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(2),
    courseKey: "ielts-foundation",
    metadata: { courseTitle: "IELTS Foundation 5.0 → 6.5", lesson: "True/False/Not Given" },
  }),

  // ── Learner: binh ──────────────────────────────────────────────────────────
  inApp({
    key: "binh-1",
    userKey: "binh",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “TOEIC 500 → 800 Bootcamp”.",
    type: "PAYMENT_SUCCESS",
    isRead: true,
    isArchived: true,
    createdAt: daysAgo(60),
    metadata: { amount: 940000, orderId: "ord-binh-toeic", currency: "VND" },
  }),
  inApp({
    key: "binh-2",
    userKey: "binh",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã được ghi danh vào khoá “Business English for Professionals”.",
    type: "COURSE_PURCHASED",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(22),
    courseKey: "business-english",
    metadata: { courseTitle: "Business English for Professionals" },
  }),
  inApp({
    key: "binh-3",
    userKey: "binh",
    title: "Chúc mừng thành tích mới!",
    content: "Bạn đạt 780 điểm trong bài TOEIC Mini Test. Một kết quả tuyệt vời!",
    type: "ACHIEVEMENT",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(5),
    metadata: { score: 780, test: "TOEIC Mini Test" },
  }),
  inApp({
    key: "binh-4",
    userKey: "binh",
    title: "Bình luận mới",
    content: "Có người vừa phản hồi câu hỏi của bạn trong phần thảo luận khoá Business English.",
    type: "NEW_COMMENT",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(3),
    courseKey: "business-english",
    metadata: { courseTitle: "Business English for Professionals" },
  }),

  // ── Learner: chi ───────────────────────────────────────────────────────────
  inApp({
    key: "chi-1",
    userKey: "chi",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã ghi danh khoá miễn phí “English Grammar Essentials”.",
    type: "COURSE_PURCHASED",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(30),
    courseKey: "grammar-essentials",
    metadata: { courseTitle: "English Grammar Essentials", amount: 0 },
  }),
  inApp({
    key: "chi-2",
    userKey: "chi",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “American Pronunciation Pro”.",
    type: "PAYMENT_SUCCESS",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(4),
    metadata: { amount: 790000, orderId: "ord-chi-pron", currency: "VND" },
  }),
  inApp({
    key: "chi-3",
    userKey: "chi",
    title: "Chúc mừng thành tích mới!",
    content: "Bạn hoàn thành bài kiểm tra ngữ pháp với 8/10 điểm. Cố lên nhé!",
    type: "ACHIEVEMENT",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(3),
    metadata: { score: 8, max: 10, test: "Grammar Checkpoint — Tenses" },
  }),

  // ── Learner: dung (power user) ─────────────────────────────────────────────
  inApp({
    key: "dung-1",
    userKey: "dung",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “IELTS Advanced Writing 7.0+”.",
    type: "PAYMENT_SUCCESS",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(35),
    metadata: { amount: 1512000, orderId: "ord-dung-ielts-a", currency: "VND" },
  }),
  inApp({
    key: "dung-2",
    userKey: "dung",
    title: "Chúc mừng thành tích mới!",
    content: "Bạn đạt band 8.0 ở bài luyện IELTS Listening. Sẵn sàng cho kỳ thi thật!",
    type: "ACHIEVEMENT",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(5),
    metadata: { band: 8.0, skill: "Listening" },
  }),
  inApp({
    key: "dung-3",
    userKey: "dung",
    title: "Bình luận mới",
    content: "Giảng viên đã chữa bài Writing Task 2 của bạn và để lại nhận xét.",
    type: "NEW_COMMENT",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(1),
    courseKey: "ielts-advanced",
    metadata: { courseTitle: "IELTS Advanced Writing 7.0+", lesson: "Argument Essays" },
  }),
  inApp({
    key: "dung-4",
    userKey: "dung",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã được ghi danh vào khoá “TOEIC 500 → 800 Bootcamp”.",
    type: "COURSE_PURCHASED",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(6),
    courseKey: "toeic-bootcamp",
    metadata: { courseTitle: "TOEIC 500 → 800 Bootcamp" },
  }),

  // ── Learner: giang ─────────────────────────────────────────────────────────
  inApp({
    key: "giang-1",
    userKey: "giang",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã được ghi danh vào khoá “IELTS Foundation 5.0 → 6.5”.",
    type: "COURSE_PURCHASED",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(18),
    courseKey: "ielts-foundation",
    metadata: { courseTitle: "IELTS Foundation 5.0 → 6.5" },
  }),
  inApp({
    key: "giang-2",
    userKey: "giang",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “American Pronunciation Pro”.",
    type: "PAYMENT_SUCCESS",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(2),
    metadata: { amount: 790000, orderId: "ord-giang-pron", currency: "VND" },
  }),
  inApp({
    key: "giang-3",
    userKey: "giang",
    title: "Bình luận mới",
    content: "Một học viên khác đã thích bình luận của bạn trong khoá IELTS Foundation.",
    type: "NEW_COMMENT",
    isRead: true,
    isArchived: true,
    createdAt: daysAgo(10),
    courseKey: "ielts-foundation",
    metadata: { courseTitle: "IELTS Foundation 5.0 → 6.5" },
  }),

  // ── Learner: ha ────────────────────────────────────────────────────────────
  inApp({
    key: "ha-1",
    userKey: "ha",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “Business English for Professionals”.",
    type: "PAYMENT_SUCCESS",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(25),
    metadata: { amount: 1341000, orderId: "ord-ha-biz", currency: "VND" },
  }),
  inApp({
    key: "ha-2",
    userKey: "ha",
    title: "Chúc mừng thành tích mới!",
    content: "Bạn đạt 710 điểm trong bài TOEIC Mini Test. Tiến bộ rõ rệt!",
    type: "ACHIEVEMENT",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(4),
    metadata: { score: 710, test: "TOEIC Mini Test" },
  }),
  inApp({
    key: "ha-3",
    userKey: "ha",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã được ghi danh vào khoá “American Pronunciation Pro”.",
    type: "COURSE_PURCHASED",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(3),
    courseKey: "pronunciation-pro",
    metadata: { courseTitle: "American Pronunciation Pro" },
  }),

  // ── Learner: khanh ─────────────────────────────────────────────────────────
  inApp({
    key: "khanh-1",
    userKey: "khanh",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã ghi danh khoá miễn phí “English Grammar Essentials”. Chào mừng bạn!",
    type: "COURSE_PURCHASED",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(5),
    courseKey: "grammar-essentials",
    metadata: { courseTitle: "English Grammar Essentials", amount: 0 },
  }),
  inApp({
    key: "khanh-2",
    userKey: "khanh",
    title: "Chào mừng đến với nền tảng!",
    content: "Hãy hoàn thành bài kiểm tra đầu vào để chúng tôi gợi ý lộ trình học phù hợp cho bạn.",
    type: "SYSTEM",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(1),
    metadata: { cta: "placement_test" },
  }),

  // ── Learner: lan (top achiever) ────────────────────────────────────────────
  inApp({
    key: "lan-1",
    userKey: "lan",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “IELTS Advanced Writing 7.0+”.",
    type: "PAYMENT_SUCCESS",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(70),
    metadata: { amount: 1890000, orderId: "ord-lan-ielts-a", currency: "VND" },
  }),
  inApp({
    key: "lan-2",
    userKey: "lan",
    title: "Chúc mừng thành tích mới!",
    content: "Bạn đạt band 8.0 ở bài luyện IELTS Reading. Xuất sắc!",
    type: "ACHIEVEMENT",
    isRead: true,
    isArchived: true,
    createdAt: daysAgo(30),
    metadata: { band: 8.0, skill: "Reading" },
  }),
  inApp({
    key: "lan-3",
    userKey: "lan",
    title: "Bình luận mới",
    content: "Giảng viên đã trả lời câu hỏi của bạn về Coherence & Cohesion.",
    type: "NEW_COMMENT",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(3),
    courseKey: "ielts-advanced",
    metadata: { courseTitle: "IELTS Advanced Writing 7.0+", lesson: "Coherence & Cohesion" },
  }),

  // ── Learner: nam ───────────────────────────────────────────────────────────
  inApp({
    key: "nam-1",
    userKey: "nam",
    title: "Thanh toán thành công",
    content: "Bạn đã thanh toán thành công khoá học “TOEIC 500 → 800 Bootcamp”.",
    type: "PAYMENT_SUCCESS",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(14),
    metadata: { amount: 940000, orderId: "ord-nam-toeic", currency: "VND" },
  }),
  inApp({
    key: "nam-2",
    userKey: "nam",
    title: "Bạn lâu rồi chưa quay lại!",
    content: "Đã 9 ngày bạn chưa luyện tập. Quay lại để giữ chuỗi streak và không quên kiến thức nhé!",
    type: "SYSTEM",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(2),
    metadata: { inactiveDays: 9 },
  }),

  // ── Learner: phuc ──────────────────────────────────────────────────────────
  inApp({
    key: "phuc-1",
    userKey: "phuc",
    title: "Đã ghi danh khoá học",
    content: "Bạn đã ghi danh khoá miễn phí “English Grammar Essentials”.",
    type: "COURSE_PURCHASED",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(4),
    courseKey: "grammar-essentials",
    metadata: { courseTitle: "English Grammar Essentials", amount: 0 },
  }),
  inApp({
    key: "phuc-2",
    userKey: "phuc",
    title: "Xác minh email của bạn",
    content: "Vui lòng xác minh địa chỉ email để mở khoá đầy đủ tính năng học tập.",
    type: "SYSTEM",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(5),
    metadata: { cta: "verify_email" },
  }),

  // ── Learner: quan (refund flow) ────────────────────────────────────────────
  inApp({
    key: "quan-1",
    userKey: "quan",
    title: "Cập nhật yêu cầu hoàn tiền",
    content: "Yêu cầu hoàn tiền cho khoá học của bạn đang được xử lý. Chúng tôi sẽ phản hồi trong 3-5 ngày làm việc.",
    type: "REFUND_UPDATE",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(6),
    metadata: { status: "PROCESSING", orderId: "ord-quan-pending" },
  }),

  // ── Seller: seller-linh ────────────────────────────────────────────────────
  inApp({
    key: "linh-1",
    userKey: "seller-linh",
    title: "Khoá học đã được duyệt",
    content: "Khoá học “English Grammar Essentials” của bạn đã được phê duyệt và hiển thị công khai.",
    type: "COURSE_APPROVED",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(28),
    courseKey: "grammar-essentials",
    metadata: { courseTitle: "English Grammar Essentials" },
  }),
  inApp({
    key: "linh-2",
    userKey: "seller-linh",
    title: "Đánh giá mới",
    content: "Khoá “American Pronunciation Pro” vừa nhận được đánh giá 5 sao từ một học viên.",
    type: "NEW_RATING",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(2),
    courseKey: "pronunciation-pro",
    metadata: { rating: 5, courseTitle: "American Pronunciation Pro" },
  }),
  inApp({
    key: "linh-3",
    userKey: "seller-linh",
    title: "Cập nhật yêu cầu rút tiền",
    content: "Yêu cầu rút 5.000.000đ của bạn đã được duyệt và sẽ chuyển khoản trong 24 giờ.",
    type: "WITHDRAWAL_UPDATE",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(1),
    metadata: { amount: 5000000, status: "APPROVED", currency: "VND" },
  }),

  // ── Seller: seller-minh ────────────────────────────────────────────────────
  inApp({
    key: "minh-1",
    userKey: "seller-minh",
    title: "Đánh giá mới",
    content: "Khoá “IELTS Foundation 5.0 → 6.5” vừa nhận được một đánh giá 4 sao.",
    type: "NEW_RATING",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(4),
    courseKey: "ielts-foundation",
    metadata: { rating: 4, courseTitle: "IELTS Foundation 5.0 → 6.5" },
  }),
  inApp({
    key: "minh-2",
    userKey: "seller-minh",
    title: "Khoá học bị từ chối",
    content: "Khoá “IELTS 9.0 Guaranteed Hacks” không được duyệt do vi phạm chính sách nội dung. Vui lòng chỉnh sửa và gửi lại.",
    type: "MODERATION",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(20),
    courseKey: "ielts-hacks",
    metadata: { reason: "Tiêu đề cam kết điểm số phi thực tế và nội dung mỏng." },
  }),
  inApp({
    key: "minh-3",
    userKey: "seller-minh",
    title: "Cập nhật yêu cầu rút tiền",
    content: "Yêu cầu rút 12.000.000đ của bạn đã được chuyển khoản thành công.",
    type: "WITHDRAWAL_UPDATE",
    isRead: true,
    isArchived: true,
    createdAt: daysAgo(7),
    metadata: { amount: 12000000, status: "COMPLETED", currency: "VND" },
  }),

  // ── Seller: seller-trang ───────────────────────────────────────────────────
  inApp({
    key: "trang-1",
    userKey: "seller-trang",
    title: "Đánh giá mới",
    content: "Khoá “Business English for Professionals” vừa nhận được đánh giá 5 sao.",
    type: "NEW_RATING",
    isRead: false,
    isArchived: false,
    createdAt: hoursAgo(1),
    courseKey: "business-english",
    metadata: { rating: 5, courseTitle: "Business English for Professionals" },
  }),
  inApp({
    key: "trang-2",
    userKey: "seller-trang",
    title: "Khoá học đã được duyệt",
    content: "Khoá “TOEIC 500 → 800 Bootcamp” của bạn đã được phê duyệt và đang mở bán.",
    type: "COURSE_APPROVED",
    isRead: true,
    isArchived: false,
    createdAt: daysAgo(95),
    courseKey: "toeic-bootcamp",
    metadata: { courseTitle: "TOEIC 500 → 800 Bootcamp" },
  }),
  inApp({
    key: "trang-3",
    userKey: "seller-trang",
    title: "Cập nhật yêu cầu rút tiền",
    content: "Yêu cầu rút 8.500.000đ của bạn đang chờ xử lý.",
    type: "WITHDRAWAL_UPDATE",
    isRead: false,
    isArchived: false,
    createdAt: daysAgo(2),
    metadata: { amount: 8500000, status: "PENDING", currency: "VND" },
  }),
];

const COURSE_RELATED_TYPES = new Set([
  "COURSE_APPROVED",
  "NEW_COMMENT",
  "NEW_RATING",
  "COURSE_PURCHASED",
]);

async function seedInAppNotifications(): Promise<number> {
  for (const n of IN_APP_NOTIFICATIONS) {
    const inAppId = id("inapp", n.key);
    const resolvedCourseId = n.courseKey ? courseId(n.courseKey) : null;

    // Sanity: course-related types should carry a course reference.
    if (COURSE_RELATED_TYPES.has(n.type) && !resolvedCourseId) {
      throw new Error(`InApp '${n.key}' is course-related (${n.type}) but has no courseKey`);
    }

    const readAt = n.isRead ? n.createdAt : null;
    const archivedAt = n.isArchived ? n.createdAt : null;

    const data = {
      userId: userId(n.userKey),
      title: n.title,
      content: n.content,
      type: n.type,
      isRead: n.isRead,
      isArchived: n.isArchived,
      createdAt: n.createdAt,
      readAt,
      archivedAt,
      contractId: null,
      courseId: resolvedCourseId,
      metadata: n.metadata,
    };

    await prisma.inAppNotification.upsert({
      where: { id: inAppId },
      create: { id: inAppId, ...data },
      update: data,
    });
  }
  return IN_APP_NOTIFICATIONS.length;
}

// ─── Orchestration ───────────────────────────────────────────────────────────

async function main() {
  // Guard: ensure recipient/user keys actually exist in the shared catalog.
  const knownKeys = new Set(ALL_USERS.map((u) => u.key));
  const referenced = new Set<string>([
    ...BROADCASTS.flatMap((b) => b.recipientKeys),
    ...IN_APP_NOTIFICATIONS.map((n) => n.userKey),
  ]);
  for (const k of referenced) {
    if (!knownKeys.has(k)) throw new Error(`Unknown user key referenced in seed: ${k}`);
  }

  const typeCount = await seedNotificationTypes();
  const { notifications, links } = await seedBroadcasts();
  const inAppCount = await seedInAppNotifications();

  console.log(`  notification_types:    ${typeCount}`);
  console.log(`  notifications:         ${notifications}`);
  console.log(`  user_notifications:    ${links}`);
  console.log(`  in_app_notifications:  ${inAppCount}`);

  // Reference SELLERS so the import is meaningful & verifiable at a glance.
  console.log(`  (sellers in catalog:   ${SELLERS.length})`);
}

main()
  .then(() => console.log("✓ notification demo seed complete"))
  .catch((err) => {
    console.error("✗ notification demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
