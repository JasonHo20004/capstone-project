// =============================================================================
// Identity Service - Email Service
// =============================================================================

import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendMail(options: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@example.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`📧 [Identity Service] Email sent to ${options.to}`);
    } catch (error) {
      console.error("❌ [Identity Service] Failed to send email:", error);
      throw error;
    }
  }
}

export const emailService = EmailService.getInstance();
export default emailService;
