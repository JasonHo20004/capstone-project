// =============================================================================
// Commission Service - Revenue Split with Gateway Fee & Pending Balance
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import { WalletRepository } from "../../wallet/repositories/wallet.repository.js";
import type { TransactionType, TransactionStatus, EarningStatus } from "../../../../generated/prisma/index.js";

const SYSTEM_WALLET_USER_ID = process.env.ADMIN_SYSTEM_USER_ID || "00000000-0000-0000-0000-000000000000";
const DEFAULT_COMMISSION_RATE = 0.3;
const DEFAULT_GATEWAY_FEE_RATE = 0.03; // 3%
const DEFAULT_GATEWAY_FEE_FIXED = 2000; // 2,000đ
const DEFAULT_CLEARANCE_DAYS = 7;

interface FullConfig {
  commissionRate: number;
  gatewayFeeRate: number;
  gatewayFeeFixed: number;
  clearanceDays: number;
}

export class CommissionService {
  private prisma = databaseService.getClient();
  private walletRepo = new WalletRepository();

  // ── Get full config for a seller ────────────────────────────────────────

  async getFullConfig(sellerId?: string): Promise<FullConfig> {
    let config = sellerId
      ? await this.prisma.commissionConfig.findUnique({ where: { sellerId } })
      : null;

    if (!config) {
      config = await this.prisma.commissionConfig.findFirst({
        where: { sellerId: null },
      });
    }

    return {
      commissionRate: config ? Number(config.commissionRate) : DEFAULT_COMMISSION_RATE,
      gatewayFeeRate: config ? Number(config.gatewayFeeRate) : DEFAULT_GATEWAY_FEE_RATE,
      gatewayFeeFixed: config ? Number(config.gatewayFeeFixed) : DEFAULT_GATEWAY_FEE_FIXED,
      clearanceDays: config?.clearanceDays ?? DEFAULT_CLEARANCE_DAYS,
    };
  }

  async getCommissionRate(sellerId: string): Promise<number> {
    const cfg = await this.getFullConfig(sellerId);
    return cfg.commissionRate;
  }

  // ── Process revenue split ───────────────────────────────────────────────

  async processRevenueSplit(params: {
    orderId: string;
    courseId: string;
    sellerId: string;
    buyerId: string;
    coursePrice: number;
  }) {
    const { orderId, courseId, sellerId, buyerId, coursePrice } = params;
    if (coursePrice <= 0) return null;

    const cfg = await this.getFullConfig(sellerId);

    // 1. Calculate gateway fee
    const gatewayFee = Math.round(coursePrice * cfg.gatewayFeeRate + cfg.gatewayFeeFixed);
    const netAmount = Math.max(0, coursePrice - gatewayFee);

    // 2. Commission is calculated on NET revenue
    const commissionAmount = Math.round(netAmount * cfg.commissionRate);
    const sellerAmount = netAmount - commissionAmount;

    // 3. When does this earning become available?
    const availableAt = new Date();
    availableAt.setDate(availableAt.getDate() + cfg.clearanceDays);

    await databaseService.transaction(async (tx) => {
      // Record earning with PENDING status
      await tx.sellerEarning.create({
        data: {
          sellerId,
          courseId,
          orderId,
          buyerId,
          totalAmount: coursePrice,
          gatewayFee,
          netAmount,
          commissionRate: cfg.commissionRate,
          commissionAmount,
          sellerAmount,
          status: "PENDING" as EarningStatus,
          availableAt,
        },
      });

      // Seller: deposit into PENDING balance (not available yet)
      if (sellerAmount > 0) {
        const sellerWallet = await this.walletRepo.getOrCreate(sellerId);
        await tx.wallet.update({
          where: { id: sellerWallet.id },
          data: { pendingBalance: { increment: sellerAmount } },
        });
        await tx.transaction.create({
          data: {
            walletId: sellerWallet.id,
            amount: sellerAmount,
            transactionType: "SELLER_EARNING" as TransactionType,
            status: "PENDING" as TransactionStatus,
            description: `Course sale revenue (pending until ${availableAt.toLocaleDateString("vi-VN")})`,
            orderId,
          },
        });
      }

      // Admin: deposit commission into allowance (available immediately)
      if (commissionAmount > 0) {
        const adminWallet = await this.walletRepo.getOrCreate(SYSTEM_WALLET_USER_ID);
        await tx.wallet.update({
          where: { id: adminWallet.id },
          data: { allowance: { increment: commissionAmount } },
        });
        await tx.transaction.create({
          data: {
            walletId: adminWallet.id,
            amount: commissionAmount,
            transactionType: "COMMISSION" as TransactionType,
            status: "SUCCESS" as TransactionStatus,
            description: `Commission ${Math.round(cfg.commissionRate * 100)}% of net ${netAmount} (gross ${coursePrice}, fee ${gatewayFee})`,
          },
        });
      }
    });

    return { gatewayFee, netAmount, commissionRate: cfg.commissionRate, commissionAmount, sellerAmount };
  }

