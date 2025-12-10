import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private resend: Resend | null = null;
  private maxRetries: number = 3;
  private retryDelayMs: number = 1000;

  private validateConfiguration(): void {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "Cấu hình Resend bị thiếu. Vui lòng thiết lập RESEND_API_KEY trong biến môi trường."
      );
    }
  }

  private getResendClient(): Resend {
    if (!this.resend) {
      this.validateConfiguration();
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
    return this.resend;
  }

  public isEmailConfigured(): boolean {
    try {
      this.validateConfiguration();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retriesLeft: number = this.maxRetries,
    delay: number = this.retryDelayMs
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      // Don't retry on 4xx errors (client errors)
      if (error?.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      if (retriesLeft <= 0) {
        throw error;
      }

      const jitter = Math.random() * 0.3 * delay;
      const backoffDelay = delay + jitter;

      console.warn(
        `Email send failed, retrying in ${Math.round(backoffDelay)}ms... (${retriesLeft} retries left)`
      );

      await this.sleep(backoffDelay);
      return this.retryWithBackoff(fn, retriesLeft - 1, delay * 2);
    }
  }

  public async sendMail(options: SendEmailOptions): Promise<void> {
    try {
      if (!this.isEmailConfigured()) {
        throw new Error(
          "Dịch vụ email không được cấu hình. Vui lòng kiểm tra biến môi trường RESEND_API_KEY."
        );
      }

      const resend = this.getResendClient();
      const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(options.to)) {
        throw new Error(`Địa chỉ email không hợp lệ: ${options.to}`);
      }

      // Send email with retry logic
      const result = await this.retryWithBackoff(async () => {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });

        if (error) {
          throw error;
        }

        return data;
      });

    } catch (error: any) {
      // Provide helpful error messages
      if (error?.message) {
        // Handle Resend-specific errors
        if (error.message.includes("API key")) {
          throw new Error(
            `API key Resend không hợp lệ. Vui lòng kiểm tra RESEND_API_KEY trong biến môi trường. ` +
            `Original error: ${error.message}`
          );
        } else if (error.message.includes("domain") || error.message.includes("From")) {
          throw new Error(
            `Địa chỉ email người gửi không hợp lệ hoặc chưa được xác minh. ` +
            `Vui lòng kiểm tra EMAIL_FROM hoặc xác minh domain trong Resend dashboard. ` +
            `Original error: ${error.message}`
          );
        } else if (error.message.includes("rate limit") || error.statusCode === 429) {
          throw new Error(
            `Đã vượt quá giới hạn gửi email. Vui lòng thử lại sau. ` +
            `Original error: ${error.message}`
          );
        } else {
          throw new Error(`Gửi email thất bại: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
  }
}

export const emailService = new EmailService();
export default emailService;


