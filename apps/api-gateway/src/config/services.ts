// =============================================================================
// API Gateway - Service Configuration
// =============================================================================

export interface ServiceConfig {
  name: string;
  url: string;
  prefix: string;
}

export const services: ServiceConfig[] = [
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
    prefix: "/api/practice-sessions",
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
    name: "notification-service",
    url: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006",
    prefix: "/api/notifications",
  },
];

export function getServiceByPrefix(prefix: string): ServiceConfig | undefined {
  return services.find((s) => prefix.startsWith(s.prefix));
}
