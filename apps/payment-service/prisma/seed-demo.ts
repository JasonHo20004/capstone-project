// =============================================================================
// Payment Service — Demo Seed
// -----------------------------------------------------------------------------
// Builds the entire "money graph" for the demo dataset from the shared catalog:
//   plans → features → commission config → coupons → wallets → carts →
//   orders → payment transactions → coupon redemptions → seller earnings →
//   wallet top-ups → withdrawal requests → refund requests → subscriptions.
//
// Every row uses a deterministic UUID derived from a stable key, so the script
// is fully idempotent: re-running upserts in place and never duplicates or
// deletes anything. Cross-service references (users, courses, orders) reuse the
// shared id() helpers so rows join across the 7 separate service databases.
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import {
  ENROLLMENTS,
  COURSES,
  LEARNERS,
  SELLERS,
  LEARNER_KEYS,
  SELLER_KEYS,
  COUPONS,
  COUPON_BY_KEY,
  computeDiscount,
  PLANS,
  PRO_SUBSCRIBERS,
  daysAgo,
  daysFromNow,
  hoursAgo,
  NOW,
  id,
  userId,
  courseId,
  orderId,
  couponId,
  planId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.PAYMENT_DIRECT_URL ?? process.env.PAYMENT_DATABASE_URL } },
});

// ── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_COMMISSION_RATE = 0.3;
const MINH_COMMISSION_RATE = 0.25;
const GATEWAY_FEE_RATE = 0.03;
const GATEWAY_FEE_FIXED = 2000;
const CLEARANCE_DAYS = 7;
const RELEASE_AGE_DAYS = 30; // older than this → RELEASED

// ── Lookups ──────────────────────────────────────────────────────────────────
const COURSE_BY_KEY = Object.fromEntries(COURSES.map((c) => [c.key, c]));

type EarningStatus = "PENDING" | "AVAILABLE" | "RELEASED" | "REFUNDED";

// Money is computed in whole VND (Decimal columns store it fine as numbers).
function round(n: number): number {
  return Math.round(n);
}

