# Demo Seed Dataset

A cohesive, cross-service demo dataset for the English-learning platform. It
populates all 7 service databases with **consistent, related** data so you can
demo dashboards, filtering, search, detail pages, reporting, audit logs, and
multi-step workflows end-to-end.

## How it stays consistent across 7 databases

Each service has its own Postgres schema (`identity_db`, `course_db`, …) on the
shared Supabase instance, and there are **no DB-level foreign keys across
schemas**. Rows are joined by UUID at the application layer.

To make that work, every UUID is **deterministic** — derived with UUIDv5 from a
fixed namespace + a stable key (see [`ids.ts`](./ids.ts)). So `userId('an')`
returns the *exact same* UUID in the identity DB, the payment DB, the course DB,
etc. The single source of truth for cross-service entities (users, courses,
tests, enrollments, coupons, plans, …) lives in [`catalog.ts`](./catalog.ts);
each service's `prisma/seed-demo.ts` imports it.

## Safety properties

- **Idempotent** — every row is written with `upsert` keyed on its deterministic
  ID. Re-running updates in place; it never creates duplicates.
- **Non-destructive** — nothing is ever deleted or truncated. Seeding coexists
  with any existing data.
- **Self-identifying** — all demo accounts use `@demo.capstone.local` emails, so
  the demo data is easy to find and clean up later.

## Running it

> ⚠️ These scripts write to the **live shared Supabase** instance configured in
> each service's `.env`. Make sure that's the database you intend to seed.
> No infrastructure (`pnpm docker:up`) is required since the DB is remote.

Prerequisite — Prisma clients must be generated (already present in the repo):

```bash
pnpm prisma:generate   # only if generated/ is missing
```

From the monorepo root (`capstone-project/`):

```bash
# Seed everything, in dependency order
pnpm seed:demo

# …or one service at a time
pnpm seed:demo:identity
pnpm seed:demo:course
pnpm seed:demo:assessment
pnpm seed:demo:flashcard
pnpm seed:demo:payment
pnpm seed:demo:notification
pnpm seed:demo:ai-evaluation
```

Each script loads its own service `.env` (via `dotenv/config`) and runs with the
service's local `tsx`.

## Demo accounts

All accounts share the password **`Demo@1234`**.

| Role | Email | Notes |
|------|-------|-------|
| Admin | `admin@demo.capstone.local` | Full admin; author of the audit-log entries |
| Seller | `linh.teacher@demo.capstone.local` | Grammar / Pronunciation / Speaking courses |
| Seller | `minh.ielts@demo.capstone.local` | IELTS courses + tests (per-seller 25% commission) |
| Seller | `trang.business@demo.capstone.local` | TOEIC / Business courses |
| Seller applicant | `hung.applicant@demo.capstone.local` | Application **PENDING** (review queue) |
| Seller applicant | `mai.applicant@demo.capstone.local` | Application **REJECTED** |
| Learner | `an.nguyen@demo.capstone.local` | Active, enrolled, PRO subscriber |
| Learner | `dung.pham@demo.capstone.local` | Power user, C1, top of leaderboard |
| Learner | `lan.bui@demo.capstone.local` | Highest XP / streak |
| Learner | `phuc.ngo@demo.capstone.local` | **Email not verified** |
| Learner | `quan.spam@demo.capstone.local` | **SUSPENDED** (moderation) |
| Learner | `tu.banned@demo.capstone.local` | **BANNED** (moderation) |
| …plus | `binh`, `chi`, `giang`, `ha`, `khanh`, `nam` | 12 learners total |

## What gets demoed where

| Surface | Where to see it |
|---------|-----------------|
| **Dashboard / leaderboard** | learner XP, streaks, band-score progress; seller revenue |
| **Filter / search** | courses by status/level/category/price; users by status/role |
| **Detail pages** | course → modules → lessons → comments/ratings; test → sections → questions |
| **Reporting** | seller earnings, commission split, order history, practice-session scores |
| **Audit log** | `admin_audit_logs` (identity), `course_review_history` (course), `advisor_action_log` (ai-eval) |
| **Workflows** | seller application (PENDING/APPROVED/REJECTED), course review (DRAFT→PENDING→ACTIVE/REFUSE), withdrawals, refunds, comment moderation |

## Approximate volume

~18 users · 12 courses (all statuses) · ~28 lessons · ~25 enrollments/orders ·
5 coupons · ~20 seller-earnings · 5 withdrawals · 4 refunds · 6 tests w/ ~20
questions · ~12 practice sessions · 8 flashcard decks (~56 cards) · ~33 in-app
notifications · 8 writing + 6 speaking AI evaluations · audit/workflow trails
throughout.

## Files

```
seed-shared/
  ids.ts        # deterministic UUIDv5 registry (dependency-free)
  catalog.ts    # canonical cross-service entities (single source of truth)
  index.ts      # barrel
  README.md     # this file
apps/<service>/prisma/seed-demo.ts   # 7 per-service seed scripts
```
