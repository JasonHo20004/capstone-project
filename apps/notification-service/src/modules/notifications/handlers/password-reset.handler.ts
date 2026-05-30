import {
  EventBusService,
  EventNames,
  type DomainEvent,
  type PasswordResetRequestedEvent,
} from "@capstone/common";
import { emailService } from "../../../services/index.js";
import { SERVICE_NAME } from "../../../constants.js";

const renderHtml = (payload: PasswordResetRequestedEvent): string => `
  <p>Hello ${payload.fullName},</p>
  <p>We received a request to reset the password for your account. Click the link below to choose a new password:</p>
  <p><a href="${payload.resetUrl}">Reset your password</a></p>
  <p>This link will expire in ${payload.expiresInMinutes} minutes.</p>
  <p>If you did not request a password reset, you can safely ignore this email — your password will not be changed.</p>
`;

export const registerPasswordResetHandler = async (
  eventBus: EventBusService
): Promise<void> => {
  await eventBus.subscribe<PasswordResetRequestedEvent>(
    EventNames.PASSWORD_RESET_REQUESTED,
    async (event: DomainEvent<PasswordResetRequestedEvent>) => {
      const payload = event.payload;
      console.log(
        `📥 [${SERVICE_NAME}] PASSWORD_RESET_REQUESTED for ${payload.email}`
      );

      // Throwing here causes EventBusService to nack(false, false),
      // so the message is dropped. Configure a DLX/retry policy if you
      // want bounded retries on transient SMTP failures.
      await emailService.sendMail({
        to: payload.email,
        subject: "Reset your password",
        html: renderHtml(payload),
      });
    }
  );
};
