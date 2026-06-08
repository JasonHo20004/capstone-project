// =============================================================================
// Identity Service — Demo Seed
// -----------------------------------------------------------------------------
// Seeds: User, AdministratorProfile, CourseSellerProfile,
//        CourseSellerApplication, Policy, AdminAuditLog.
//
// Fully idempotent: every row uses a deterministic UUID (userId(key) for users,
// id('<kind>', key) for everything else) and is written via upsert, so this
// script can be run repeatedly against the live Supabase DB without creating
// duplicates or deleting anything.
//
// All demo content is Vietnamese-context (an English-learning platform aimed at
// Vietnamese learners). The shared password is hashed exactly once and reused.
// =============================================================================

import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";
import {
  ALL_USERS,
  SELLERS,
  APPLICATIONS,
  ADMIN,
  DEMO_PASSWORD,
  daysAgo,
  daysFromNow,
  id,
  userId,
  courseId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.IDENTITY_DIRECT_URL ?? process.env.IDENTITY_DATABASE_URL } },
});

// Hash the shared demo password ONCE and reuse for every user.
const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);

// Sellers/admin look like long-standing accounts; everyone else ~3 months old.
const PRIVILEGED_KEYS = new Set<string>([ADMIN.key, ...SELLERS.map((s) => s.key)]);

