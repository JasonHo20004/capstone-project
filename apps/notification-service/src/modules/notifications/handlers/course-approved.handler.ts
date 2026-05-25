import {
  EventBusService,
  EventNames,
  CoursePublishedEvent,
  CourseRejectedEvent,
  WithdrawalApprovedEvent,
  WithdrawalRejectedEvent,
  DomainEvent,
} from "@capstone/common";
import { registerEmailVerificationHandler } from "./email-verification.handler.js";
import { SERVICE_NAME } from "../../../constants.js";
let eventBus: EventBusService;

export function getNotificationEventBus(): EventBusService {
  return eventBus;
}

export const initializeEventHandlers = async (dbService: any) => {
  eventBus = EventBusService.getInstance(SERVICE_NAME);
  await eventBus.connect();

  await eventBus.subscribe<CoursePublishedEvent>(
    EventNames.COURSE_PUBLISHED,
    async (event: DomainEvent<CoursePublishedEvent>) => {
      const payload = event.payload;
      console.log(`📥 [${SERVICE_NAME}] Received EVENT ${EventNames.COURSE_PUBLISHED} for Course ${payload.courseId}`);
      const prisma = dbService.getClient();

      await prisma.inAppNotification.create({
        data: {
          userId: payload.sellerId,
          title: "Khóa học đã được duyệt!",
          content: `Chúc mừng! Khóa học "${payload.title}" của bạn đã được Admin phê duyệt và kích hoạt. Học viên hiện đã có thể đăng ký mua.`,
          type: "COURSE_APPROVED",
          courseId: payload.courseId
        }
      });

      console.log(`✅ [${SERVICE_NAME}] InAppNotification created for Seller ${payload.sellerId}`);
    }
  );

  await eventBus.subscribe<CourseRejectedEvent>(
    EventNames.COURSE_REJECTED,
    async (event: DomainEvent<CourseRejectedEvent>) => {
      const payload = event.payload;
      console.log(`📥 [${SERVICE_NAME}] Received EVENT ${EventNames.COURSE_REJECTED} for Course ${payload.courseId}`);
      const prisma = dbService.getClient();

      // Body shows a truncated reason so the toast/list stays compact; the
      // full text is preserved in metadata for the rejection banner on the
      // course-detail page.
      const shortReason = payload.reason.length > 200
        ? `${payload.reason.slice(0, 200).trim()}…`
        : payload.reason;

      await prisma.inAppNotification.create({
        data: {
          userId: payload.sellerId,
          title: "Khóa học bị từ chối duyệt",
          content: `Khóa học "${payload.title}" của bạn chưa được duyệt. Lý do: ${shortReason}`,
          type: "COURSE_REJECTED",
          courseId: payload.courseId,
          metadata: {
            rejectionReason: payload.reason,
            rejectedAt: payload.rejectedAt,
            reviewerId: payload.reviewerId,
          },
        },
      });

      console.log(`✅ [${SERVICE_NAME}] Rejection notification created for Seller ${payload.sellerId}`);
    }
  );

  await eventBus.subscribe<WithdrawalApprovedEvent>(
    EventNames.WITHDRAWAL_APPROVED,
    async (event: DomainEvent<WithdrawalApprovedEvent>) => {
      const payload = event.payload;
      const prisma = dbService.getClient();
      await prisma.inAppNotification.create({
        data: {
          userId: payload.sellerId,
          title: "Lệnh rút tiền đã được duyệt",
          content: `Lệnh rút ${payload.amount.toLocaleString("vi-VN")}đ về ${payload.bankName} đã được admin xác nhận chuyển khoản.`,
          type: "WITHDRAWAL_APPROVED",
          metadata: {
            requestId: payload.requestId,
            processedAt: payload.processedAt,
            proofImageUrl: payload.proofImageUrl,
          },
        },
      });
    }
  );

  await eventBus.subscribe<WithdrawalRejectedEvent>(
    EventNames.WITHDRAWAL_REJECTED,
    async (event: DomainEvent<WithdrawalRejectedEvent>) => {
      const payload = event.payload;
      const prisma = dbService.getClient();
      const shortReason = payload.reason.length > 200 ? `${payload.reason.slice(0, 200).trim()}…` : payload.reason;
      await prisma.inAppNotification.create({
        data: {
          userId: payload.sellerId,
          title: "Lệnh rút tiền bị từ chối",
          content: `Lệnh rút ${payload.amount.toLocaleString("vi-VN")}đ đã bị từ chối. Lý do: ${shortReason || "(không có lý do cụ thể)"}. Tiền đã hoàn về số dư khả dụng.`,
          type: "WITHDRAWAL_REJECTED",
          metadata: {
            requestId: payload.requestId,
            reason: payload.reason,
            processedAt: payload.processedAt,
          },
        },
      });
    }
  );

  await registerEmailVerificationHandler(eventBus);

  console.log(`🐰 [${SERVICE_NAME}] RabbitMQ Event Handlers Initialized.`);
};
