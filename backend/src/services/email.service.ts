import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: any | null = null;
  private isConfigured: boolean = false;

  private validateConfiguration(): void {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
      this.isConfigured = false;
      throw new Error(
        "SMTP configuration is missing. Please set SMTP_HOST and SMTP_PORT environment variables."
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      this.isConfigured = false;
      throw new Error(
        "SMTP authentication is missing. Please set SMTP_USER and SMTP_PASS environment variables."
      );
    }

    this.isConfigured = true;
  }

  private createTransporter(): any {
    this.validateConfiguration();

    const secure = process.env.SMTP_SECURE === "true";
    const port = Number(process.env.SMTP_PORT);

    if (isNaN(port) || port <= 0) {
      throw new Error(
        `Invalid SMTP_PORT: ${process.env.SMTP_PORT}. Must be a valid port number.`
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
      requireTLS: port === 587, // Require TLS for port 587
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    return transporter;
  }

  private getTransporter(): any {
    if (!this.transporter) {
      this.transporter = this.createTransporter();
    }
    return this.transporter;
  }

  public isEmailConfigured(): boolean {
    try {
      this.validateConfiguration();
      return true;
    } catch {
      return false;
    }
  }

  public async sendMail(options: SendEmailOptions): Promise<void> {
    try {
      if (!this.isEmailConfigured()) {
        throw new Error(
          "Email service is not configured. Please check your SMTP environment variables."
        );
      }

      const transporter = this.getTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "no-reply@example.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error: any) {
      // Provide more helpful error messages
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          `Cannot connect to SMTP server at ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}. ` +
          `Please check: 1) SMTP_HOST and SMTP_PORT are correct, 2) Network/firewall allows connections, ` +
          `3) SMTP server is running and accessible. Original error: ${error.message}`
        );
      } else if (error.code === "ETIMEDOUT") {
        throw new Error(
          `Connection to SMTP server timed out. Please check your network connection and SMTP server status. ` +
          `Original error: ${error.message}`
        );
      } else if (error.code === "EAUTH") {
        throw new Error(
          `SMTP authentication failed. Please check SMTP_USER and SMTP_PASS are correct. ` +
          `Original error: ${error.message}`
        );
      } else if (error.message) {
        throw new Error(`Failed to send email: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}

export const emailService = new EmailService();
export default emailService;


