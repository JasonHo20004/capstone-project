import {
  EventBusService,
  EventNames,
  type DomainEvent,
  type EmailVerificationRequestedEvent,
} from "@capstone/common";
import { emailService } from "../../../services/index.js";
import { SERVICE_NAME } from "../../../constants.js";

const renderHtml = (payload: EmailVerificationRequestedEvent): string => `
  <p>Hello ${payload.fullName},</p>
  <p>Thank you for registering. Please verify your email by clicking the link below:</p>
  <p><a href="${payload.verificationUrl}">Verify your email</a></p>
  <p>This link will expire in ${payload.expiresInMinutes} minutes.</p>
  <p>If you did not create an account, you can safely ignore this email.</p>
`;

export const registerEmailVerificationHandler = async (
  eventBus: EventBusService
): Promise<void> => {
  await eventBus.subscribe<EmailVerificationRequestedEvent>(
    EventNames.EMAIL_VERIFICATION_REQUESTED,
    async (event: DomainEvent<EmailVerificationRequestedEvent>) => {
      const payload = event.payload;
      console.log(
        `📥 [${SERVICE_NAME}] EMAIL_VERIFICATION_REQUESTED for ${payload.email}`
      );

      // Throwing here causes EventBusService to nack(false, false),
      // so the message is dropped. Configure a DLX/retry policy if you
      // want bounded retries on transient SMTP failures.
      await emailService.sendMail({
        to: payload.email,
        subject: "Verify your email address",
        html: renderHtml(payload),
      });
    }
  );
};
