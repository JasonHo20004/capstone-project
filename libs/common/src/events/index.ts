// =============================================================================
// Event System - For async communication between microservices
// =============================================================================

// Event Names (Domain.Action pattern)
export enum EventNames {
  // Identity Events
  USER_REGISTERED = "identity.user.registered",
  USER_VERIFIED = "identity.user.verified",
  USER_UPDATED = "identity.user.updated",
  EMAIL_VERIFICATION_REQUESTED = "identity.email.verification_requested",
  PASSWORD_RESET_REQUESTED = "identity.password.reset_requested",
  SELLER_APPROVED = "identity.seller.approved",
  SELLER_REJECTED = "identity.seller.rejected",

  // Course Events
  COURSE_CREATED = "course.created",
  COURSE_PUBLISHED = "course.published",
  COURSE_UPDATED = "course.updated",
  COURSE_DELETED = "course.deleted",
  COURSE_SUBMITTED = "course.submitted",
  COURSE_REJECTED = "course.rejected",
  LESSON_COMPLETED = "course.lesson.completed",
  COURSE_ACCESS_GRANTED = "course.access.granted",

  // Assessment Events
  ASSESSMENT_SUBMITTED = "assessment.submitted",
  ASSESSMENT_SCORED = "assessment.scored",
  
  // AI Processing Events
  AI_GRADING_STARTED = "ai.grading.started",
  AI_GRADING_COMPLETED = "ai.grading.completed",
  AI_GRADING_FAILED = "ai.grading.failed",
  TEST_COMPLETED = "assessment.test.completed",
  PRACTICE_SESSION_STARTED = "assessment.session.started",
  PRACTICE_SESSION_COMPLETED = "assessment.session.completed",

  // Flashcard Events
  DECK_CREATED = "flashcard.deck.created",
  FLASHCARD_REVIEWED = "flashcard.reviewed",
  
  // Payment Events
  PAYMENT_SUCCESS = "payment.success",
  PAYMENT_FAILED = "payment.failed",
  ORDER_CREATED = "payment.order.created",
  ORDER_PAID = "payment.order.paid",
  TOPUP_COMPLETED = "payment.topup.completed",
  WITHDRAWAL_REQUESTED = "payment.withdrawal.requested",
  WITHDRAWAL_APPROVED = "payment.withdrawal.approved",
  WITHDRAWAL_REJECTED = "payment.withdrawal.rejected",
  REFUND_APPROVED = "payment.refund.approved",
  REFUND_REJECTED = "payment.refund.rejected",

  // Notification Events
  NOTIFICATION_CREATED = "notification.created",
  NOTIFICATION_SENT = "notification.sent",
}

// Event Payload Types
export interface UserRegisteredEvent {
  userId: string;
  email: string;
  fullName: string;
}

export interface UserVerifiedEvent {
  userId: string;
  email: string;
}

export interface EmailVerificationRequestedEvent {
  userId: string;
  email: string;
  fullName: string;
  verificationUrl: string;
  expiresInMinutes: number;
}

export interface PasswordResetRequestedEvent {
  userId: string;
  email: string;
  fullName: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export interface SellerApprovedEvent {
  userId: string;
  sellerId: string;
  email: string;
  fullName: string;
}

export interface SellerRejectedEvent {
  userId: string;
  email: string;
  fullName: string;
  reason: string;
}

export interface CoursePublishedEvent {
  courseId: string;
  sellerId: string;
  title: string;
  price: number;
}

export interface CourseSubmittedEvent {
  courseId: string;
  sellerId: string;
  title: string;
  submittedAt: Date;
}

export interface CourseRejectedEvent {
  courseId: string;
  sellerId: string;
  title: string;
  reason: string;
  rejectedAt: Date;
  reviewerId: string;
}

export interface WithdrawalRequestedEvent {
  requestId: string;
  sellerId: string;
  amount: number;
  bankName: string;
  createdAt: Date;
}

export interface WithdrawalApprovedEvent {
  requestId: string;
  sellerId: string;
  amount: number;
  bankName: string;
  processedAt: Date;
  proofImageUrl?: string;
}

export interface WithdrawalRejectedEvent {
  requestId: string;
  sellerId: string;
  amount: number;
  reason: string;
  processedAt: Date;
}

export interface RefundApprovedEvent {
  refundId: string;
  orderId: string;
  requesterId: string;
  amount: number;
  adminId: string;
  adminNote?: string;
  processedAt: Date;
}

export interface RefundRejectedEvent {
  refundId: string;
  orderId: string;
  requesterId: string;
  amount: number;
  adminId: string;
  reason: string;
  processedAt: Date;
}

export interface CourseAccessGrantedEvent {
  userId: string;
  courseId: string;
  orderId: string;
  grantedAt: Date;
}

export interface TestCompletedEvent {
  userId: string;
  testId: string;
  sessionId: string;
  score: number;
  courseId?: string;
  isFinalTest: boolean;
}

export interface PaymentSuccessEvent {
  userId: string;
  orderId: string;
  amount: number;
  courseIds: string[];
}

export interface OrderPaidEvent {
  userId: string;
  orderId: string;
  courseIds: string[];
  totalAmount: number;
}

export interface NotificationEvent {
  userId: string;
  type: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

// Generic Event Wrapper
export interface DomainEvent<T = unknown> {
  eventId: string;
  eventName: EventNames;
  timestamp: Date;
  payload: T;
  correlationId?: string;
}

export * from "./ai-assessment.events.js";