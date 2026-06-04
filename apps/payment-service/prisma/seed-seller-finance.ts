// =============================================================================
// Payment Service — Seed Seller Finance
// -----------------------------------------------------------------------------
// Seeds wallet, earnings (mixed PENDING/RELEASED/REFUNDED), withdrawal requests,
// and matching transactions for an EXISTING seller user. Idempotent: wipes the
// seller's existing finance data first, then reinserts a deterministic fixture
// so the seller dashboard / earnings / wallet pages have realistic numbers.
//
// Usage:
//   SELLER_ID=<uuid> tsx prisma/seed-seller-finance.ts
//   or
//   tsx prisma/seed-seller-finance.ts --seller-id=<uuid>
//
// The seller must already exist in identity-service (i.e. the UUID corresponds
// to a real user). This seed does NOT touch identity-service or course-service.
// =============================================================================

import { PrismaClient } from "../generated/prisma/index.js";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

// ── CLI / env arg parsing ───────────────────────────────────────────────────
function resolveSellerId(): string {
  const fromArg = process.argv
    .find((a) => a.startsWith("--seller-id="))
    ?.split("=")[1];
  const id = fromArg ?? process.env.SELLER_ID;
  if (!id) {
    console.error(
      "❌ Missing seller id.\n" +
        "   Pass via env:  SELLER_ID=<uuid> tsx prisma/seed-seller-finance.ts\n" +
        "   Or via flag:   tsx prisma/seed-seller-finance.ts --seller-id=<uuid>"
    );
    process.exit(1);
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    console.error(`❌ Invalid uuid: ${id}`);
    process.exit(1);
  }
  return id;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

type EarningSpec = {
  totalAmount: number;
  daysSinceSale: number;        // when buyer paid
  clearanceDays: number;        // hold window
  status: "PENDING" | "RELEASED" | "REFUNDED";
};

// Realistic fixture: 8 RELEASED, 5 PENDING, 1 REFUNDED.
const earningSpecs: EarningSpec[] = [
  // RELEASED — cleared, money in allowance
  { totalAmount: 199_000, daysSinceSale: 30, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 149_000, daysSinceSale: 28, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 99_000,  daysSinceSale: 24, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 249_000, daysSinceSale: 21, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 79_000,  daysSinceSale: 18, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 119_000, daysSinceSale: 15, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 89_000,  daysSinceSale: 12, clearanceDays: 7, status: "RELEASED" },
  { totalAmount: 159_000, daysSinceSale: 9,  clearanceDays: 7, status: "RELEASED" },
  // PENDING — in clearance window, still in pendingBalance
  { totalAmount: 99_000,  daysSinceSale: 5, clearanceDays: 7, status: "PENDING" },
  { totalAmount: 149_000, daysSinceSale: 4, clearanceDays: 7, status: "PENDING" },
  { totalAmount: 199_000, daysSinceSale: 3, clearanceDays: 7, status: "PENDING" },
  { totalAmount: 79_000,  daysSinceSale: 2, clearanceDays: 7, status: "PENDING" },
  { totalAmount: 119_000, daysSinceSale: 1, clearanceDays: 7, status: "PENDING" },
  // REFUNDED — was a sale but buyer refunded; should not count in totals
  { totalAmount: 99_000, daysSinceSale: 20, clearanceDays: 7, status: "REFUNDED" },
];

const COMMISSION_RATE = 0.3;     // 30 % platform cut
const GATEWAY_FEE_RATE = 0.03;   // 3 %
const GATEWAY_FEE_FIXED = 2_000; // VND

function computeSplit(total: number) {
  const gatewayFee = Math.round(total * GATEWAY_FEE_RATE + GATEWAY_FEE_FIXED);
  const netAmount = total - gatewayFee;
  const commissionAmount = Math.round(netAmount * COMMISSION_RATE);
  const sellerAmount = netAmount - commissionAmount;
  return { gatewayFee, netAmount, commissionAmount, sellerAmount };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const sellerId = resolveSellerId();
  console.log(`🌱 Seeding seller finance for ${sellerId}`);

  // 1. Ensure wallet exists
  const wallet = await prisma.wallet.upsert({
    where: { userId: sellerId },
    update: {},
    create: { userId: sellerId, allowance: 0, pendingBalance: 0 },
  });
  console.log(`   ✓ Wallet ${wallet.id}`);

  // 2. Wipe prior seeded data for this seller (idempotent)
  const wipedEarnings = await prisma.sellerEarning.deleteMany({ where: { sellerId } });
  const wipedWithdrawals = await prisma.withdrawalRequest.deleteMany({ where: { sellerId } });
  const wipedTxns = await prisma.transaction.deleteMany({
    where: {
      walletId: wallet.id,
      transactionType: { in: ["SELLER_EARNING", "WITHDRAW"] },
    },
  });
  console.log(
    `   ✓ Wiped ${wipedEarnings.count} earnings, ` +
      `${wipedWithdrawals.count} withdrawals, ${wipedTxns.count} transactions`
  );

  // 3. Insert earnings + matching transactions
  let pendingBalance = 0;
  let releasedTotal = 0;

  for (const spec of earningSpecs) {
    const createdAt = daysAgo(spec.daysSinceSale);
    const availableAt = new Date(createdAt);
    availableAt.setDate(availableAt.getDate() + spec.clearanceDays);
    const isClearedByNow = availableAt.getTime() <= Date.now();

    const split = computeSplit(spec.totalAmount);
    const buyerId = randomUUID();
    const courseId = randomUUID();
    const orderId = randomUUID();

    const releasedAt =
      spec.status === "RELEASED" && isClearedByNow
        ? new Date(availableAt.getTime() + 60 * 60 * 1000) // 1h after maturity
        : null;

    await prisma.sellerEarning.create({
      data: {
        sellerId,
        buyerId,
        courseId,
        orderId,
        totalAmount: spec.totalAmount,
        gatewayFee: split.gatewayFee,
        netAmount: split.netAmount,
        commissionRate: COMMISSION_RATE,
        commissionAmount: split.commissionAmount,
        sellerAmount: split.sellerAmount,
        status: spec.status,
        availableAt,
        releasedAt,
        createdAt,
      },
    });

    // Mirror commission.service flow: PENDING txn at sale, SUCCESS txn at release
    if (spec.status === "PENDING") {
      pendingBalance += split.sellerAmount;
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: split.sellerAmount,
          transactionType: "SELLER_EARNING",
          status: "PENDING",
          description: `Course sale revenue (pending until ${availableAt.toLocaleDateString("vi-VN")})`,
          // orderId omitted — would FK-fail against orders table; sellerEarning.orderId already keeps the linkage
          createdAt,
        },
      });
    } else if (spec.status === "RELEASED") {
      releasedTotal += split.sellerAmount;
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: split.sellerAmount,
          transactionType: "SELLER_EARNING",
          status: "SUCCESS",
          description: `Earnings released`,
          createdAt: releasedAt ?? createdAt,
        },
      });
    }
    // REFUNDED earnings: leave no transaction (matches commission.service refund flow)
  }

  // 4. Withdrawal requests (deduct from allowance)
  const pendingWithdrawAmount = 100_000;
  const approvedWithdrawAmount = 50_000;

  const pendingWd = await prisma.withdrawalRequest.create({
    data: {
      sellerId,
      amount: pendingWithdrawAmount,
      bankName: "Vietcombank",
      accountName: "NGUYEN VAN A",
      accountNumber: "1234567890",
      status: "PENDING",
      createdAt: daysAgo(2),
    },
  });
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount: -pendingWithdrawAmount,
      transactionType: "WITHDRAW",
      status: "PENDING",
      description: `Withdrawal request ${pendingWd.id}`,
      createdAt: daysAgo(2),
    },
  });

  const approvedWd = await prisma.withdrawalRequest.create({
    data: {
      sellerId,
      amount: approvedWithdrawAmount,
      bankName: "Techcombank",
      accountName: "NGUYEN VAN A",
      accountNumber: "9876543210",
      status: "APPROVED",
      processedAt: daysAgo(5),
      adminNote: "Approved — proof uploaded",
      createdAt: daysAgo(7),
    },
  });
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount: -approvedWithdrawAmount,
      transactionType: "WITHDRAW",
      status: "SUCCESS",
      description: `Withdrawal approved ${approvedWd.id}`,
      createdAt: daysAgo(5),
    },
  });

  // 5. Final wallet balance
  const allowance = releasedTotal - pendingWithdrawAmount - approvedWithdrawAmount;
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { allowance, pendingBalance },
  });

  // ── Summary ────────────────────────────────────────────────────────────
  const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";
  console.log(`
✅ Seeded.
   Seller:           ${sellerId}
   Released total:   ${fmt(releasedTotal)}
   - PENDING wd:     -${fmt(pendingWithdrawAmount)}
   - APPROVED wd:    -${fmt(approvedWithdrawAmount)}
   = Allowance:      ${fmt(allowance)}

   Pending balance:  ${fmt(pendingBalance)}  (${earningSpecs.filter((e) => e.status === "PENDING").length} earnings in clearance window)
   Refunded count:   ${earningSpecs.filter((e) => e.status === "REFUNDED").length}
   Withdrawals:      1 PENDING + 1 APPROVED
`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
