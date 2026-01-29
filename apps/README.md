# Microservices Architecture - English Learning Platform

This document describes the microservices architecture refactored from the original monolithic backend.

## 📁 Project Structure

```
├── apps/
│   ├── api-gateway/           # API Gateway (Port 3000)
│   ├── identity-service/      # Auth & User Management (Port 3001)
│   ├── course-service/        # Course & Lesson Management (Port 3002)
│   ├── assessment-service/    # Tests & Practice Sessions (Port 3003)
│   ├── flashcard-service/     # Flashcards & SRS (Port 3004)
│   ├── payment-service/       # Wallet, Orders, Subscriptions (Port 3005)
│   └── notification-service/  # Notifications (Port 3006)
├── libs/
│   └── common/                # Shared utilities, types, middlewares
├── docker-compose.yml         # Service orchestration
└── pnpm-workspace.yaml        # Monorepo configuration
```

## 🏗️ Services Overview

### 1. API Gateway (Port 3000)
- **Purpose**: Single entry point for all client requests
- **Features**:
  - Route proxying to appropriate microservices
  - CORS handling
  - Rate limiting (configurable)
  - Request logging

### 2. Identity Service (Port 3001)
- **Purpose**: User authentication and authorization
- **Database Tables**: User, RefreshToken, CourseSellerProfile, AdministratorProfile, CourseSellerApplication, Policy
- **Endpoints**:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/refresh` - Refresh tokens
  - `POST /api/auth/logout` - User logout
  - `GET /api/auth/verify` - Email verification
  - `GET /api/users/profile` - Get user profile
  - `PATCH /api/users/profile` - Update profile
  - `GET /api/users/internal/:id` - Internal API for other services

### 3. Course Service (Port 3002)
- **Purpose**: Course and lesson management
- **Database Tables**: Course, Lesson, MediaAsset, Comment, Rating, Report, UserLesson, UserActivity
- **Endpoints**:
  - `GET /api/courses/published` - Get published courses
  - `GET /api/courses/:id` - Get course details
  - `POST /api/courses` - Create course (seller)
  - `PATCH /api/courses/:id` - Update course
  - `POST /api/courses/:id/publish` - Publish course
  - `DELETE /api/courses/:id` - Delete course

### 4. Assessment Service (Port 3003)
- **Purpose**: Tests, practice sessions, and scoring
- **Database Tables**: Test, Section, Passage, Question, PracticeSession, UserAnswer, EnglishTestType, ScoreConversion

### 5. Flashcard Service (Port 3004)
- **Purpose**: Flashcard management with spaced repetition system (SRS)
- **Database Tables**: FlashcardDeck, Flashcard, DeckTag, Tag, UserFlashcardProgress

### 6. Payment Service (Port 3005)
- **Purpose**: Financial transactions, wallet, orders, subscriptions
- **Database Tables**: Wallet, Transaction, TopupOrder, Cart, CartItem, Order, SubscriptionContract, SubscriptionPlan
- **Endpoints**:
  - `GET /api/wallet` - Get wallet balance
  - `POST /api/wallet/deposit` - Deposit to wallet
  - `GET /api/wallet/transactions` - Transaction history
  - `POST /api/orders` - Create order
  - `POST /api/orders/:id/pay` - Pay order

### 7. Notification Service (Port 3006)
- **Purpose**: Email and in-app notifications
- **Database Tables**: NotificationType, Notification, InAppNotification, UserNotification

## 🔄 Communication Patterns

### Synchronous (REST/HTTP)
- API Gateway → Services: Proxied HTTP requests
- Service → Service: HTTP calls via client classes (e.g., `IdentityClient`)

### Asynchronous (Event-Driven)
Using Redis Pub/Sub for events:

| Event | Publisher | Subscribers |
|-------|-----------|-------------|
| `ORDER_PAID` | Payment Service | Course Service, Notification Service |
| `COURSE_PUBLISHED` | Course Service | Notification Service |
| `USER_REGISTERED` | Identity Service | Notification Service |
| `TEST_COMPLETED` | Assessment Service | Course Service |

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Development Setup

1. **Install dependencies**:
   ```bash
   cd apps
   pnpm install
   ```

2. **Build shared library**:
   ```bash
   pnpm build:common
   ```

3. **Set up databases** (using Docker):
   ```bash
   pnpm docker:up
   ```

4. **Generate Prisma clients**:
   ```bash
   pnpm prisma:generate
   ```

5. **Run migrations**:
   ```bash
   pnpm prisma:migrate
   ```

6. **Start all services**:
   ```bash
   pnpm dev
   ```

   Or start individual services:
   ```bash
   pnpm dev:gateway
   pnpm dev:identity
   pnpm dev:course
   # etc.
   ```

### Environment Variables

Each service requires its own `.env` file. Copy from `.env.example`:

```bash
# Identity Service
IDENTITY_SERVICE_PORT=3001
IDENTITY_DATABASE_URL=postgresql://user:pass@localhost:5432/identity_db
REDIS_URL=redis://localhost:6379
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-secret

# Course Service
COURSE_SERVICE_PORT=3002
COURSE_DATABASE_URL=postgresql://user:pass@localhost:5432/course_db
IDENTITY_SERVICE_URL=http://localhost:3001
# ... etc
```

## 📊 Database per Service

Each service has its own database schema:

| Service | Database |
|---------|----------|
| Identity | `identity_db` |
| Course | `course_db` |
| Assessment | `assessment_db` |
| Flashcard | `flashcard_db` |
| Payment | `payment_db` |
| Notification | `notification_db` |

## 🔐 Authentication Flow

1. Client sends login request to API Gateway
2. Gateway proxies to Identity Service
3. Identity Service validates credentials and returns JWT
4. Client includes JWT in Authorization header
5. Each service validates JWT using shared secret

## 📦 Shared Library (@capstone/common)

Contains:
- **Types**: Enums, interfaces shared across services
- **Middlewares**: Authentication, validation, error handling
- **Events**: Event names and payload types
- **Services**: EventBusService for pub/sub
- **Utils**: Pagination, retry logic, helpers

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📈 Migration Plan

Following the phased approach from MICROSERVICES_ANALYSIS.md:

1. **Phase 1**: Identity Service & Notification Service
2. **Phase 2**: Flashcard Service
3. **Phase 3**: Assessment & Payment Services
4. **Phase 4**: Full microservices with API Gateway

## 🔧 Best Practices Implemented

1. **Database per Service**: Each service owns its data
2. **Event-Driven Architecture**: Loose coupling via Redis Pub/Sub
3. **API Gateway Pattern**: Single entry point
4. **Shared Library**: Consistent types, utilities, middlewares
5. **Health Checks**: Each service exposes `/health` endpoint
6. **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT
7. **Centralized Authentication**: JWT validation in each service
8. **Monorepo with Workspaces**: pnpm workspaces for code sharing
