// =============================================================================
// Coupon Service — admin CRUD + learner apply/validate
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type { CouponType, Prisma } from "../../../../generated/prisma/index.js";

interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: CouponType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount?: number;
  maxRedemptions?: number | null;
  maxPerUser?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive?: boolean;
  createdById?: string;
}

interface UpdateCouponInput {
  description?: string | null;
  discountType?: CouponType;
  discountValue?: number;
  maxDiscount?: number | null;
  minOrderAmount?: number;
  maxRedemptions?: number | null;
  maxPerUser?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

interface ListFilters {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "inactive" | "expired" | "all";
}

export interface ValidatedCoupon {
  id: string;
  code: string;
  discountType: CouponType;
  discountValue: number;
  discount: number;
  subtotal: number;
  total: number;
}

export class CouponService {
  private prisma = databaseService.getClient();

  async create(input: CreateCouponInput) {
    if (!input.code?.trim()) throw new Error("Mã giảm giá không được trống");
    const code = input.code.trim().toUpperCase();
    this.validatePayload(input);

    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) throw new Error("Mã đã tồn tại");

    return this.prisma.coupon.create({
      data: {
        code,
        description: input.description?.trim() || null,
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxDiscount: input.maxDiscount ?? null,
        minOrderAmount: input.minOrderAmount ?? 0,
        maxRedemptions: input.maxRedemptions ?? null,
        maxPerUser: input.maxPerUser ?? null,
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        isActive: input.isActive ?? true,
        createdById: input.createdById,
      },
    });
  }

  async update(id: string, input: UpdateCouponInput) {
    const existing = await this.prisma.coupon.findUnique({ where: { id } });
    if (!existing) throw new Error("Mã giảm giá không tồn tại");
    this.validatePayload({
      code: existing.code,
      discountType: input.discountType ?? (existing.discountType as CouponType),
      discountValue: input.discountValue ?? Number(existing.discountValue),
      maxDiscount:
        input.maxDiscount ?? (existing.maxDiscount ? Number(existing.maxDiscount) : null),
      minOrderAmount: input.minOrderAmount ?? Number(existing.minOrderAmount),
      maxRedemptions: input.maxRedemptions ?? existing.maxRedemptions,
      maxPerUser: input.maxPerUser ?? existing.maxPerUser,
      startsAt: input.startsAt ?? existing.startsAt?.toISOString() ?? null,
      expiresAt: input.expiresAt ?? existing.expiresAt?.toISOString() ?? null,
    });

    const data: Prisma.CouponUpdateInput = {};
    if (input.description !== undefined) data.description = input.description?.trim() || null;
    if (input.discountType !== undefined) data.discountType = input.discountType;
    if (input.discountValue !== undefined) data.discountValue = input.discountValue;
    if (input.maxDiscount !== undefined) data.maxDiscount = input.maxDiscount;
    if (input.minOrderAmount !== undefined) data.minOrderAmount = input.minOrderAmount;
    if (input.maxRedemptions !== undefined) data.maxRedemptions = input.maxRedemptions;
    if (input.maxPerUser !== undefined) data.maxPerUser = input.maxPerUser;
    if (input.startsAt !== undefined) {
      data.startsAt = input.startsAt ? new Date(input.startsAt) : null;
    }
    if (input.expiresAt !== undefined) {
      data.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    }
    if (input.isActive !== undefined) data.isActive = input.isActive;

    return this.prisma.coupon.update({ where: { id }, data });
  }

