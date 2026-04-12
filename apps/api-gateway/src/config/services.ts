// =============================================================================
// API Gateway - Service Configuration
// =============================================================================

export interface ServiceConfig {
  name: string;
  url: string;
  prefix: string;
  /** Optional: use array for multiple path prefixes (e.g. seller routes split across services) */
  pathFilter?: string | string[];
}

export const services: ServiceConfig[] = [
  // Seller routes - identity-service (apply, application, profile)
  {
    name: "identity-service",
    url: process.env.IDENTITY_SERVICE_URL || "http://localhost:3001",
    prefix: "/api/seller",
    pathFilter: ["/api/seller/apply", "/api/seller/application", "/api/seller/profile"],
  },
  // Seller routes - course-service (dashboard, learners, comments, courses, fees)
  {
    name: "course-service",
    url: process.env.COURSE_SERVICE_URL || "http://localhost:3002",
    prefix: "/api/seller",
    pathFilter: [
      "/api/seller/dashboard",
      "/api/seller/learners",
      "/api/seller/comments",
      "/api/seller/courses",
      "/api/seller/fees",
    ],
  },
  {
    name: "identity-service",
    url: process.env.IDENTITY_SERVICE_URL || "http://localhost:3001",
    prefix: "/api/auth",
  },
  {
    name: "identity-service",
    url: process.env.IDENTITY_SERVICE_URL || "http://localhost:3001",
    prefix: "/api/users",
  },
  {
    name: "course-service",
    url: process.env.COURSE_SERVICE_URL || "http://localhost:3002",
    prefix: "/api/courses",
  },
  {
    name: "course-service",
    url: process.env.COURSE_SERVICE_URL || "http://localhost:3002",
    prefix: "/api/student",
  },
  {
    name: "course-service",
    url: process.env.COURSE_SERVICE_URL || "http://localhost:3002",
    prefix: "/api/lessons",
  },
  {
    name: "assessment-service",
    url: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003",
    prefix: "/api/tests",
  },
  {
    name: "assessment-service",
    url: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003",
    prefix: "/api/sessions",
  },
  {
    name: "assessment-service",
    url: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003",
    prefix: "/api/practice-sessions",
  },
  {
    name: "assessment-service",
    url: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003",
    prefix: "/api/dictation",
  },
  {
    name: "assessment-service",
    url: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003",
    prefix: "/api/test-comments",
  },
  {
    name: "flashcard-service",
    url: process.env.FLASHCARD_SERVICE_URL || "http://localhost:3004",
    prefix: "/api/flashcard-decks",
  },
  {
    name: "flashcard-service",
    url: process.env.FLASHCARD_SERVICE_URL || "http://localhost:3004",
    prefix: "/api/flashcards",
  },
  {
    name: "flashcard-service",
    url: process.env.FLASHCARD_SERVICE_URL || "http://localhost:3004",
    prefix: "/api/flashcard-review",
  },
  {
    name: "flashcard-service",
    url: process.env.FLASHCARD_SERVICE_URL || "http://localhost:3004",
    prefix: "/api/tags",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/wallet",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/orders",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/carts",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/topup-orders",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/subscriptions",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/commission",
  },
  {
    name: "payment-service",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:3005",
    prefix: "/api/withdrawals",
  },
  {
    name: "notification-service",
    url: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006",
    prefix: "/api/notifications",
  },
  {
    name: "course-service",
    url: process.env.COURSE_SERVICE_URL || "http://localhost:3002",
    prefix: "/api/admin",
  },
  // practice-service REMOVED — consolidated into assessment-service (/api/tests)
  {
    name: "ai-evaluation-service",
    url: process.env.AI_EVALUATION_SERVICE_URL || "http://localhost:3007",
    prefix: "/api/ai",
  },
  {
    name: "rag-service",
    url: process.env.RAG_SERVICE_URL || "http://localhost:8000",
    prefix: "/api/rag",
  },
];

export function getServiceByPrefix(prefix: string): ServiceConfig | undefined {
  return services.find((s) => prefix.startsWith(s.prefix));
}
