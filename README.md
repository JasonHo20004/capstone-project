# English Learning Platform - Backend API

A comprehensive Backend API for an online English learning platform, supporting learners to improve their language skills through interactive lessons, practice exercises, and progress tracking.

## 📋 Key Features

### User Management
- Authentication and authorization (JWT with Access & Refresh Token)
- User profile management (students, instructors, administrators)
- Email verification
- Integrated wallet system

### Course Management
- Create and manage courses
- Lesson management and content delivery
- Rating and review system
- Analytics and learning progress tracking

### Flashcard & Vocabulary
- Create and manage flashcard decks
- Spaced Repetition System (SRS)
- Tag management and categorization
- Vocabulary learning progress tracking

### Practice & Testing
- Practice session system
- Standardized English test types
- Automatic grading
- Answer and result storage

### E-Commerce
- Shopping cart and order management
- MoMo payment gateway integration
- Wallet top-up
- Transaction management

### Contract Management
- Subscription plans for course sellers
- Subscription contract management
- Payment tracking

### Notifications
- In-app notifications
- Email notifications
- Event-driven notification system

### Reports & Analytics
- Content violation reporting
- Admin analytics dashboard
- User activity tracking

## 🛠 Tech Stack

### Backend Framework & Runtime
- **Node.js 20 LTS** - JavaScript runtime
- **Express 5** - Web framework
- **TypeScript** - Type-safe development

### Database & ORM
- **PostgreSQL** - Relational database
- **Prisma** - Next-generation ORM
- **Redis** - Caching and session management

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling

### File Storage
- **AWS S3** - Cloud file storage
- **Multer** - File upload middleware
- **multer-s3** - S3 integration

### Validation & Schema
- **Zod** - Schema validation

### Development Tools
- **tsx** - TypeScript execution
- **nodemon** - Auto-restart development server
- **esbuild** - Fast bundler
- **tsc-alias** - TypeScript path alias resolver

### External Services
- **Nodemailer** - Email sending
- **Axios** - HTTP client
- **MoMo Payment Gateway** - Payment integration

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── middlewares/              # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   ├── optionalAuth.middleware.ts
│   │   ├── enrollment.middleware.ts
│   │   ├── upload.ts
│   │   └── validations.middleware.ts
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication
│   │   ├── users/                # User management
│   │   ├── admin/                # Admin dashboard
│   │   ├── courses/              # Course management
│   │   ├── flashcards/           # Flashcard system
│   │   ├── tests/                # Testing system
│   │   ├── practice_sessions/    # Practice sessions
│   │   ├── cart/                 # Shopping cart
│   │   ├── topupOrders/          # Wallet topup
│   │   ├── notifications/        # Notification system
│   │   ├── reports/              # Report management
│   │   ├── seller/               # Course seller features
│   │   ├── student-learning/     # Student features
│   │   ├── contract-management/  # Contract management
│   │   ├── course-management-by-admin/
│   │   └── application-management-by-admin/
│   ├── services/                 # Core services
│   ├── repositories/             # Data access layer
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── seed/                     # Database seeders
├── prisma/
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
├── dist/                         # Compiled output
├── Dockerfile                    # Docker configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

### Module Structure (MVC Pattern)
Each module follows a layered architecture:
```
module/
├── controllers/      # Request handlers
├── services/         # Business logic
├── repositories/     # Database operations
├── dtos/            # Data Transfer Objects
└── routes/          # Route definitions
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** >= 20.x
- **PostgreSQL** >= 14.x
- **Redis** >= 6.x
- **npm** or **yarn**

### 1. Clone repository
```bash
git clone <repository-url>
cd capstone-project/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables configuration
Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/capstone_dev"

# Server
PORT=3000
NODE_ENV=development

# JWT Secrets
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"

# AWS S3 Configuration
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Text-to-Speech Service (Optional)
TTS_API_ENDPOINT="https://your-tts-service.com/generate-tts"
TTS_FILE_BASE_URL="https://your-tts-service.com"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# MoMo Payment (Optional)
MOMO_PARTNER_CODE="your-partner-code"
MOMO_ACCESS_KEY="your-access-key"
MOMO_SECRET_KEY="your-secret-key"
```

### 4. Database Setup

#### Initialize Prisma Client
```bash
npm run prisma:generate
```

#### Run migrations
```bash
npm run prisma:migrate
```

#### (Optional) Seed sample data
```bash
npm run prisma:seed
```

#### Open Prisma Studio for database management
```bash
npm run prisma:studio
```

### 5. Run the application

#### Development mode (with hot-reload)
```bash
npm run dev
```

#### Production mode
```bash
# Build project
npm run build

# Start server
npm start
```

Server will run at: `http://localhost:3000`

## 🐳 Docker Deployment

### Build Docker image
```bash
docker build -t english-learning-backend .
```

### Run container
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e ACCESS_TOKEN_SECRET="..." \
  -e REFRESH_TOKEN_SECRET="..." \
  english-learning-backend
