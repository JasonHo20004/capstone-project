import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: any | null = null;

  private createTransporter(): any {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
      throw new Error("SMTP_HOST and SMTP_PORT must be set");
    }

    const secure = process.env.SMTP_SECURE === "true";
    const port = Number(process.env.SMTP_PORT);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });

    return transporter;
  }

  private getTransporter(): any {
    if (!this.transporter) {
      this.transporter = this.createTransporter();
    }
    return this.transporter;
  }

  public async sendMail(options: SendEmailOptions): Promise<void> {
    const transporter = this.getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;