async function main() {
  // ───────────────────────────────────────────────────────────────────────
  // 1. Users
  // ───────────────────────────────────────────────────────────────────────
  let userCount = 0;
  for (const u of ALL_USERS) {
    const uid = userId(u.key);
    const createdAt = PRIVILEGED_KEYS.has(u.key) ? daysAgo(200) : daysAgo(90);

    // The SUSPENDED user ('quan') gets a concrete suspension end-date in the
    // future; everyone else falls back to whatever the catalog declared.
    const suspendedUntil =
      u.userStatus === "SUSPENDED" ? daysFromNow(7) : u.suspendedUntil ?? null;

    const lastActiveDate =
      u.lastActiveDaysAgo != null ? daysAgo(u.lastActiveDaysAgo) : null;

    const data = {
      email: u.email,
      password: hash,
      fullName: u.fullName,
      phoneNumber: u.phoneNumber ?? null,
      profilePicture: null,
      dateOfBirth: new Date(u.dateOfBirth),
      createdAt,
      englishLevel: u.englishLevel ?? null,
      learningGoals: u.learningGoals,
      role: u.role, // "ADMINISTRATOR" | "COURSESELLER" | null
      isEmailVerified: u.isEmailVerified,
      userStatus: u.userStatus,
      suspendedUntil,
      statusReason: u.statusReason ?? null,
      xp: u.xp,
      streak: u.streak,
      lastActiveDate,
    };

    await prisma.user.upsert({
      where: { id: uid },
      update: data,
      create: { id: uid, ...data },
    });
    userCount++;
  }
  console.log(`  users: ${userCount}`);

  // ───────────────────────────────────────────────────────────────────────
  // 2. AdministratorProfile (one, for ADMIN)
  // ───────────────────────────────────────────────────────────────────────
  {
    const adminProfileId = id("adminProfile", "admin");
    await prisma.administratorProfile.upsert({
      where: { id: adminProfileId },
      update: { userId: userId("admin") },
      create: { id: adminProfileId, userId: userId("admin") },
    });
  }
  console.log(`  administratorProfiles: 1`);

  // ───────────────────────────────────────────────────────────────────────
  // 3. CourseSellerProfile (one per active seller)
  //    certification & expertise pulled from the seller's own application.
  // ───────────────────────────────────────────────────────────────────────
  let sellerProfileCount = 0;
  for (const seller of SELLERS) {
    const app = APPLICATIONS.find((a) => a.userKey === seller.key);
    const sellerProfileId = id("sellerProfile", seller.key);
    const data = {
      userId: userId(seller.key),
      isActive: true,
      certification: app?.certification ?? [],
      expertise: app?.expertise ?? [],
    };

    await prisma.courseSellerProfile.upsert({
      where: { id: sellerProfileId },
      update: data,
      create: { id: sellerProfileId, ...data },
    });
    sellerProfileCount++;
  }
  console.log(`  courseSellerProfiles: ${sellerProfileCount}`);

  // ───────────────────────────────────────────────────────────────────────
  // 4. CourseSellerApplication (one per APPLICATIONS entry)
  // ───────────────────────────────────────────────────────────────────────
  let applicationCount = 0;
  for (const a of APPLICATIONS) {
    const appId = id("application", a.key);
    const data = {
      userId: userId(a.userKey),
      certification: a.certification,
      expertise: a.expertise,
      message: a.message,
      status: a.status, // "PENDING" | "APPROVED" | "REJECTED"
      rejectionReason: a.rejectionReason ?? null,
      approvedBy: a.approvedByKey ? userId(a.approvedByKey) : null,
      approvedAt: a.approvedDaysAgo != null ? daysAgo(a.approvedDaysAgo) : null,
      createdAt: daysAgo(a.createdDaysAgo),
    };

    await prisma.courseSellerApplication.upsert({
      where: { id: appId },
      update: data,
      create: { id: appId, ...data },
    });
    applicationCount++;
  }
  console.log(`  courseSellerApplications: ${applicationCount}`);

  // ───────────────────────────────────────────────────────────────────────
  // 5. Policy (one per seller — Policy.userId is @unique)
  // ───────────────────────────────────────────────────────────────────────
  const POLICY_CONTENT =
    "Đã đồng ý Điều khoản & Chính sách dành cho người bán khoá học.";
  let policyCount = 0;
  for (const seller of SELLERS) {
    const policyId = id("policy", seller.key);
    const app = APPLICATIONS.find((a) => a.userKey === seller.key);
    // Anchor acceptance to when the seller was approved (falls back to ~95d).
    const createdAt =
      app?.approvedDaysAgo != null ? daysAgo(app.approvedDaysAgo) : daysAgo(95);
    const data = {
      userId: userId(seller.key),
      content: POLICY_CONTENT,
      createdAt,
    };

    await prisma.policy.upsert({
      where: { id: policyId },
      update: data,
      create: { id: policyId, ...data },
    });
    policyCount++;
  }
  console.log(`  policies: ${policyCount}`);

  // ───────────────────────────────────────────────────────────────────────
  // 6. AdminAuditLog (~12 realistic entries, all authored by ADMIN)
  // ───────────────────────────────────────────────────────────────────────
  const actorId = userId("admin");
  const actorEmail = ADMIN.email;
  const ADMIN_IP = "203.113.152.10"; // representative VN office IP

  // Each entry is keyed by a stable sequence number so re-runs stay idempotent.
  const auditEntries = [
    // — Seller application approvals (linh / minh / trang) —
    {
      action: "APPLICATION_APPROVE" as const,
      entityType: "APPLICATION" as const,
      entityId: id("application", "app-linh"),
      reason: "Hồ sơ đầy đủ chứng chỉ CELTA và IELTS 8.5, kinh nghiệm rõ ràng.",
      metadata: { applicantEmail: "linh.teacher@demo.capstone.local", status: "APPROVED" },
      createdAt: daysAgo(180),
    },
    {
      action: "APPLICATION_APPROVE" as const,
      entityType: "APPLICATION" as const,
      entityId: id("application", "app-minh"),
      reason: "Cựu giám khảo IELTS, chứng chỉ TESOL hợp lệ.",
      metadata: { applicantEmail: "minh.ielts@demo.capstone.local", status: "APPROVED" },
      createdAt: daysAgo(150),
    },
    {
      action: "APPLICATION_APPROVE" as const,
      entityType: "APPLICATION" as const,
      entityId: id("application", "app-trang"),
      reason: "Chuyên môn tiếng Anh thương mại, TOEIC 990 và MBA.",
      metadata: { applicantEmail: "trang.business@demo.capstone.local", status: "APPROVED" },
      createdAt: daysAgo(95),
    },
    // — Seller application rejection (mai) —
    {
      action: "APPLICATION_REJECT" as const,
      entityType: "APPLICATION" as const,
      entityId: id("application", "app-mai"),
      reason: "Chưa cung cấp chứng chỉ giảng dạy hợp lệ.",
      metadata: { applicantEmail: "mai.applicant@demo.capstone.local", status: "REJECTED" },
      createdAt: daysAgo(10),
    },
    // — User status changes —
    {
      action: "USER_STATUS_CHANGE" as const,
      entityType: "USER" as const,
      entityId: userId("quan"),
      reason: "Đăng bình luận spam nhiều lần trong phần thảo luận.",
      metadata: { from: "ACTIVE", to: "SUSPENDED", durationDays: 7 },
      createdAt: daysAgo(20),
    },
    {
      action: "USER_STATUS_CHANGE" as const,
      entityType: "USER" as const,
      entityId: userId("tu"),
      reason: "Gian lận thanh toán và lạm dụng hoàn tiền.",
      metadata: { from: "ACTIVE", to: "BANNED" },
      createdAt: daysAgo(45),
    },
    // — Course moderation —
    {
      action: "COURSE_APPROVE" as const,
      entityType: "COURSE" as const,
      entityId: courseId("ielts-foundation"),
      reason: "Nội dung khoá học đạt chuẩn, lộ trình rõ ràng.",
      metadata: { courseTitle: "IELTS Foundation 5.0 → 6.5", status: "ACTIVE" },
      createdAt: daysAgo(120),
    },
    {
      action: "COURSE_APPROVE" as const,
      entityType: "COURSE" as const,
      entityId: courseId("toeic-bootcamp"),
      reason: "Khoá TOEIC chất lượng, ngân hàng đề phong phú.",
      metadata: { courseTitle: "TOEIC 500 → 800 Bootcamp", status: "ACTIVE" },
      createdAt: daysAgo(88),
    },
    {
      action: "COURSE_REJECT" as const,
      entityType: "COURSE" as const,
      entityId: courseId("ielts-hacks"),
      reason:
        "Tiêu đề cam kết điểm số phi thực tế và nội dung mỏng, vi phạm chính sách nội dung.",
      metadata: { courseTitle: "IELTS 9.0 Guaranteed Hacks", status: "REFUSE" },
      createdAt: daysAgo(60),
    },
    // — Finance: withdrawal / refund / wallet —
    {
      action: "WITHDRAWAL_APPROVE" as const,
      entityType: "WITHDRAWAL" as const,
      entityId: id("withdrawal", "wd-trang-1"),
      reason: "Yêu cầu rút tiền hợp lệ, đã đối chiếu doanh thu.",
      metadata: { sellerEmail: "trang.business@demo.capstone.local", amount: 3500000, currency: "VND" },
      createdAt: daysAgo(30),
    },
    {
      action: "REFUND_APPROVE" as const,
      entityType: "REFUND" as const,
      entityId: id("refund", "rf-binh-toeic"),
      reason: "Học viên yêu cầu hoàn tiền trong thời hạn cho phép.",
      metadata: { learnerEmail: "binh.tran@demo.capstone.local", amount: 940000, currency: "VND" },
      createdAt: daysAgo(15),
    },
    {
      action: "WALLET_ADJUST" as const,
      entityType: "WALLET" as const,
      entityId: userId("an"),
      reason: "Bồi thường sự cố thanh toán bị trừ tiền hai lần.",
      metadata: { delta: 200000, currency: "VND", direction: "CREDIT" },
      createdAt: daysAgo(1),
    },
  ];

  let auditCount = 0;
  for (let n = 0; n < auditEntries.length; n++) {
    const entry = auditEntries[n];
    const logId = id("audit", n + 1);
    const data = {
      actorId,
      actorEmail,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      reason: entry.reason,
      metadata: entry.metadata,
      ipAddress: ADMIN_IP,
      createdAt: entry.createdAt,
    };

    await prisma.adminAuditLog.upsert({
      where: { id: logId },
      update: data,
      create: { id: logId, ...data },
    });
    auditCount++;
  }
  console.log(`  adminAuditLogs: ${auditCount}`);
}

main()
  .then(() => console.log("✓ identity demo seed complete"))
  .catch((err) => {
    console.error("✗ identity demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
