# Capstone Project: Microservices Learning Platform Summary

This document provides a technical summary of the progress made on the project, focusing on the core business logic, architectural patterns, and implemented use cases across the microservices ecosystem.

---

## 🏗️ Architectural Overview

The project uses a **Microservices Architecture** with a clear separation of concerns, built using **Node.js, Express, TypeScript, and Prisma ORM**.

### Core Infrastructure
- **Monorepo Structure**: Managed with `pnpm` workspaces.
- **Shared Library (`@capstone/common`)**: Centralizes error handling (`custom-errors`), validation middleware (`zod`), and standard security filters.
- **Database Architecture**: Per-service PostgreSQL databases (Supabase) with isolated migrations.
- **Communication**: Mix of RESTful APIs for synchronous requests and RabbitMQ/Redis for asynchronous events.

---

## 🔐 Identity Service (The Security Core)

Responsible for the entire user lifecycle and security posture.

### 💼 Business Logic
- **Advanced Auth**: JWT-based authentication with Access and Refresh tokens.
- **RBAC (Role-Based Access Control)**: Granular permission system for `LEARNER`, `INSTRUCTOR`, `ADMIN`, and `SELLER`.
- **Security Lifecycle**: Automated OTP generation for email verification and password reset flows.

### 🎯 Key Use Cases
- **User Onboarding**: Multi-step registration with role assignment and email verification.
- **Authentication**: Secure login, token rotation, and profile management.
- **Administrative Control**: User management and role modification by system admins.

---

## 📇 Flashcard Service (The Learning Engine)

The cognitive core of the platform, enabling adaptive learning.

### 💼 Business Logic
- **Adaptive Study (SM-2 Algorithm)**: Implements the SuperMemo-2 algorithm to calculate optimal review intervals based on recall quality.
- **Access Control**: Dynamic visibility logic (Public vs. Private decks) ensuring content privacy and intellectual property protection for instructors.

### 🎯 Key Use Cases
- **Deck Management**: Full CRUD for flashcard decks including hierarchical tagging.
- **Individual Study**: Creation of personalized flashcards within decks with support for rich content (example sentences, audio URLs).
- **Spaced Repetition Study**: A dedicated "Review" mode that surfaces cards exactly when they are most likely to be forgotten.

---

## 🔔 Notification Service (The Engagement Core)

Manages communication and keeps users informed of platform activity.

### 💼 Business Logic
- **Multi-channel Prep**: Architecture supports In-App, Email, and Push notifications.
- **Bulk Delivery**: Logic to broadcast announcements to specific user segments (instructors, learners, etc.).
- **State Management**: Individual tracking of notification status (Read, Archive, Deleted).

### 🎯 Key Use Cases
- **Activity Streams**: Real-time notifications for platform events (course enrollment, flashcard reminders).
- **System Announcements**: Admin-triggered bulk notifications.
- **Preference Management**: User control over how and when they receive notifications.

---

## 🚀 Technical Highlights & Best Practices

1.  **Dependency Injection**: Services and repositories are decoupled Using DI patterns for better testability.
2.  **Schema-First Validation**: Every endpoint is strictly validated using `Zod` DTOs.
3.  **Standardized Responses**: Consistent JSON response structure across all services.
4.  **Resilience**: Graceful shutdown handling for database connections and servers.
5.  **Type Safety**: End-to-end TypeScript integration from Prisma models to API responses.

---

## 📂 Project Structure Snapshot
- `apps/api-gateway`: Aggregation layer (Incoming).
- `apps/identity-service`: Auth & User Management.
- `apps/flashcard-service`: Adaptive Learning Engine.
- `apps/notification-service`: Multi-channel communication.
- `libs/common`: Shared utilities and middleware.
