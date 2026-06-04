import {
  EventBusService,
  EventNames,
  CoursePublishedEvent,
  CourseRejectedEvent,
  WithdrawalApprovedEvent,
  WithdrawalRejectedEvent,
  SellerApprovedEvent,
  SellerRejectedEvent,
  RefundApprovedEvent,
  RefundRejectedEvent,
  DomainEvent,
} from "@capstone/common";
import { registerEmailVerificationHandler } from "./email-verification.handler.js";
import { registerPasswordResetHandler } from "./password-reset.handler.js";
import { SERVICE_NAME } from "../../../constants.js";
import { emailService } from "../../../services/index.js";
import { getUserBasicInfo } from "../../../clients/identity.client.js";

const renderWithdrawalApprovedEmail = (p: {
  fullName: string;
  amount: number;
  bankName: string;
  processedAt: Date | string;
}): string => `
  <p>Xin chào ${p.fullName || "bạn"},</p>
  <p>Lệnh rút tiền của bạn đã được duyệt và xác nhận chuyển khoản.</p>
  <ul>
    <li>Số tiền: <strong>${p.amount.toLocaleString("vi-VN")}đ</strong></li>
    <li>Ngân hàng nhận: <strong>${p.bankName}</strong></li>
    <li>Thời gian xử lý: ${new Date(p.processedAt).toLocaleString("vi-VN")}</li>
  </ul>
  <p>Tiền thường về tài khoản trong 1–3 ngày làm việc tuỳ ngân hàng. Nếu quá thời gian này mà chưa nhận được, vui lòng liên hệ bộ phận hỗ trợ.</p>
  <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
`;
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

      // Best-effort email — wrapped so an SMTP/identity hiccup never throws the
      // handler (which would nack+drop the event and lose the in-app notice too).
      try {
        const seller = await getUserBasicInfo(payload.sellerId);
        if (seller?.email) {
          await emailService.sendMail({
            to: seller.email,
            subject: "Lệnh rút tiền đã được duyệt",
            html: renderWithdrawalApprovedEmail({
              fullName: seller.fullName,
              amount: payload.amount,
              bankName: payload.bankName,
              processedAt: payload.processedAt,
            }),
          });
          console.log(`📧 [${SERVICE_NAME}] WITHDRAWAL_APPROVED email sent to ${seller.email}`);
        } else {
          console.warn(`⚠️ [${SERVICE_NAME}] No email for seller ${payload.sellerId}; skipped withdrawal email`);
        }
      } catch (err) {
        console.error(`❌ [${SERVICE_NAME}] WITHDRAWAL_APPROVED email failed:`, err);
      }
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

  await eventBus.subscribe<SellerApprovedEvent>(
    EventNames.SELLER_APPROVED,
    async (event: DomainEvent<SellerApprovedEvent>) => {
      const payload = event.payload;
      console.log(`📥 [${SERVICE_NAME}] Received EVENT ${EventNames.SELLER_APPROVED} for User ${payload.userId}`);
      const prisma = dbService.getClient();

      await prisma.inAppNotification.create({
        data: {
          userId: payload.userId,
          title: "Đơn đăng ký giảng viên đã được duyệt!",
          content: `Chúc mừng ${payload.fullName}! Đơn đăng ký trở thành giảng viên của bạn đã được Admin phê duyệt. Bạn có thể bắt đầu tạo khóa học ngay bây giờ.`,
          type: "SELLER_APPROVED",
        },
      });

      console.log(`✅ [${SERVICE_NAME}] SELLER_APPROVED notification created for User ${payload.userId}`);
    }
  );

  await eventBus.subscribe<SellerRejectedEvent>(
    EventNames.SELLER_REJECTED,
    async (event: DomainEvent<SellerRejectedEvent>) => {
      const payload = event.payload;
      console.log(`📥 [${SERVICE_NAME}] Received EVENT ${EventNames.SELLER_REJECTED} for User ${payload.userId}`);
      const prisma = dbService.getClient();

      const shortReason = payload.reason && payload.reason.length > 200
        ? `${payload.reason.slice(0, 200).trim()}…`
        : payload.reason;

      await prisma.inAppNotification.create({
        data: {
          userId: payload.userId,
          title: "Đơn đăng ký giảng viên bị từ chối",
          content: `Đơn đăng ký trở thành giảng viên của bạn chưa được duyệt. Lý do: ${shortReason || "(không có lý do cụ thể)"}. Bạn có thể chỉnh sửa và gửi lại đơn.`,
          type: "SELLER_REJECTED",
          metadata: {
            rejectionReason: payload.reason,
          },
        },
      });

      console.log(`✅ [${SERVICE_NAME}] SELLER_REJECTED notification created for User ${payload.userId}`);
    }
  );

  await eventBus.subscribe<RefundApprovedEvent>(
    EventNames.REFUND_APPROVED,
    async (event: DomainEvent<RefundApprovedEvent>) => {
      const payload = event.payload;
      console.log(`📥 [${SERVICE_NAME}] Received EVENT ${EventNames.REFUND_APPROVED} for User ${payload.requesterId}`);
      const prisma = dbService.getClient();

      await prisma.inAppNotification.create({
        data: {
          userId: payload.requesterId,
          title: "Yêu cầu hoàn tiền đã được duyệt",
          content: `Yêu cầu hoàn tiền ${payload.amount.toLocaleString("vi-VN")}đ cho đơn #${payload.orderId.slice(0, 8)} đã được duyệt. Số tiền đã được cộng vào ví của bạn.`,
          type: "REFUND_APPROVED",
          metadata: {
            refundId: payload.refundId,
            orderId: payload.orderId,
            amount: payload.amount,
            adminNote: payload.adminNote,
            processedAt: payload.processedAt,
          },
        },
      });

      console.log(`✅ [${SERVICE_NAME}] REFUND_APPROVED notification created for User ${payload.requesterId}`);
    }
  );

  await eventBus.subscribe<RefundRejectedEvent>(
    EventNames.REFUND_REJECTED,
    async (event: DomainEvent<RefundRejectedEvent>) => {
      const payload = event.payload;
      console.log(`📥 [${SERVICE_NAME}] Received EVENT ${EventNames.REFUND_REJECTED} for User ${payload.requesterId}`);
      const prisma = dbService.getClient();

      const shortReason = payload.reason && payload.reason.length > 200
        ? `${payload.reason.slice(0, 200).trim()}…`
        : payload.reason;

      await prisma.inAppNotification.create({
        data: {
          userId: payload.requesterId,
          title: "Yêu cầu hoàn tiền bị từ chối",
          content: `Yêu cầu hoàn tiền ${payload.amount.toLocaleString("vi-VN")}đ cho đơn #${payload.orderId.slice(0, 8)} đã bị từ chối. Lý do: ${shortReason || "(không có lý do cụ thể)"}.`,
          type: "REFUND_REJECTED",
          metadata: {
            refundId: payload.refundId,
            orderId: payload.orderId,
            amount: payload.amount,
            reason: payload.reason,
            processedAt: payload.processedAt,
          },
        },
      });

      console.log(`✅ [${SERVICE_NAME}] REFUND_REJECTED notification created for User ${payload.requesterId}`);
    }
  );

  await registerEmailVerificationHandler(eventBus);
  await registerPasswordResetHandler(eventBus);

  console.log(`🐰 [${SERVICE_NAME}] RabbitMQ Event Handlers Initialized.`);
};
