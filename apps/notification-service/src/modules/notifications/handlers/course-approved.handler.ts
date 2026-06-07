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

const formatVnd = (n: number): string => `${n.toLocaleString("vi-VN")}đ`;

// Branded, email-client-safe HTML (table layout + inline styles). Renders a
// payout-confirmation with the amount, destination bank, a short transaction
// reference, and — when present — a button to the admin's transfer proof image.
const renderWithdrawalApprovedEmail = (p: {
  fullName: string;
  amount: number;
  bankName: string;
  processedAt: Date | string;
  requestId: string;
  proofImageUrl?: string;
}): string => {
  const ref = p.requestId.slice(0, 8).toUpperCase();
  const when = new Date(p.processedAt).toLocaleString("vi-VN");

  const detailRow = (label: string, value: string): string => `
            <tr>
              <td style="padding:14px 20px;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">${label}</td>
              <td style="padding:14px 20px;font-size:14px;font-weight:600;color:#0f172a;text-align:right;border-top:1px solid #e2e8f0;">${value}</td>
            </tr>`;

  const proofButton = p.proofImageUrl
    ? `
        <tr>
          <td align="center" style="padding:24px 32px 0;">
            <a href="${p.proofImageUrl}" target="_blank" rel="noopener"
               style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;">
              Xem ảnh xác nhận chuyển khoản
            </a>
          </td>
        </tr>`
    : "";

  return `
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Lệnh rút tiền đã được duyệt</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(15,23,42,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#4f46e5;padding:22px 32px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.2px;">English Learning Platform</span>
                </td>
              </tr>
              <!-- Success badge + title -->
              <tr>
                <td align="center" style="padding:32px 32px 0;">
                  <div style="width:64px;height:64px;line-height:64px;border-radius:50%;background:#dcfce7;color:#16a34a;font-size:34px;font-weight:700;">&#10003;</div>
                  <h1 style="margin:18px 0 0;font-size:22px;font-weight:700;color:#0f172a;">Lệnh rút tiền đã được duyệt</h1>
                </td>
              </tr>
              <!-- Greeting -->
              <tr>
                <td style="padding:16px 32px 0;font-size:15px;line-height:1.6;color:#334155;">
                  Xin chào <strong>${p.fullName || "bạn"}</strong>, lệnh rút tiền của bạn đã được quản trị viên duyệt và xác nhận chuyển khoản. Chi tiết giao dịch:
                </td>
              </tr>
              <!-- Details card -->
              <tr>
                <td style="padding:20px 32px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                    <tr>
                      <td style="padding:18px 20px;font-size:13px;color:#64748b;">Số tiền</td>
                      <td style="padding:18px 20px;font-size:22px;font-weight:700;color:#16a34a;text-align:right;">${formatVnd(p.amount)}</td>
                    </tr>
                    ${detailRow("Ngân hàng nhận", p.bankName)}
                    ${detailRow("Mã giao dịch", ref)}
                    ${detailRow("Thời gian xử lý", when)}
                  </table>
                </td>
              </tr>
              ${proofButton}
              <!-- Note -->
              <tr>
                <td style="padding:24px 32px 0;font-size:13px;line-height:1.6;color:#64748b;">
                  Tiền thường về tài khoản trong <strong>1–3 ngày làm việc</strong> tuỳ ngân hàng. Nếu quá thời gian này mà chưa nhận được, vui lòng liên hệ bộ phận hỗ trợ kèm mã giao dịch <strong>${ref}</strong>.
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:28px 32px 32px;">
                  <div style="border-top:1px solid #e2e8f0;padding-top:18px;font-size:12px;line-height:1.6;color:#94a3b8;">
                    Đây là email tự động, vui lòng không trả lời trực tiếp.<br/>
                    © English Learning Platform — Đội ngũ hỗ trợ.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};

// Branded, email-client-safe HTML (table layout + inline styles). Renders a
// payout-rejection notice with the amount, the admin's reason, a short
// transaction reference, and a reassurance that the funds were returned to the
// seller's available balance (mirrors the in-app refund semantics).
const renderWithdrawalRejectedEmail = (p: {
  fullName: string;
  amount: number;
  reason: string;
  processedAt: Date | string;
  requestId: string;
}): string => {
  const ref = p.requestId.slice(0, 8).toUpperCase();
  const when = new Date(p.processedAt).toLocaleString("vi-VN");
  const reason = p.reason?.trim() || "(không có lý do cụ thể)";

  const detailRow = (label: string, value: string): string => `
            <tr>
              <td style="padding:14px 20px;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">${label}</td>
              <td style="padding:14px 20px;font-size:14px;font-weight:600;color:#0f172a;text-align:right;border-top:1px solid #e2e8f0;">${value}</td>
            </tr>`;

  return `
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Lệnh rút tiền bị từ chối</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(15,23,42,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#4f46e5;padding:22px 32px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.2px;">English Learning Platform</span>
                </td>
              </tr>
              <!-- Rejected badge + title -->
              <tr>
                <td align="center" style="padding:32px 32px 0;">
                  <div style="width:64px;height:64px;line-height:64px;border-radius:50%;background:#fee2e2;color:#dc2626;font-size:34px;font-weight:700;">&#10005;</div>
                  <h1 style="margin:18px 0 0;font-size:22px;font-weight:700;color:#0f172a;">Lệnh rút tiền bị từ chối</h1>
                </td>
              </tr>
              <!-- Greeting -->
              <tr>
                <td style="padding:16px 32px 0;font-size:15px;line-height:1.6;color:#334155;">
                  Xin chào <strong>${p.fullName || "bạn"}</strong>, rất tiếc lệnh rút tiền của bạn đã bị quản trị viên từ chối. Chi tiết:
                </td>
              </tr>
              <!-- Details card -->
              <tr>
                <td style="padding:20px 32px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                    <tr>
                      <td style="padding:18px 20px;font-size:13px;color:#64748b;">Số tiền</td>
                      <td style="padding:18px 20px;font-size:22px;font-weight:700;color:#dc2626;text-align:right;">${formatVnd(p.amount)}</td>
                    </tr>
                    ${detailRow("Mã giao dịch", ref)}
                    ${detailRow("Thời gian xử lý", when)}
                  </table>
                </td>
              </tr>
              <!-- Reason -->
              <tr>
                <td style="padding:20px 32px 0;">
                  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;">
                    <div style="font-size:13px;font-weight:600;color:#b91c1c;margin-bottom:6px;">Lý do từ chối</div>
                    <div style="font-size:14px;line-height:1.6;color:#7f1d1d;">${reason}</div>
                  </div>
                </td>
              </tr>
              <!-- Refund reassurance -->
              <tr>
                <td style="padding:20px 32px 0;">
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;font-size:14px;line-height:1.6;color:#166534;">
                    💰 Số tiền <strong>${formatVnd(p.amount)}</strong> đã được hoàn lại vào <strong>số dư khả dụng</strong> của bạn. Bạn có thể chỉnh sửa thông tin và tạo lại lệnh rút tiền bất cứ lúc nào.
                  </div>
                </td>
              </tr>
              <!-- Note -->
              <tr>
                <td style="padding:24px 32px 0;font-size:13px;line-height:1.6;color:#64748b;">
                  Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ kèm mã giao dịch <strong>${ref}</strong>.
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:28px 32px 32px;">
                  <div style="border-top:1px solid #e2e8f0;padding-top:18px;font-size:12px;line-height:1.6;color:#94a3b8;">
                    Đây là email tự động, vui lòng không trả lời trực tiếp.<br/>
                    © English Learning Platform — Đội ngũ hỗ trợ.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};
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
              requestId: payload.requestId,
              proofImageUrl: payload.proofImageUrl,
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

      // Best-effort email — wrapped so an SMTP/identity hiccup never throws the
      // handler (which would nack+drop the event and lose the in-app notice too).
      try {
        const seller = await getUserBasicInfo(payload.sellerId);
        if (seller?.email) {
          await emailService.sendMail({
            to: seller.email,
            subject: "Lệnh rút tiền bị từ chối",
            html: renderWithdrawalRejectedEmail({
              fullName: seller.fullName,
              amount: payload.amount,
              reason: payload.reason,
              processedAt: payload.processedAt,
              requestId: payload.requestId,
            }),
          });
          console.log(`📧 [${SERVICE_NAME}] WITHDRAWAL_REJECTED email sent to ${seller.email}`);
        } else {
          console.warn(`⚠️ [${SERVICE_NAME}] No email for seller ${payload.sellerId}; skipped withdrawal-rejected email`);
        }
      } catch (err) {
        console.error(`❌ [${SERVICE_NAME}] WITHDRAWAL_REJECTED email failed:`, err);
      }
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