// =============================================================================
// main
// =============================================================================
async function main() {
  // ── 1. UserPlan (FREE + PRO) ───────────────────────────────────────────────
  // name AND type are both @unique. Key on `type` so we update any plan the app
  // already seeded (keeping its id) instead of colliding on the name/type
  // unique. Capture the id that actually persisted, per type, for subscriptions.
  const planIdByType: Record<string, string> = {};
  for (const p of PLANS) {
    const { id: deterministicId, ...rest } = {
      id: planId(p.key),
      name: p.name,
      type: p.type,
      price: p.price,
      description: p.description,
      features: p.features,
      isActive: true,
    };
    const row = await prisma.userPlan.upsert({
      where: { type: p.type },
      update: rest,
      create: { id: deterministicId, ...rest },
    });
    planIdByType[p.type] = row.id;
  }

  // ── 2. PlanFeatureDefinition (one per distinct feature key) ─────────────────
  // Vietnamese labels; the AI / unlimited capabilities are premium-only.
  const FEATURE_LABELS: Record<string, string> = {
    flashcards_basic: "Thẻ ghi nhớ cơ bản",
    placement_test: "Bài kiểm tra xếp trình độ",
    community_discussion: "Thảo luận cộng đồng",
    ai_writing: "AI chấm bài Viết",
    ai_speaking: "AI chấm bài Nói",
    skill_tree: "Cây kỹ năng AI",
    learning_path: "Lộ trình học AI",
    unlimited_practice: "Luyện tập không giới hạn",
    ai_tutor: "Gia sư AI cá nhân",
  };
  const PREMIUM_FEATURES = new Set([
    "ai_writing",
    "ai_speaking",
    "skill_tree",
    "learning_path",
    "unlimited_practice",
    "ai_tutor",
  ]);

  // Distinct feature keys preserving first-seen order across all plans.
  const featureKeys: string[] = [];
  for (const p of PLANS) {
    for (const f of p.features) {
      if (!featureKeys.includes(f)) featureKeys.push(f);
    }
  }
  for (let i = 0; i < featureKeys.length; i++) {
    const key = featureKeys[i];
    const data = {
      id: id("feature", key),
      key,
      label: FEATURE_LABELS[key] ?? key,
      isPremium: PREMIUM_FEATURES.has(key),
      displayOrder: i,
    };
    await prisma.planFeatureDefinition.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  // ── 3. CommissionConfig (global default + per-seller override) ──────────────
  {
    const data = {
      id: id("commission", "global"),
      sellerId: null,
      commissionRate: DEFAULT_COMMISSION_RATE,
      gatewayFeeRate: GATEWAY_FEE_RATE,
      gatewayFeeFixed: GATEWAY_FEE_FIXED,
      clearanceDays: CLEARANCE_DAYS,
    };
    await prisma.commissionConfig.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
  {
    const data = {
      id: id("commission", "seller-minh"),
      sellerId: userId("seller-minh"),
      commissionRate: MINH_COMMISSION_RATE,
      gatewayFeeRate: GATEWAY_FEE_RATE,
      gatewayFeeFixed: GATEWAY_FEE_FIXED,
      clearanceDays: CLEARANCE_DAYS,
    };
    await prisma.commissionConfig.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  // ── 4. Coupons ──────────────────────────────────────────────────────────────
  // usedCount = number of redemptions we will create (one per enrollment that
  // applied that coupon).
  const redemptionCountByCoupon: Record<string, number> = {};
  for (const e of ENROLLMENTS) {
    if (e.couponKey) {
      redemptionCountByCoupon[e.couponKey] =
        (redemptionCountByCoupon[e.couponKey] ?? 0) + 1;
    }
  }
  for (const c of COUPONS) {
    const data = {
      id: couponId(c.key),
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: c.discountValue,
      maxDiscount: c.maxDiscount ?? null,
      minOrderAmount: c.minOrderAmount,
      maxRedemptions: c.maxRedemptions ?? null,
      maxPerUser: c.maxPerUser ?? null,
      usedCount: redemptionCountByCoupon[c.key] ?? 0,
      startsAt: daysAgo(c.startsDaysAgo),
      expiresAt: daysFromNow(c.expiresDaysFromNow),
      isActive: c.isActive,
      createdById: userId("admin"),
      createdAt: daysAgo(c.startsDaysAgo),
    };
    await prisma.coupon.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  // ── 4b. Pre-create cart & wallet ROWS so the step-5/8 foreign keys resolve.
  // (Order.cartId → Cart; Transaction.walletId → Wallet.) Final values — cart
  // timestamps and wallet balances — are written by steps 6 & 9 below, which
  // upsert the same ids idempotently. This keeps seller balances correct
  // (accumulated in step 5) without reordering the accrual logic.
  for (const learnerKey of new Set(ENROLLMENTS.map((e) => e.learnerKey))) {
    await prisma.cart.upsert({
      where: { id: id("cart", learnerKey) },
      update: {},
      create: { id: id("cart", learnerKey), userId: userId(learnerKey), createdAt: daysAgo(90) },
    });
  }
  for (const k of [...LEARNER_KEYS, ...SELLER_KEYS]) {
    await prisma.wallet.upsert({
      where: { id: id("wallet", k) },
      update: {},
      create: { id: id("wallet", k), userId: userId(k), allowance: 0, pendingBalance: 0 },
    });
  }

  // ── 5. Orders + Transactions + CouponRedemptions + SellerEarnings ───────────
  // We build orders first (each ENROLLMENTS entry is one order), then derive the
  // payment transaction, the coupon redemption (if any) and the seller earning
  // (for paid courses only). Seller earning totals are accumulated per seller so
  // wallets can be computed afterward.
  const sellerPending: Record<string, number> = {}; // AVAILABLE + PENDING
  const sellerReleased: Record<string, number> = {}; // RELEASED
  for (const k of SELLER_KEYS) {
    sellerPending[k] = 0;
    sellerReleased[k] = 0;
  }

  let orderCount = 0;
  let txnPaymentCount = 0;
  let redemptionCount = 0;
  let earningCount = 0;

  for (const e of ENROLLMENTS) {
    const course = COURSE_BY_KEY[e.courseKey];
    const subtotal = course.price;
    const coupon = e.couponKey ? COUPON_BY_KEY[e.couponKey] : undefined;
    const discount = coupon ? computeDiscount(coupon, subtotal) : 0;
    const totalAmount = subtotal - discount;
    const createdAt = daysAgo(e.daysAgo);

    // 5a. Order
    const order = {
      id: orderId(e.key),
      userId: userId(e.learnerKey),
      cartId: id("cart", e.learnerKey),
      subtotal,
      discount,
      totalAmount,
      couponId: coupon ? couponId(coupon.key) : null,
      couponCode: coupon ? coupon.code : null,
      createdAt,
    };
    await prisma.order.upsert({
      where: { id: order.id },
      update: order,
      create: order,
    });
    orderCount++;

    // 5b. Payment transaction (one per order; orderId is @unique)
    const txn = {
      id: id("txn", e.key),
      amount: totalAmount,
      status: "SUCCESS" as const,
      walletId: id("wallet", e.learnerKey),
      transactionType: "PAYMENT" as const,
      orderId: order.id,
      description: "Thanh toán khoá học",
      createdAt,
    };
    await prisma.transaction.upsert({
      where: { id: txn.id },
      update: txn,
      create: txn,
    });
    txnPaymentCount++;

    // 5c. Coupon redemption (only when a coupon was applied)
    if (coupon) {
      const redemption = {
        id: id("redemption", e.key),
        couponId: couponId(coupon.key),
        userId: userId(e.learnerKey),
        orderId: order.id,
        amount: discount,
        createdAt,
      };
      await prisma.couponRedemption.upsert({
        where: {
          couponId_orderId: {
            couponId: redemption.couponId,
            orderId: redemption.orderId,
          },
        },
        update: redemption,
        create: redemption,
      });
      redemptionCount++;
    }

    // 5d. Seller earning (paid courses only — free course produces no earning)
    if (subtotal > 0) {
      const sellerKey = course.sellerKey;
      const rate =
        sellerKey === "seller-minh"
          ? MINH_COMMISSION_RATE
          : DEFAULT_COMMISSION_RATE;
      const gatewayFee = round(totalAmount * GATEWAY_FEE_RATE) + GATEWAY_FEE_FIXED;
      const commissionAmount = round(totalAmount * rate);
      const netAmount = totalAmount - gatewayFee;
      const sellerAmount = totalAmount - commissionAmount - gatewayFee;
      const availableAt = new Date(
        createdAt.getTime() + CLEARANCE_DAYS * 24 * 60 * 60 * 1000
      );

      let status: EarningStatus;
      let releasedAt: Date | null = null;
      if (e.daysAgo > RELEASE_AGE_DAYS) {
        status = "RELEASED";
        releasedAt = availableAt;
      } else if (e.daysAgo > CLEARANCE_DAYS) {
        status = "AVAILABLE";
      } else {
        status = "PENDING";
      }

      const earning = {
        id: id("earning", e.key),
        sellerId: userId(sellerKey),
        courseId: courseId(e.courseKey),
        orderId: order.id,
        buyerId: userId(e.learnerKey),
        totalAmount,
        gatewayFee,
        netAmount,
        commissionRate: rate,
        commissionAmount,
        sellerAmount,
        status,
        availableAt,
        releasedAt,
        createdAt,
      };
      await prisma.sellerEarning.upsert({
        where: { id: earning.id },
        update: earning,
        create: earning,
      });
      earningCount++;

      if (status === "RELEASED") {
        sellerReleased[sellerKey] += sellerAmount;
      } else {
        sellerPending[sellerKey] += sellerAmount;
      }
    }
  }

  // ── 6. Carts (one per learner with ≥1 enrollment; Cart.userId is @unique) ───
  const learnersWithEnrollment = new Set(ENROLLMENTS.map((e) => e.learnerKey));
  let cartCount = 0;
  for (const learnerKey of learnersWithEnrollment) {
    const cart = {
      id: id("cart", learnerKey),
      userId: userId(learnerKey),
      createdAt: daysAgo(90),
    };
    await prisma.cart.upsert({
      where: { id: cart.id },
      update: cart,
      create: cart,
    });
    cartCount++;
  }

  // ── 7. CartItems (a few ACTIVE/unpurchased items to demo the cart UI) ───────
  // Pick courses each learner has NOT enrolled in.
  const enrolledByLearner: Record<string, Set<string>> = {};
  for (const e of ENROLLMENTS) {
    (enrolledByLearner[e.learnerKey] ??= new Set()).add(e.courseKey);
  }
  // (learnerKey, courseKey, addedDaysAgo) — all paid, all not yet enrolled.
  const CART_ITEMS: { learnerKey: string; courseKey: string; addedDaysAgo: number }[] = [
    { learnerKey: "an", courseKey: "business-english", addedDaysAgo: 2 },
    { learnerKey: "an", courseKey: "toeic-bootcamp", addedDaysAgo: 1 },
    { learnerKey: "chi", courseKey: "ielts-foundation", addedDaysAgo: 3 },
    { learnerKey: "giang", courseKey: "business-english", addedDaysAgo: 1 },
  ];
  let cartItemCount = 0;
  for (const ci of CART_ITEMS) {
    const course = COURSE_BY_KEY[ci.courseKey];
    // Safety: skip if the learner is actually enrolled (keeps demo coherent).
    if (enrolledByLearner[ci.learnerKey]?.has(ci.courseKey)) continue;
    const itemKey = `${ci.learnerKey}:${ci.courseKey}`;
    const item = {
      id: id("cartitem", itemKey),
      cartId: id("cart", ci.learnerKey),
      courseId: courseId(ci.courseKey),
      priceAtTime: course.price,
      addedAt: daysAgo(ci.addedDaysAgo),
    };
    await prisma.cartItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
    cartItemCount++;
  }

  // ── 8. Wallet top-ups (TopupOrder + DEPOSIT Transaction) ────────────────────
  // 4 learners add real money to their wallet.
  const TOPUPS: {
    key: string;
    learnerKey: string;
    amount: number;
    paymentMethod: "STRIPE" | "VNPAY";
    daysAgo: number;
  }[] = [
    { key: "tp-an", learnerKey: "an", amount: 200000, paymentMethod: "STRIPE", daysAgo: 20 },
    { key: "tp-binh", learnerKey: "binh", amount: 500000, paymentMethod: "VNPAY", daysAgo: 15 },
    { key: "tp-dung", learnerKey: "dung", amount: 1000000, paymentMethod: "STRIPE", daysAgo: 10 },
    { key: "tp-lan", learnerKey: "lan", amount: 750000, paymentMethod: "VNPAY", daysAgo: 5 },
  ];
  let topupCount = 0;
  let txnDepositCount = 0;
  for (const t of TOPUPS) {
    const createdAt = daysAgo(t.daysAgo);
    const topup = {
      id: id("topup", t.key),
      userId: userId(t.learnerKey),
      realMoney: t.amount,
      realAmount: t.amount,
      currency: "VND",
      paymentMethod: t.paymentMethod,
      status: "SUCCESS" as const,
      stripeSessionId: `demo_sess_${t.key}`,
      createdAt,
    };
    await prisma.topupOrder.upsert({
      where: { id: topup.id },
      update: topup,
      create: topup,
    });
    topupCount++;

    const txn = {
      id: id("txn-topup", t.key),
      amount: t.amount,
      status: "SUCCESS" as const,
      walletId: id("wallet", t.learnerKey),
      transactionType: "DEPOSIT" as const,
      topupOrderId: topup.id,
      description: "Nạp tiền vào ví",
      createdAt,
    };
    await prisma.transaction.upsert({
      where: { id: txn.id },
      update: txn,
      create: txn,
    });
    txnDepositCount++;
  }

  // ── 9. Wallets ──────────────────────────────────────────────────────────────
  // Learners: small leftover allowance, no pending balance.
  // Sellers: pendingBalance = AVAILABLE+PENDING earnings; allowance = RELEASED.
  let walletCount = 0;
  const LEARNER_ALLOWANCE: Record<string, number> = {
    an: 50000,
    binh: 120000,
    chi: 80000,
    dung: 300000,
    giang: 60000,
    ha: 150000,
    khanh: 90000,
    lan: 250000,
    nam: 110000,
    phuc: 70000,
    quan: 0,
    tu: 0,
  };
  for (const learnerKey of LEARNER_KEYS) {
    const wallet = {
      id: id("wallet", learnerKey),
      userId: userId(learnerKey),
      allowance: LEARNER_ALLOWANCE[learnerKey] ?? 100000,
      pendingBalance: 0,
    };
    await prisma.wallet.upsert({
      where: { id: wallet.id },
      update: wallet,
      create: wallet,
    });
    walletCount++;
  }
  for (const sellerKey of SELLER_KEYS) {
    const wallet = {
      id: id("wallet", sellerKey),
      userId: userId(sellerKey),
      allowance: sellerReleased[sellerKey] ?? 0,
      pendingBalance: sellerPending[sellerKey] ?? 0,
    };
    await prisma.wallet.upsert({
      where: { id: wallet.id },
      update: wallet,
      create: wallet,
    });
    walletCount++;
  }

  // ── 10. Withdrawal requests (5 across sellers) ──────────────────────────────
  // Exact keys matter so the identity-service audit log lines up.
  const WITHDRAWALS = [
    {
      key: "wd-trang-1",
      sellerKey: "seller-trang",
      amount: 1500000,
      status: "APPROVED" as const,
      bankName: "Vietcombank",
      accountName: "PHAM THU TRANG",
      accountNumber: "0123456789",
      proofImageUrl: "https://demo.capstone.local/proofs/wd-trang-1.jpg",
      adminNote: null as string | null,
      processedAt: daysAgo(10),
      cancelledAt: null as Date | null,
      retriedFromId: null as string | null,
      createdAt: daysAgo(12),
    },
    {
      key: "wd-minh-1",
      sellerKey: "seller-minh",
      amount: 2000000,
      status: "PENDING" as const,
      bankName: "Techcombank",
      accountName: "LE QUANG MINH",
      accountNumber: "1903123456",
      proofImageUrl: null as string | null,
      adminNote: null as string | null,
      processedAt: null as Date | null,
      cancelledAt: null as Date | null,
      retriedFromId: null as string | null,
      createdAt: daysAgo(2),
    },
    {
      key: "wd-linh-1",
      sellerKey: "seller-linh",
      amount: 800000,
      status: "REJECTED" as const,
      bankName: "BIDV",
      accountName: "NGUYEN MY LINH",
      accountNumber: "21010001234",
      proofImageUrl: null as string | null,
      adminNote: "Thông tin tài khoản không khớp" as string | null,
      processedAt: daysAgo(8),
      cancelledAt: null as Date | null,
      retriedFromId: null as string | null,
      createdAt: daysAgo(9),
    },
    {
      key: "wd-linh-2",
      sellerKey: "seller-linh",
      amount: 500000,
      status: "CANCELLED" as const,
      bankName: "BIDV",
      accountName: "NGUYEN MY LINH",
      accountNumber: "21010001234",
      proofImageUrl: null as string | null,
      adminNote: null as string | null,
      processedAt: null as Date | null,
      cancelledAt: daysAgo(4),
      retriedFromId: null as string | null,
      createdAt: daysAgo(5),
    },
    {
      key: "wd-linh-3",
      sellerKey: "seller-linh",
      amount: 800000,
      status: "PENDING" as const,
      bankName: "BIDV",
      accountName: "NGUYEN MY LINH",
      accountNumber: "21010001234",
      proofImageUrl: null as string | null,
      adminNote: null as string | null,
      processedAt: null as Date | null,
      cancelledAt: null as Date | null,
      retriedFromId: id("withdrawal", "wd-linh-1"),
      createdAt: daysAgo(1),
    },
  ];
  let withdrawalCount = 0;
  for (const w of WITHDRAWALS) {
    const data = {
      id: id("withdrawal", w.key),
      sellerId: userId(w.sellerKey),
      amount: w.amount,
      bankName: w.bankName,
      accountName: w.accountName,
      accountNumber: w.accountNumber,
      status: w.status,
      proofImageUrl: w.proofImageUrl,
      adminNote: w.adminNote,
      processedAt: w.processedAt,
      cancelledAt: w.cancelledAt,
      retriedFromId: w.retriedFromId,
      createdAt: w.createdAt,
    };
    await prisma.withdrawalRequest.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    withdrawalCount++;
  }

  // ── 11. Refund requests (4 linked to real orders) ──────────────────────────
  // Amounts default to the order's totalAmount unless noted.
  const REFUNDS = [
    {
      key: "rf-binh-toeic",
      orderKey: "ord-binh-toeic",
      requesterKey: "binh",
      status: "APPROVED" as const,
      reason: "Khoá học không phù hợp với trình độ hiện tại.",
      adminId: userId("admin") as string | null,
      adminNote: "Đã duyệt hoàn tiền về ví." as string | null,
      processedAt: daysAgo(5) as Date | null,
    },
    {
      key: "rf-nam-toeic",
      orderKey: "ord-nam-toeic",
      requesterKey: "nam",
      status: "PENDING" as const,
      reason: "Nội dung khác với mô tả khoá học.",
      adminId: null as string | null,
      adminNote: null as string | null,
      processedAt: null as Date | null,
    },
    {
      key: "rf-ha-biz",
      orderKey: "ord-ha-biz",
      requesterKey: "ha",
      status: "REJECTED" as const,
      reason: "Muốn đổi sang khoá khác.",
      adminId: userId("admin") as string | null,
      adminNote: "Đã học quá 30% nội dung" as string | null,
      processedAt: daysAgo(6) as Date | null,
    },
    {
      key: "rf-an-pron",
      orderKey: "ord-an-pron",
      requesterKey: "an",
      status: "COMPLETED" as const,
      reason: "Mua nhầm khoá học.",
      adminId: userId("admin") as string | null,
      adminNote: "Hoàn tiền hoàn tất." as string | null,
      processedAt: daysAgo(7) as Date | null,
    },
  ];
  let refundCount = 0;
  for (const r of REFUNDS) {
    const enrollment = ENROLLMENTS.find((en) => en.key === r.orderKey)!;
    const course = COURSE_BY_KEY[enrollment.courseKey];
    const coupon = enrollment.couponKey
      ? COUPON_BY_KEY[enrollment.couponKey]
      : undefined;
    const discount = coupon ? computeDiscount(coupon, course.price) : 0;
    const amount = course.price - discount; // refund the amount actually paid
    const data = {
      id: id("refund", r.key),
      orderId: orderId(r.orderKey),
      requesterId: userId(r.requesterKey),
      amount,
      reason: r.reason,
      status: r.status,
      adminId: r.adminId,
      adminNote: r.adminNote,
      processedAt: r.processedAt,
      createdAt: daysAgo(enrollment.daysAgo > 8 ? 8 : enrollment.daysAgo),
    };
    await prisma.refundRequest.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    refundCount++;
  }

  // ── 12. UserSubscriptions (PRO subscribers) ─────────────────────────────────
  let subscriptionCount = 0;
  for (const s of PRO_SUBSCRIBERS) {
    const startDate = daysAgo(s.startedDaysAgo);
    const endDate = new Date(
      startDate.getTime() + s.durationDays * 24 * 60 * 60 * 1000
    );
    const data = {
      id: id("sub", s.learnerKey),
      userId: userId(s.learnerKey),
      planId: planIdByType["PRO"] ?? planId("pro"),
      startDate,
      endDate,
      isActive: endDate > NOW,
      createdAt: startDate,
    };
    await prisma.userSubscription.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    subscriptionCount++;
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.table({
    userPlans: PLANS.length,
    planFeatureDefinitions: featureKeys.length,
    commissionConfigs: 2,
    coupons: COUPONS.length,
    carts: cartCount,
    cartItems: cartItemCount,
    orders: orderCount,
    transactionsPayment: txnPaymentCount,
    transactionsDeposit: txnDepositCount,
    couponRedemptions: redemptionCount,
    sellerEarnings: earningCount,
    topupOrders: topupCount,
    wallets: walletCount,
    withdrawalRequests: withdrawalCount,
    refundRequests: refundCount,
    userSubscriptions: subscriptionCount,
  });
}

main()
  .then(() => console.log("✓ payment demo seed complete"))
  .catch((err) => {
    console.error("✗ payment demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
