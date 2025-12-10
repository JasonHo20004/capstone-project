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
        "Cấu hình SMTP bị thiếu. Vui lòng thiết lập SMTP_HOST và SMTP_PORT biến môi trường."
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      this.isConfigured = false;
      throw new Error(
        "Cấu hình xác thực SMTP bị thiếu. Vui lòng thiết lập SMTP_USER và SMTP_PASS biến môi trường."
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
        `Cổng SMTP_PORT không hợp lệ: ${process.env.SMTP_PORT}. Vui lòng cung cấp một số cổng hợp lệ.`
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
          "Dịch vụ email không được cấu hình. Vui lòng kiểm tra các biến môi trường SMTP."
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
          `Không thể kết nối đến SMTP server tại ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}. ` +
          `Vui lòng kiểm tra: 1) SMTP_HOST và SMTP_PORT có đúng không, 2) Firewall/network cho phép kết nối, ` +
          `3) SMTP server đang chạy và có thể truy cập. Original error: ${error.message}`
        );
      } else if (error.code === "ETIMEDOUT") {
        throw new Error(
          `Kết nối SMTP server đã hết thời gian chờ. Vui lòng kiểm tra kết nối mạng và trạng thái SMTP server. ` +
          `Original error: ${error.message}`
        );
      } else if (error.code === "EAUTH") {
        throw new Error(
          `Xác thực SMTP thất bại. Vui lòng kiểm tra SMTP_USER và SMTP_PASS có đúng không. ` +
          `Original error: ${error.message}`
        );
      } else if (error.message) {
        throw new Error(`Gửi email thất bại: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}

export const emailService = new EmailService();
export default emailService;


