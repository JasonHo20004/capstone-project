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
  SELLER_APPROVED = "identity.seller.approved",
  SELLER_REJECTED = "identity.seller.rejected",

  // Course Events
  COURSE_CREATED = "course.created",
  COURSE_PUBLISHED = "course.published",
  COURSE_UPDATED = "course.updated",
  COURSE_DELETED = "course.deleted",
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
  SUBSCRIPTION_RENEWED = "payment.subscription.renewed",
  SUBSCRIPTION_EXPIRED = "payment.subscription.expired",
  SUBSCRIPTION_EXPIRING_SOON = "payment.subscription.expiring_soon",

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

export interface SubscriptionExpiringEvent {
  userId: string;
  contractId: string;
  expiresAt: Date;
  daysRemaining: number;
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