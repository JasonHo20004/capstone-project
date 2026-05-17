import { EventBusService, EventNames, CoursePublishedEvent, DomainEvent } from "@capstone/common";
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

      // Create an In-app notification for the instructor
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

  await registerEmailVerificationHandler(eventBus);

  console.log(`🐰 [${SERVICE_NAME}] RabbitMQ Event Handlers Initialized.`);
};