  // ── Release matured earnings ────────────────────────────────────────────

  async releaseMaturedEarnings() {
    const now = new Date();

    // Find all PENDING earnings whose availableAt has passed
    const matured = await this.prisma.sellerEarning.findMany({
      where: {
        status: "PENDING",
        availableAt: { lte: now },
      },
    });

    if (matured.length === 0) return { released: 0, totalAmount: 0 };

    // Group by sellerId
    const sellerAmounts = new Map<string, number>();
    for (const e of matured) {
      const prev = sellerAmounts.get(e.sellerId) ?? 0;
      sellerAmounts.set(e.sellerId, prev + Number(e.sellerAmount));
    }

    await databaseService.transaction(async (tx) => {
      // Mark earnings as RELEASED
      await tx.sellerEarning.updateMany({
        where: {
          id: { in: matured.map((e) => e.id) },
        },
        data: {
          status: "RELEASED" as EarningStatus,
          releasedAt: now,
        },
      });

      // For each seller, move from pendingBalance → allowance
      for (const [sellerId, amount] of sellerAmounts) {
        const wallet = await this.walletRepo.getOrCreate(sellerId);
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            pendingBalance: { decrement: amount },
            allowance: { increment: amount },
          },
        });

        // Create a transaction record for the release
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            amount,
            transactionType: "SELLER_EARNING" as TransactionType,
            status: "SUCCESS" as TransactionStatus,
            description: `Earnings released (${matured.filter((e) => e.sellerId === sellerId).length} sales cleared)`,
          },
        });
      }
    });

    const totalAmount = Array.from(sellerAmounts.values()).reduce((a, b) => a + b, 0);
    return { released: matured.length, totalAmount, sellers: sellerAmounts.size };
  }

  // ── Refund a course (called when admin sets course REFUSE / INACTIVE) ──
  //
  // For every SellerEarning attached to the course:
  //   - reverse the seller's wallet (pendingBalance if PENDING, allowance otherwise)
  //   - reverse the system wallet's commission income
  //   - refund the buyer's allowance by the full price they paid
  //   - mark the earning REFUNDED so it won't be processed again
  //
  // Earnings already in REFUNDED state are skipped (idempotent).

  async refundCourseEarnings(courseId: string, reason?: string) {
    const earnings = await this.prisma.sellerEarning.findMany({
      where: { courseId, status: { not: "REFUNDED" as EarningStatus } },
    });

    if (earnings.length === 0) {
      return { refunded: 0, totalRefunded: 0, buyers: 0 };
    }

    const buyerSet = new Set<string>();
    let totalRefunded = 0;

    await databaseService.transaction(async (tx) => {
      for (const e of earnings) {
        const sellerAmount = Number(e.sellerAmount);
        const commissionAmount = Number(e.commissionAmount);
        const buyerRefund = Number(e.totalAmount);

        // 1. Reverse seller wallet (bucket depends on earning status).
        const sellerWallet = await this.walletRepo.getOrCreate(e.sellerId);
        if (e.status === "PENDING") {
          await tx.wallet.update({
            where: { id: sellerWallet.id },
            data: { pendingBalance: { decrement: sellerAmount } },
          });
        } else {
          // AVAILABLE / RELEASED — already in allowance (or partially withdrawn).
          // Can drive allowance negative if seller already withdrew; finance
          // team handles recovery via withdrawal reconciliation.
          await tx.wallet.update({
            where: { id: sellerWallet.id },
            data: { allowance: { decrement: sellerAmount } },
          });
        }
        await tx.transaction.create({
          data: {
            walletId: sellerWallet.id,
            amount: -sellerAmount,
            transactionType: "SELLER_EARNING" as TransactionType,
            status: "FAILED" as TransactionStatus,
            description: `Earning reversed (course refunded${reason ? `: ${reason}` : ""})`,
            orderId: e.orderId,
          },
        });

        // 2. Reverse system commission.
        if (commissionAmount > 0) {
          const adminWallet = await this.walletRepo.getOrCreate(SYSTEM_WALLET_USER_ID);
          await tx.wallet.update({
            where: { id: adminWallet.id },
            data: { allowance: { decrement: commissionAmount } },
          });
          await tx.transaction.create({
            data: {
              walletId: adminWallet.id,
              amount: -commissionAmount,
              transactionType: "COMMISSION" as TransactionType,
              status: "FAILED" as TransactionStatus,
              description: `Commission reversed (course refunded${reason ? `: ${reason}` : ""})`,
            },
          });
        }

        // 3. Credit buyer's wallet with the full purchase amount.
        const buyerWallet = await this.walletRepo.getOrCreate(e.buyerId);
        await tx.wallet.update({
          where: { id: buyerWallet.id },
          data: { allowance: { increment: buyerRefund } },
        });
        await tx.transaction.create({
          data: {
            walletId: buyerWallet.id,
            amount: buyerRefund,
            transactionType: "DEPOSIT" as TransactionType,
            status: "SUCCESS" as TransactionStatus,
            description: `Refund for course (${reason ?? "removed from marketplace"})`,
            orderId: e.orderId,
          },
        });

        // 4. Mark earning as REFUNDED.
        await tx.sellerEarning.update({
          where: { id: e.id },
          data: { status: "REFUNDED" as EarningStatus, releasedAt: e.releasedAt ?? new Date() },
        });

        buyerSet.add(e.buyerId);
        totalRefunded += buyerRefund;
      }
    });

    return { refunded: earnings.length, totalRefunded, buyers: buyerSet.size };
  }

  // ── Seller: view earnings ───────────────────────────────────────────────

  async getSellerEarnings(sellerId: string, page: number = 1, limit: number = 10) {
    const [earnings, total] = await Promise.all([
      this.prisma.sellerEarning.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sellerEarning.count({ where: { sellerId } }),
    ]);

    const totals = await this.prisma.sellerEarning.aggregate({
      where: { sellerId },
      _sum: { sellerAmount: true, totalAmount: true, commissionAmount: true, gatewayFee: true, netAmount: true },
    });

    const pendingTotal = await this.prisma.sellerEarning.aggregate({
      where: { sellerId, status: "PENDING" },
      _sum: { sellerAmount: true },
    });

    return {
      data: earnings.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        orderId: e.orderId,
        buyerId: e.buyerId,
        totalAmount: Number(e.totalAmount),
        gatewayFee: Number(e.gatewayFee),
        netAmount: Number(e.netAmount),
        commissionRate: Number(e.commissionRate),
        commissionAmount: Number(e.commissionAmount),
        sellerAmount: Number(e.sellerAmount),
        status: e.status,
        availableAt: e.availableAt,
        releasedAt: e.releasedAt,
        createdAt: e.createdAt,
      })),
      summary: {
        totalRevenue: Number(totals._sum.totalAmount || 0),
        totalGatewayFee: Number(totals._sum.gatewayFee || 0),
        totalNetRevenue: Number(totals._sum.netAmount || 0),
        totalEarnings: Number(totals._sum.sellerAmount || 0),
        totalCommission: Number(totals._sum.commissionAmount || 0),
        totalPending: Number(pendingTotal._sum.sellerAmount || 0),
      },
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── Admin: commission report ────────────────────────────────────────────

  async getAdminCommissionReport(page: number = 1, limit: number = 10) {
    const [earnings, total] = await Promise.all([
      this.prisma.sellerEarning.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sellerEarning.count(),
    ]);

    const stats = await this.prisma.sellerEarning.aggregate({
      _sum: { totalAmount: true, commissionAmount: true, sellerAmount: true, gatewayFee: true, netAmount: true },
      _count: true,
    });

    return {
      data: earnings.map((e) => ({
        id: e.id,
        sellerId: e.sellerId,
        courseId: e.courseId,
        orderId: e.orderId,
        buyerId: e.buyerId,
        totalAmount: Number(e.totalAmount),
        gatewayFee: Number(e.gatewayFee),
        netAmount: Number(e.netAmount),
        commissionRate: Number(e.commissionRate),
        commissionAmount: Number(e.commissionAmount),
        sellerAmount: Number(e.sellerAmount),
        status: e.status,
        availableAt: e.availableAt,
        releasedAt: e.releasedAt,
        createdAt: e.createdAt,
      })),
      summary: {
        totalSales: Number(stats._sum.totalAmount || 0),
        totalGatewayFee: Number(stats._sum.gatewayFee || 0),
        totalNetRevenue: Number(stats._sum.netAmount || 0),
        totalCommission: Number(stats._sum.commissionAmount || 0),
        totalSellerPayouts: Number(stats._sum.sellerAmount || 0),
        transactionCount: stats._count,
      },
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── Admin: config management ────────────────────────────────────────────

  async getConfig() {
    const configs = await this.prisma.commissionConfig.findMany({
      orderBy: { updatedAt: "desc" },
    });
    const global = configs.find((c) => c.sellerId === null);

    return {
      globalRate: global ? Number(global.commissionRate) : DEFAULT_COMMISSION_RATE,
      gatewayFeeRate: global ? Number(global.gatewayFeeRate) : DEFAULT_GATEWAY_FEE_RATE,
      gatewayFeeFixed: global ? Number(global.gatewayFeeFixed) : DEFAULT_GATEWAY_FEE_FIXED,
      clearanceDays: global?.clearanceDays ?? DEFAULT_CLEARANCE_DAYS,
      configs: configs.map((c) => ({
        id: c.id,
        sellerId: c.sellerId,
        commissionRate: Number(c.commissionRate),
        gatewayFeeRate: Number(c.gatewayFeeRate),
        gatewayFeeFixed: Number(c.gatewayFeeFixed),
        clearanceDays: c.clearanceDays,
        updatedAt: c.updatedAt,
      })),
    };
  }

  async updateGlobalRate(rate: number) {
    if (rate < 0 || rate > 1) throw new Error("Rate must be between 0 and 1");
    return this.updateGlobalConfig({ commissionRate: rate });
  }

  async updateGlobalConfig(data: {
    commissionRate?: number;
    gatewayFeeRate?: number;
    gatewayFeeFixed?: number;
    clearanceDays?: number;
  }) {
    const existing = await this.prisma.commissionConfig.findFirst({
      where: { sellerId: null },
    });

    const updateData: Record<string, unknown> = {};
    if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate;
    if (data.gatewayFeeRate !== undefined) updateData.gatewayFeeRate = data.gatewayFeeRate;
    if (data.gatewayFeeFixed !== undefined) updateData.gatewayFeeFixed = data.gatewayFeeFixed;
    if (data.clearanceDays !== undefined) updateData.clearanceDays = data.clearanceDays;

    if (existing) {
      return this.prisma.commissionConfig.update({
        where: { id: existing.id },
        data: updateData,
      });
    }

    return this.prisma.commissionConfig.create({
      data: {
        commissionRate: data.commissionRate ?? DEFAULT_COMMISSION_RATE,
        gatewayFeeRate: data.gatewayFeeRate ?? DEFAULT_GATEWAY_FEE_RATE,
        gatewayFeeFixed: data.gatewayFeeFixed ?? DEFAULT_GATEWAY_FEE_FIXED,
        clearanceDays: data.clearanceDays ?? DEFAULT_CLEARANCE_DAYS,
      },
    });
  }
}
