# Capstone Project - Microservices Developer Guide

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Running the Project](#-running-the-project)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints)
- [Event-Driven Communication](#-event-driven-communication)
- [Database Management](#-database-management)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | >= 20.0.0 | [nodejs.org](https://nodejs.org/) |
| **pnpm** | >= 8.0.0 | `npm install -g pnpm` |
| **Docker** | Latest | [docker.com](https://www.docker.com/) |
| **Docker Compose** | Latest | Included with Docker Desktop |

### Verify Installation

```bash
node --version    # Should be >= 20.0.0
pnpm --version    # Should be >= 8.0.0
docker --version  # Should show Docker version
```

---

## 📁 Project Structure

```
capstone-project/
├── apps/                           # Microservices
│   ├── api-gateway/               # API Gateway (Port 3000)
│   ├── identity-service/          # Auth & Users (Port 3001)
│   ├── course-service/            # Courses (Port 3002)
│   ├── assessment-service/        # Tests & Quizzes (Port 3003)
│   ├── flashcard-service/         # Flashcards (Port 3004)
│   ├── payment-service/           # Payments & Wallet (Port 3005)
│   ├── notification-service/      # Notifications (Port 3006)
│   └── docker-compose.yml         # Docker orchestration
│
├── libs/                          # Shared Libraries
│   └── common/                    # @capstone/common
│       └── src/
│           ├── types/             # Shared TypeScript types
│           ├── events/            # Event definitions (RabbitMQ)
│           ├── middlewares/       # Auth, validation, error handlers
│           ├── services/          # EventBusService (RabbitMQ)
│           └── utils/             # Utility functions
│
├── backend/                       # Legacy monolith (reference only)
├── frontend/                      # Frontend application
├── package.json                   # Root package.json (monorepo)
└── pnpm-workspace.yaml           # PNPM workspace configuration
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd capstone-project
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs dependencies for **all services** and the shared library in one command.

### 3. Build the Shared Library

```bash
pnpm build:common
```

### 4. Set Up Environment Variables

Copy the example environment files for each service:

```bash
# Identity Service
cp apps/identity-service/.env.example apps/identity-service/.env

# Course Service
cp apps/course-service/.env.example apps/course-service/.env

# Payment Service
cp apps/payment-service/.env.example apps/payment-service/.env

# Add other services as needed...
```

### 5. Start Infrastructure (Docker)

```bash
pnpm docker:up
```

This starts:
- **PostgreSQL** (Port 5432)
- **Redis** (Port 6379)
- **RabbitMQ** (Port 5672, Management UI: 15672)

### 6. Run Database Migrations

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### 7. Start All Services

```bash
pnpm dev
```

Or start individual services:

```bash
pnpm dev:identity    # Identity Service only
pnpm dev:course      # Course Service only
pnpm dev:gateway     # API Gateway only
```

---

## 🏗️ Architecture Overview

```
                                    ┌─────────────────┐
                                    │   Frontend      │
                                    │   (React/Next)  │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   API Gateway   │
                                    │   (Port 3000)   │
                                    └────────┬────────┘
                                             │
        ┌────────────────┬───────────────────┼───────────────────┬────────────────┐
        │                │                   │                   │                │
        ▼                ▼                   ▼                   ▼                ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Identity    │ │    Course     │ │   Payment     │ │  Assessment   │ │   Flashcard   │
│   Service     │ │   Service     │ │   Service     │ │   Service     │ │   Service     │
│  (Port 3001)  │ │  (Port 3002)  │ │  (Port 3005)  │ │  (Port 3003)  │ │  (Port 3004)  │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │                 │                 │
        └─────────────────┴─────────────────┴─────────────────┴─────────────────┘
                                             │
                        ┌────────────────────┼────────────────────┐
                        │                    │                    │
                        ▼                    ▼                    ▼
                ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
                │  PostgreSQL   │    │    Redis      │    │   RabbitMQ    │
                │  (Databases)  │    │   (Cache)     │    │   (Events)    │
                └───────────────┘    └───────────────┘    └───────────────┘
```

### Key Concepts

- **API Gateway**: Single entry point for all client requests. Routes to appropriate microservices.
- **Microservices**: Independent services, each with its own database.
- **RabbitMQ**: Asynchronous event-driven communication between services.
- **Redis**: Caching and session management.
- **Shared Library** (`@capstone/common`): Common types, middlewares, and utilities.

---

## ⚙️ Environment Variables

### Identity Service (`apps/identity-service/.env`)

```env
# Server
IDENTITY_SERVICE_PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=localhost:5432

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# JWT Secrets (generate secure secrets for production!)
ACCESS_TOKEN_SECRET=your-access-token-secret-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### Course Service (`apps/course-service/.env`)

```env
COURSE_SERVICE_PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/course_db?schema=public
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
ACCESS_TOKEN_SECRET=your-access-token-secret-here
IDENTITY_SERVICE_URL=http://localhost:3001
```

### Payment Service (`apps/payment-service/.env`)

```env
PAYMENT_SERVICE_PORT=3005
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payment_db?schema=public
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
ACCESS_TOKEN_SECRET=your-access-token-secret-here
```

---

## 📜 Available Scripts

Run these from the **root directory** (`capstone-project/`):

| Script | Description |
|--------|-------------|
| `pnpm install` | Install all dependencies for all services |
| `pnpm dev` | Start all services in development mode |
| `pnpm dev:identity` | Start only Identity Service |
| `pnpm dev:course` | Start only Course Service |
| `pnpm dev:payment` | Start only Payment Service |
| `pnpm dev:gateway` | Start only API Gateway |
| `pnpm build` | Build all services |
| `pnpm build:common` | Build the shared library |
| `pnpm prisma:generate` | Generate Prisma clients |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm docker:up` | Start Docker infrastructure |
| `pnpm docker:down` | Stop Docker infrastructure |
| `pnpm docker:logs` | View Docker logs |

---

## 🔌 API Endpoints

### API Gateway Base URL

```
http://localhost:3000
```

### Authentication (Identity Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/verify-email/:token` | Verify email address |

### Users (Identity Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update current user profile |
| GET | `/api/users/:id` | Get user by ID (admin) |
| GET | `/api/users` | List all users (admin) |

### Courses (Course Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all published courses |
| GET | `/api/courses/:id` | Get course details |
| POST | `/api/courses` | Create a new course (seller) |
| PUT | `/api/courses/:id` | Update a course (seller) |
| DELETE | `/api/courses/:id` | Delete a course (seller) |
| POST | `/api/courses/:id/publish` | Publish a course (seller) |

### Payments (Payment Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet` | Get wallet balance |
| POST | `/api/wallet/deposit` | Deposit to wallet |
| GET | `/api/wallet/transactions` | Get transaction history |
| POST | `/api/orders` | Create an order |
| POST | `/api/orders/:id/pay` | Pay for an order |

---

## 📨 Event-Driven Communication

Services communicate asynchronously via **RabbitMQ**. Here are the key events:

### Event Flow Example: Course Purchase

```
1. User pays for course
   └─> Payment Service publishes: ORDER_PAID

2. Course Service subscribes to ORDER_PAID
   └─> Grants course access to user
   └─> Publishes: COURSE_ACCESS_GRANTED

3. Notification Service subscribes to COURSE_ACCESS_GRANTED
   └─> Sends confirmation email to user
```

### Available Events

| Event | Publisher | Subscribers |
|-------|-----------|-------------|
| `USER_REGISTERED` | Identity | Notification |
| `USER_VERIFIED` | Identity | Notification |
| `COURSE_PUBLISHED` | Course | Notification |
| `ORDER_PAID` | Payment | Course, Notification |
| `COURSE_ACCESS_GRANTED` | Course | Notification |
| `AI_GRADING_COMPLETED` | Assessment | Notification |

### RabbitMQ Management UI

Access the RabbitMQ dashboard at:
```
http://localhost:15672
Username: guest
Password: guest
```

---

## 🗄️ Database Management

Each service has its own database schema managed by **Prisma**.

### Generate Prisma Client

```bash
pnpm prisma:generate
```

### Run Migrations

```bash
pnpm prisma:migrate
```

### Open Prisma Studio (Database GUI)

```bash
cd apps/identity-service
pnpm prisma:studio
```

### Reset Database

```bash
cd apps/identity-service
npx prisma migrate reset
```

---

## 🔧 Troubleshooting

### ❌ "pnpm: command not found"

Install pnpm globally:
```bash
npm install -g pnpm
```

### ❌ "Cannot find module '@capstone/common'"

Build the shared library first:
```bash
pnpm build:common
```

### ❌ "Connection refused" to PostgreSQL/Redis/RabbitMQ

Make sure Docker containers are running:
```bash
pnpm docker:up
docker ps  # Should show postgres, redis, rabbitmq containers
```

### ❌ Database connection errors

1. Check your `.env` file has the correct `DATABASE_URL`
2. Ensure PostgreSQL container is running: `docker ps`
3. Run migrations: `pnpm prisma:migrate`

### ❌ RabbitMQ connection errors

1. Verify RabbitMQ is running: `docker ps | grep rabbitmq`
2. Check `RABBITMQ_URL` in your `.env` file
3. Access Management UI to verify: `http://localhost:15672`

### ❌ Port already in use

Stop conflicting services or change the port in the `.env` file:
```bash
# Find process using port
netstat -ano | findstr :3001  # Windows
lsof -i :3001                  # macOS/Linux

# Kill the process
taskkill /PID <pid> /F         # Windows
kill -9 <pid>                  # macOS/Linux
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `pnpm test`
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Open a Pull Request

---

**Happy Coding! 🚀**