  async list(filters: ListFilters) {
    const where: Prisma.CouponWhereInput = {};
    const andConditions: Prisma.CouponWhereInput[] = [];
    if (filters.search?.trim()) {
      where.OR = [
        { code: { contains: filters.search.trim().toUpperCase() } },
        { description: { contains: filters.search.trim(), mode: "insensitive" } },
      ];
    }
    const now = new Date();
    if (filters.status === "active") {
      andConditions.push({ isActive: true });
      andConditions.push({
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      });
    } else if (filters.status === "inactive") {
      andConditions.push({ isActive: false });
    } else if (filters.status === "expired") {
      andConditions.push({ expiresAt: { lt: now } });
    }
    if (andConditions.length) where.AND = andConditions;

    const [items, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async deactivate(id: string) {
    return this.prisma.coupon.update({ where: { id }, data: { isActive: false } });
  }

  async getById(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        redemptions: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    if (!coupon) throw new Error("Mã giảm giá không tồn tại");
    return coupon;
  }

  /**
   * Read-only validation: throws when the coupon cannot be used. Caller passes
   * the cart subtotal computed from server-trusted prices, not the client.
   */
  async validateForUser(args: {
    code: string;
    userId: string;
    subtotal: number;
  }): Promise<ValidatedCoupon> {
    const code = args.code.trim().toUpperCase();
    if (!code) throw new Error("Vui lòng nhập mã giảm giá");

    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new Error("Mã giảm giá không tồn tại");
    if (!coupon.isActive) throw new Error("Mã giảm giá đã bị vô hiệu hóa");

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new Error("Mã chưa đến thời gian sử dụng");
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new Error("Mã đã hết hạn");
    }
    if (Number(coupon.minOrderAmount) > args.subtotal) {
      throw new Error(
        `Đơn tối thiểu ${Number(coupon.minOrderAmount).toLocaleString("vi-VN")}đ`
      );
    }
    if (coupon.maxRedemptions !== null && coupon.usedCount >= coupon.maxRedemptions) {
      throw new Error("Mã đã hết lượt sử dụng");
    }
    if (coupon.maxPerUser !== null && coupon.maxPerUser > 0) {
      const userUsed = await this.prisma.couponRedemption.count({
        where: { couponId: coupon.id, userId: args.userId },
      });
      if (userUsed >= coupon.maxPerUser) {
        throw new Error("Bạn đã dùng mã này tối đa số lần cho phép");
      }
    }

    const discount = this.computeDiscount(coupon, args.subtotal);
    return {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType as CouponType,
      discountValue: Number(coupon.discountValue),
      discount,
      subtotal: args.subtotal,
      total: Math.max(0, args.subtotal - discount),
    };
  }

  /**
   * Race-safe redemption — updateMany with a `usedCount < maxRedemptions`
   * predicate ensures we never exceed the cap, even under concurrent pays.
   */
  async redeem(args: {
    couponId: string;
    userId: string;
    orderId: string;
    amount: number;
  }) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id: args.couponId } });
    if (!coupon || !coupon.isActive) throw new Error("Mã giảm giá không khả dụng");

    const updateWhere: Prisma.CouponWhereInput = { id: args.couponId, isActive: true };
    if (coupon.maxRedemptions !== null) {
      updateWhere.usedCount = { lt: coupon.maxRedemptions };
    }
    const result = await this.prisma.coupon.updateMany({
      where: updateWhere,
      data: { usedCount: { increment: 1 } },
    });
    if (result.count === 0) {
      throw new Error("Mã đã hết lượt hoặc bị vô hiệu hóa giữa chừng");
    }
    await this.prisma.couponRedemption.create({
      data: {
        couponId: args.couponId,
        userId: args.userId,
        orderId: args.orderId,
        amount: args.amount,
      },
    });
  }

  private computeDiscount(
    coupon: {
      discountType: string;
      discountValue: Prisma.Decimal | number;
      maxDiscount?: Prisma.Decimal | number | null;
    },
    subtotal: number
  ): number {
    const value = Number(coupon.discountValue);
    let discount = 0;
    if (coupon.discountType === "PERCENT") {
      discount = Math.floor((subtotal * value) / 100);
      if (coupon.maxDiscount != null) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      discount = Math.floor(value);
    }
    return Math.min(discount, subtotal);
  }

  private validatePayload(p: {
    code?: string;
    discountType: CouponType;
    discountValue: number;
    maxDiscount?: number | null;
    minOrderAmount?: number;
    maxRedemptions?: number | null;
    maxPerUser?: number | null;
    startsAt?: string | null;
    expiresAt?: string | null;
  }) {
    if (!["PERCENT", "FIXED"].includes(p.discountType)) {
      throw new Error("Loại mã không hợp lệ");
    }
    if (!(p.discountValue > 0)) {
      throw new Error("Giá trị giảm phải lớn hơn 0");
    }
    if (p.discountType === "PERCENT" && p.discountValue > 100) {
      throw new Error("Phần trăm giảm tối đa 100%");
    }
    if (p.minOrderAmount != null && p.minOrderAmount < 0) {
      throw new Error("Giá trị tối thiểu không thể âm");
    }
    if (p.maxRedemptions != null && p.maxRedemptions < 0) {
      throw new Error("Tổng lượt sử dụng không thể âm");
    }
    if (p.maxPerUser != null && p.maxPerUser < 0) {
      throw new Error("Lượt/người không thể âm");
    }
    if (p.startsAt && p.expiresAt && new Date(p.startsAt) > new Date(p.expiresAt)) {
      throw new Error("Ngày bắt đầu phải trước ngày hết hạn");
    }
  }
}
