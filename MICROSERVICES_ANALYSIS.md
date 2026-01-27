# Phân Tích & Kiến Trúc Microservices - English Learning Platform

Tài liệu này đề xuất kế hoạch chuyển đổi từ kiến trúc Monolithic hiện tại sang kiến trúc Microservices. Việc phân tách giúp hệ thống dễ dàng mở rộng, bảo trì độc lập từng tính năng và tối ưu hóa hiệu năng.

## 1. Tổng Quan Kiến Trúc Đề Xuất

Chúng ta sẽ chia hệ thống thành **06 Service chính** (Core Services) và **01 API Gateway**. Mỗi service sẽ quản lý database riêng biệt (Database per Service pattern) để đảm bảo tính độc lập.

### Danh Sách Các Services:

1.  **Identity Service (Auth)**: Quản lý người dùng, xác thực, phân quyền.
2.  **Course Service (LMS)**: Quản lý khóa học, bài học, tài liệu.
3.  **Assessment Service (Testing)**: Quản lý bài kiểm tra, ngân hàng câu hỏi, thực hành.
4.  **Flashcard Service (SRS)**: Quản lý thẻ ghi nhớ và thuật toán lặp lại ngắt quãng.
5.  **Payment Service (Finance)**: Quản lý ví, giao dịch, đơn hàng, gói đăng ký.
6.  **Notification Service**: Quản lý thông báo (Email, Push, In-app).

---

## 2. Chi Tiết Các Services & Phân Chia Database

### 2.1. Identity Service (Auth)
**Chức năng:** Đăng ký, đăng nhập, quên mật khẩu, quản lý profile, xác thực JWT.
**Database Tables:**
*   `User` (Lược bỏ các trường liên quan đến nghiệp vụ khác, chỉ giữ thông tin cơ bản).
*   `RefreshToken`
*   `AdministratorProfile`, `CourseSellerProfile`, `CourseSellerApplication`
*   `Policy`

**Giao tiếp:**
*   Cung cấp API để các service khác lấy thông tin user (thông qua gRPC hoặc REST nội bộ).
*   Phát hành JWT chứa `userId` và `role`.

### 2.2. Course Service (LMS)
**Chức năng:** Tạo/sửa/xóa khóa học, quản lý bài học, video, bình luận, đánh giá.
**Database Tables:**
*   `Course`
*   `Lesson`, `UserLesson` (Tiến độ học)
*   `MediaAsset`
*   `Comment`
*   `Rating`
*   `Report` (Liên quan đến content khóa học)
*   `CourseLevel`

**Thách thức:** Cần lưu `sellerId` (từ Identity Service) để biết ai sở hữu khóa học.

### 2.3. Assessment Service (Testing)
**Chức năng:** Tổ chức thi, chấm điểm, luyện tập.
**Database Tables:**
*   `Test`, `EnglishTestType`
*   `Section`, `Passage`, `Question`
*   `PracticeSession`, `UserAnswer`
*   `ScoreConversion`
*   `CourseTest` (Liên kết giữa Course và Test)

**Sự kiện:** Khi một bài kiểm tra hoàn thành -> Bắn event `Testing.Completed` để Course Service cập nhật tiến độ nếu đó là Final Test.

### 2.4. Flashcard Service (Spaced Repetition)
**Chức năng:** Học từ vựng theo phương pháp SRS. Service này có logic tính toán thời gian ôn tập riêng biệt, tải cao.
**Database Tables:**
*   `FlashcardDeck`, `DeckTag`, `Tag`
*   `Flashcard`
*   `UserFlashcardProgress` (Lưu trạng thái SRS của user)

### 2.5. Payment Service (Billing & Orders)
**Chức năng:** Nạp tiền, thanh toán khóa học, quản lý ví, hợp đồng người bán.
**Database Tables:**
*   `Wallet`, `Transaction`
*   `TopupOrder`
*   `SubscriptionContract`, `SubscriptionPlan`
*   `Cart`, `CartItem`, `Order`
*   `UserActivity` (Lịch sử giao dịch/hoạt động liên quan phí)

**Luồng quan trọng:**
1.  User tạo đơn hàng (`Order`).
2.  Payment xử lý trừ tiền ví.
3.  Nếu thành công -> Bắn event `Order.Paid`.
4.  Course Service nhận event -> Cấp quyền truy cập khóa học cho User.

### 2.6. Notification Service
**Chức năng:** Gửi email, thông báo trong ứng dụng. Lắng nghe các sự kiện từ hệ thống để gửi thông báo tương ứng.
**Database Tables:**
*   `Notification`, `NotificationType`
*   `InAppNotification`, `UserNotification`

---

## 3. Kiến Trúc Hạ Tầng (Infrastructure)

### 3.1. API Gateway
*   Sử dụng **Nginx**, **Kong**, hoặc **Express Gateway**.
*   Nhiệm vụ: Route request từ Frontend đến đúng Microservice.
*   Xử lý SSL, Rate Limiting, CORS tập trung.

### 3.2. Cơ Chế Giao Tiếp (Communication)
*   **Synchronous (Đồng bộ):** REST API hoặc gRPC. Dùng khi Service A cần dữ liệu ngay lập tức từ Service B (Ví dụ: Payment cần lấy thông tin chi tiết User từ Identity).
*   **Asynchronous (Bất đồng bộ - Event Driven):** Sử dụng Message Broker (**RabbitMQ** hoặc **Kafka**, hoặc tận dụng **Redis Pub/Sub** hiện có cho đơn giản).
    *   Ví dụ: `PaymentService` trừ tiền xong -> Publish `PAYMENT_SUCCESS` -> `CourseService` subscribe để Active khóa học cho user.

### 3.3. Shared Data Problem (Vấn đề dữ liệu chung)
*   **User ID:** Sử dụng UUID của User làm khóa chính xuyên suốt các hệ thống. Các service khác sẽ lưu `userId` dưới dạng string/uuid đơn thuần (không có Foreign Key constraint trỏ thẳng sang bảng User của Identity Service).

---

## 4. Lộ Trình Chuyển Đổi (Migration Plan)

Để tránh rủi ro, không nên đập đi xây lại toàn bộ một lúc.

**Giai đoạn 1: Tách Identity Service & Notification**
*   Tách module Auth và User ra thành service riêng.
*   Tách hệ thống Notification ra service riêng để giảm tải xử lý background.
*   Các module còn lại giữ nguyên trong Monolith (gọi là "Core Service").

**Giai đoạn 2: Tách Flashcard Service**
*   Flashcard có nghiệp vụ khá độc lập. Tách ra để tối ưu database riêng cho việc truy vấn thẻ bài nhiều.

**Giai đoạn 3: Tách Assessment & Payment**
*   Giai đoạn phức tạp nhất do dính líu đến transaction tiền tệ và dữ liệu thi cử liên kết khóa học.

## 5. Cấu Trúc Thư Mục Đề Xuất (Repo Monorepo)

```
apps/
  ├── identity-service/
  ├── course-service/
  ├── payment-service/
  ├── ...
libs/
  ├── common/ (Shared DTOs, utilities, database client configs)
docker-compose.yml (Orchestration toàn bộ services)
```
