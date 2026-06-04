# 🚀 Developer Guide — Capstone Backend

Complete guide to running the entire backend microservices architecture on your local environment.

---

## 📋 Table of Contents

- [System Requirements](#-system-requirements)
- [Architecture Overview](#-architecture-overview)
- [Service Ports](#-service-ports)
- [Step 1: Clone & Install Dependencies](#step-1-clone--install-dependencies)
- [Step 2: Start Infrastructure (Docker)](#step-2-start-infrastructure-docker)
- [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
- [Step 4: Initialize Database (Prisma)](#step-4-initialize-database-prisma)
- [Step 5: Run Node.js Microservices](#step-5-run-nodejs-microservices)
- [Step 6: Run Python RAG Service](#step-6-run-python-rag-service)
- [Verify System Status](#-verify-system-status)
- [Running Services Individually](#-running-services-individually)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 System Requirements

| Software           | Minimum Version       | Check Command              |
| ------------------ | -------------------- | -------------------------- |
| **Node.js**        | >= 20.0.0            | `node --version`           |
| **pnpm**           | >= 8.0.0             | `pnpm --version`           |
| **Python**         | >= 3.10              | `python --version`         |
| **Docker Desktop** | Latest               | `docker --version`         |
| **Git**            | Latest               | `git --version`            |

> **Note for Windows:** You must start **Docker Desktop** before running any Docker commands.

### Install pnpm (if not installed)

```bash
npm install -g pnpm
```

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (:3000)                      │
│        Receives requests → Routes to target service          │
└──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────────┘
       │      │      │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼      ▼      ▼
   Identity Course Assess Flash  Pay   Noti   AI-Eval  RAG
   :3001   :3002  :3003  :3004  :3005  :3006  :3007   :8000
   (Node)  (Node) (Node) (Node) (Node) (Node) (Node)  (Python)
       │      │      │      │      │      │      │
       └──────┴──────┴──────┴──────┴──────┴──────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
          PostgreSQL    Redis     RabbitMQ
           :5432       :6379    :5672/:15672
           (Docker)   (Docker)   (Docker)
```

---

## 🔌 Service Ports

| Service                 | Type   | Port   | Description                        |
| ----------------------- | ------ | ------ | ----------------------------------- |
| **API Gateway**         | Node   | `3000` | Single entry point for frontend     |
| **Identity Service**    | Node   | `3001` | Auth, User, Seller management       |
| **Course Service**      | Node   | `3002` | Courses, Lessons, Ratings           |
| **Assessment Service**  | Node   | `3003` | Tests, Speaking, IELTS Practice     |
| **Flashcard Service**   | Node   | `3004` | Flashcard Decks, Cards, SRS Review  |
| **Payment Service**     | Node   | `3005` | Stripe, Wallet, Subscriptions       |
| **Notification Service**| Node   | `3006` | Notifications, Events               |
| **AI Evaluation**       | Node   | `3007` | AI scoring (Speaking, Writing)      |
| **RAG Service**         | Python | `8000` | RAG Pipeline, AI Flashcard Gen      |
| **PostgreSQL**          | Docker | `5432` | Database                            |
| **Redis**               | Docker | `6379` | Cache & Session                     |
| **RabbitMQ**            | Docker | `5672` | Message Broker                      |
| **RabbitMQ UI**         | Docker | `15672`| RabbitMQ Management Dashboard       |

---

## Step 1: Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd capstone-project-backend

# Install all Node.js dependencies (monorepo)
pnpm install
```

> The `pnpm install` command will install dependencies for **all** microservices utilizing the workspace configuration.

---

## Step 2: Start Infrastructure (Docker)

Open **Docker Desktop**, then run:

```bash
pnpm run docker:up
```

This command initializes 3 containers:
- **PostgreSQL** (port `5432`) — Automatically creates 7 isolated databases for each service
- **Redis** (port `6379`)
- **RabbitMQ** (port `5672`, Management UI: `15672`)

### Verify running containers:

```bash
docker ps
```

You should see 3 containers: `capstone-postgres`, `capstone-redis`, `capstone-rabbitmq`.

### Access RabbitMQ UI:

Open your browser → `http://localhost:15672`
- Username: `guest`
- Password: `guest`

---

## Step 3: Configure Environment Variables

Each service requires its own `.env` file. Create them by **copying** the `.env.example` file:

```bash
# Setup all files at once (PowerShell)
Get-ChildItem -Path apps -Filter .env.example -Recurse | ForEach-Object {
    $dest = Join-Path $_.DirectoryName ".env"
    if (-not (Test-Path $dest)) { Copy-Item $_.FullName $dest }
}
```

**Or copy manually for each service:**

```bash
cp apps/api-gateway/.env.example       apps/api-gateway/.env
cp apps/identity-service/.env.example  apps/identity-service/.env
cp apps/course-service/.env.example    apps/course-service/.env
cp apps/assessment-service/.env.example apps/assessment-service/.env
cp apps/flashcard-service/.env.example apps/flashcard-service/.env
cp apps/payment-service/.env.example   apps/payment-service/.env
cp apps/notification-service/.env.example apps/notification-service/.env
cp apps/rag-service/.env.example       apps/rag-service/.env
```

### ⚠️ Important Variables to Update:

| Service            | Variable               | Value to replace    |
| ------------------ | ---------------------- | ------------------ |
| **Payment**        | `STRIPE_SECRET_KEY`    | Get from Stripe Dashboard |
| **Payment**        | `STRIPE_WEBHOOK_SECRET`| Get from Stripe CLI  |
| **RAG Service**    | `OLLAMA_BASE_URL`      | ngrok/remote Ollama URL |

> Other variables (database, redis, rabbitmq) are pre-configured for the local environment.

---

## Step 4: Initialize Database (Prisma)

### 4.1 Generate Prisma Client

```bash
pnpm run prisma:generate
```

### 4.2 Run Database Migrations

```bash
pnpm run prisma:migrate
```

> This command creates all tables cross the 7 databases. You only need to run this **once** during the initial setup or when new migrations are available.

### Run Migrations Individually (if needed):

```bash
pnpm run prisma:migrate:identity
pnpm run prisma:migrate:course
pnpm run prisma:migrate:assessment
pnpm run prisma:migrate:flashcard
pnpm run prisma:migrate:payment
pnpm run prisma:migrate:notification
pnpm run prisma:migrate:ai-evaluation
```

---

## Step 5: Run Node.js Microservices

### 🚀 Run ALL services together (Recommended):

```bash
pnpm run dev
```

This command starts **8 Node.js services concurrently** (Gateway + 7 microservices) in a single terminal.

### Expected Terminal Output:

```
api-gateway       → Listening on port 3000
identity-service  → Listening on port 3001
course-service    → Listening on port 3002
assessment-service → Listening on port 3003
flashcard-service → Listening on port 3004
payment-service   → Listening on port 3005
notification-service → Listening on port 3006
ai-evaluation-service → Listening on port 3007
```

---

## Step 6: Run Python RAG Service

The RAG Service runs **independently** from the Node.js services as it uses Python + FastAPI.

### 6.1 Open a new Terminal and navigate to the RAG directory:

```bash
cd apps/rag-service
```

### 6.2 Create a Python Virtual Environment (first time only):

```bash
python -m venv venv
```

### 6.3 Activate the Virtual Environment:

**Windows (PowerShell):**
```powershell
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

> Upon successful activation, you will see `(venv)` at the beginning of your command line.

> ⚠️ **If you encounter an ExecutionPolicy error on Windows:**
> ```powershell
> Set-ExecutionPolicy Unrestricted -Scope CurrentUser
> ```
> Then run the activate command again.

### 6.4 Install Python Dependencies (first time only):

```bash
pip install -r requirements.txt
```

> If you encounter timeouts due to slow network connections:
> ```bash
> pip install -r requirements.txt --default-timeout=1000
> ```

### 6.5 Start the RAG Server:

```bash
uvicorn app.main:app --reload --port 8000
```

### Expected Terminal Output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [...] using WatchFiles
```

> **Note:** Always run using `uvicorn` — **DO NOT** use `python app/main.py` as it will cause import errors.

---

## ✅ Verify System Status

### Check API Gateway:

```bash
curl http://localhost:3000/health
```

### Check RAG Service:

```bash
curl http://localhost:8000/health
```

### Check RabbitMQ:

Open your browser → `http://localhost:15672` (guest/guest)

---

## 📦 Running Services Individually

If you prefer not to start everything at once, you can run services individually:

```bash
pnpm run dev:gateway         # API Gateway       → :3000
pnpm run dev:identity        # Identity Service   → :3001
pnpm run dev:course          # Course Service     → :3002
pnpm run dev:assessment      # Assessment Service → :3003
pnpm run dev:flashcard       # Flashcard Service  → :3004
pnpm run dev:payment         # Payment Service    → :3005
pnpm run dev:notification    # Notification       → :3006
pnpm run dev:ai-evaluation   # AI Evaluation      → :3007
pnpm run dev:rag             # RAG Service (Python) → :8000
```

> **Note:** `dev:rag` will function correctly only when the venv is activated in that specific terminal, or when run from the project root.

---

## 🚨 Troubleshooting

### 1. `docker: Cannot connect to the Docker daemon`

**Cause:** Docker Desktop is not running.

**Fix:** Open Docker Desktop → wait for the icon to turn green → run `pnpm run docker:up` again.

---

### 2. `ECONNREFUSED 127.0.0.1:5432`

**Cause:** The PostgreSQL container is not fully ready.

**Fix:**
```bash
docker ps   # Check if capstone-postgres container is running
docker logs capstone-postgres   # View logs
```

---

### 3. `ModuleNotFoundError: No module named 'app'` (RAG Service)

**Cause:** Executing the incorrect command `python app/main.py` instead of utilizing `uvicorn`.

**Fix:** Always use:
```bash
uvicorn app.main:app --reload --port 8000
```

---

### 4. `ValidationError: Extra inputs are not permitted` (RAG Service)

**Cause:** The `.env` file contains unused variables (e.g., `CHROMA_PERSIST_DIR`).

**Fix:** Remove the obsolete variable from your `.env`, or copy a fresh one from `.env.example`.

---

### 5. `pip install` timeout

**Cause:** Slow network or bulky dependencies (like pymupdf ~19MB).

**Fix:**
```bash
pip install -r requirements.txt --default-timeout=1000
```
If it fails again, re-run the command — pip will resume from its cache.

---

### 6. `ExecutionPolicy` error during venv activation (Windows)

**Fix:**
```powershell
Set-ExecutionPolicy Unrestricted -Scope CurrentUser
.\venv\Scripts\activate
```

---

### 7. Port already in use (EADDRINUSE)

**Fix:**
```bash
# Find the process occupying the port (e.g., 3000)
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

---

## 📁 Directory Structure

```
capstone-project-backend/
├── apps/
│   ├── api-gateway/          # API Gateway (Node.js, Express)
│   ├── identity-service/     # Auth, Users, Sellers (Node.js, Prisma)
│   ├── course-service/       # Courses, Lessons (Node.js, Prisma)
│   ├── assessment-service/   # Tests, Speaking (Node.js, Prisma)
│   ├── flashcard-service/    # Flashcards, SRS (Node.js, Prisma)
│   ├── payment-service/      # Stripe, Wallet (Node.js, Prisma)
│   ├── notification-service/ # Notifications (Node.js, Prisma)
│   ├── ai-evaluation-service/# AI Scoring (Node.js, Prisma)
│   └── rag-service/          # RAG Pipeline (Python, FastAPI)
├── libs/
│   └── common/               # Shared utilities (middleware, errors, etc.)
├── docker-compose.yml        # Infrastructure containers
├── init-databases.sql        # Creates 7 databases during PostgreSQL initialization
├── package.json              # Root scripts (dev, build, prisma, docker)
└── pnpm-workspace.yaml       # Monorepo workspace config
```

---

## 🔄 Quick Start Summary

```bash
# Terminal 1 — Infrastructure
pnpm run docker:up

# Terminal 2 — Node.js Services (all together)
pnpm install              # First time only
pnpm run prisma:generate  # First time only
pnpm run prisma:migrate   # First time only
pnpm run dev

# Terminal 3 — Python RAG Service
cd apps/rag-service
python -m venv venv       # First time only
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt  # First time only
uvicorn app.main:app --reload --port 8000
```

**System is ready when:**
- ✅ Gateway is running at `http://localhost:3000`
- ✅ RAG Service is running at `http://localhost:8000`
- ✅ Docker containers (Postgres, Redis, RabbitMQ) are `healthy`