```

### Using Docker Compose (if available)
```bash
docker-compose up -d
```

## 🔑 API Endpoints

### Health Check
```
GET /                           # Server health check
```

### Authentication
```
POST   /api/auth/register       # Register account
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
POST   /api/auth/refresh        # Refresh access token
POST   /api/auth/verify-email   # Verify email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Users
```
GET    /api/users               # Get users list
GET    /api/users/:id           # Get user info
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

### Courses
```
GET    /api/courses             # List courses
GET    /api/courses/:id         # Course details
POST   /api/courses             # Create course (Seller)
PUT    /api/courses/:id         # Update course
DELETE /api/courses/:id         # Delete course
GET    /api/courses/:id/lessons # List lessons
POST   /api/courses/:id/enroll  # Enroll in course
```

### Ratings
```
GET    /api/ratings             # List ratings
POST   /api/ratings             # Create rating
PUT    /api/ratings/:id         # Update rating
DELETE /api/ratings/:id         # Delete rating
```

### Flashcards
```
GET    /api/flashcard-decks     # List flashcard decks
POST   /api/flashcard-decks     # Create flashcard deck
GET    /api/flashcards          # List flashcards
POST   /api/flashcards          # Create flashcard
POST   /api/flashcard-review    # Review flashcard
GET    /api/tags                # List tags
```

### Tests & Practice
```
GET    /api/tests               # List tests
GET    /api/tests/:id           # Test details
POST   /api/practice-sessions   # Create practice session
POST   /api/practice-sessions/:id/submit  # Submit answers
```

### Cart & Orders
```
GET    /api/carts               # View cart
POST   /api/carts/items         # Add to cart
DELETE /api/carts/items/:id     # Remove from cart
POST   /api/carts/checkout      # Checkout
```

### Topup
```
GET    /api/topup-orders        # Topup history
POST   /api/topup-orders        # Create topup order
```

### Notifications
```
GET    /api/notifications       # List notifications
PUT    /api/notifications/:id/read  # Mark as read
DELETE /api/notifications/:id   # Delete notification
```

### Reports
```
GET    /api/reports             # List reports
POST   /api/reports             # Create report
PUT    /api/reports/:id         # Handle report (Admin)
```

### Admin
```
GET    /api/admin/dashboard     # Dashboard analytics
GET    /api/admin/users         # Manage users
PUT    /api/admin/users/:id     # Update user
GET    /api/admin/courses       # Manage courses
PUT    /api/admin/courses/:id/approve  # Approve course
```

### Seller
```
GET    /api/seller/courses      # Seller's courses
GET    /api/seller/analytics    # Seller analytics
POST   /api/seller/application  # Apply to become seller
```

### Student
```
GET    /api/student/enrolled-courses  # Enrolled courses
GET    /api/student/progress          # Learning progress
GET    /api/student/achievements      # Achievements
```

> **Note:** Some endpoints require JWT token in header:
> ```
> Authorization: Bearer <access_token>
> ```

## 📊 Database Schema

The system uses PostgreSQL with Prisma ORM. Main models:

- **User** - Users (students, instructors, admin)
- **Course** - Courses
- **Lesson** - Lessons
- **FlashcardDeck** - Flashcard decks
- **Flashcard** - Vocabulary cards
- **Test** - Tests
- **PracticeSession** - Practice sessions
- **Order** - Orders
- **Cart** - Shopping cart
- **Wallet** - Digital wallet
- **Notification** - Notifications
- **Rating** - Ratings
- **Report** - Reports

See detailed schema at [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

## 🔧 NPM Scripts

```bash
# Development
npm run dev              # Run dev server with hot-reload

# Build
npm run build            # Build TypeScript
npm run build:esbuild    # Build with esbuild (faster)

# Production
npm start                # Run production server

# Prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:deploy    # Deploy migrations (production)
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed notification types

# Testing data
npm run seed:test        # Seed test data
```

## 🏗 Architecture

### Path Aliases
The project uses TypeScript path aliases for cleaner imports:

```typescript
import { userService } from '@modules/users/services/user.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { prisma } from '@services/database.service'
import { hashPassword } from '@utils/password.util'
```

### Error Handling
Centralized error handling with custom error classes and error middleware.

### Validation
Request validation using Zod schemas in DTOs.

### Authentication Flow
1. User logs in → Receives Access Token (15m) & Refresh Token (7d)
2. Access Token stored in memory, Refresh Token in HTTP-only cookie
3. When Access Token expires → Use Refresh Token to get new token
4. Middleware `authMiddleware` verifies token before accessing protected routes

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint and Prettier rules
- Adhere to naming conventions:
  - Files: `kebab-case.ts`
  - Classes: `PascalCase`
  - Functions/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`

### Git Workflow
- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- Commit message format: `feat:`, `fix:`, `docs:`, `refactor:`

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database (development only)
npx prisma migrate reset

# Deploy migrations (production)
npx prisma migrate deploy
```

## 🔐 Security

- Passwords hashed using bcrypt (salt rounds: 10)
- JWT tokens with expiration time
- HTTP-only cookies for refresh tokens
- CORS configuration
- Input validation with Zod
- SQL injection protection via Prisma
- Rate limiting (recommended to add)
- Helmet middleware (recommended to add)

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributors

- Development Team - FPT University Capstone Project

## 📞 Support

If you encounter any issues, please create an issue on the GitHub repository.

---

**Made with ❤️ for English learners**
