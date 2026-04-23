import { BadRequestError } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { vnpayService } from "../../../services/vnpay.service.js";
import type {
  OrderStatus,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "../../../../generated/prisma/index.js";

const MINIMUM_TOPUP_VND = 10000;

export class TopupService {
  private prisma = databaseService.getClient();

  async createOrder(userId: string, realMoney: number, ipAddr: string) {
    if (!Number.isFinite(realMoney) || realMoney < MINIMUM_TOPUP_VND) {
      throw new BadRequestError(
        `Số tiền nạp tối thiểu là ${MINIMUM_TOPUP_VND.toLocaleString("vi-VN")} VND.`
      );
    }

    const normalizedAmount = Math.round(realMoney);
    const txnRef = `${Date.now()}_${userId.slice(0, 8)}`;

    const topupOrder = await this.prisma.topupOrder.create({
      data: {
        userId,
        realMoney: normalizedAmount,
        paymentMethod: "VNPAY" as PaymentMethod,
        status: "PENDING" as OrderStatus,
        vnpayTxnRef: txnRef,
      },
    });

    const paymentUrl = vnpayService.createPaymentUrl({
      amount: normalizedAmount,
      orderInfo: `Nap tien vi - ${txnRef}`,
      txnRef,
      ipAddr,
    });

    return {
      orderId: topupOrder.id,
      paymentUrl,
      txnRef,
      amount: normalizedAmount,
      currency: "VND",
      minimumAmount: MINIMUM_TOPUP_VND,
    };
  }

  async handleIpn(params: Record<string, string>) {
    const isValid = vnpayService.verifySignature(params);

    if (!isValid) {
      return { RspCode: "97", Message: "Invalid Checksum" };
    }

    const txnRef = params["vnp_TxnRef"];
    const responseCode = params["vnp_ResponseCode"];
    const transactionNo = params["vnp_TransactionNo"];
    const amount = Math.round(Number(params["vnp_Amount"]) / 100);
    const bankCode = params["vnp_BankCode"];

    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { vnpayTxnRef: txnRef },
    });

    if (!topupOrder) {
      return { RspCode: "01", Message: "Order not found" };
    }

    if (topupOrder.status !== "PENDING") {
      return { RspCode: "02", Message: "Order already confirmed" };
    }

    if (Number(topupOrder.realMoney) !== amount) {
      return { RspCode: "04", Message: "Invalid amount" };
    }

    if (responseCode === "00") {
      await this.processSuccessfulPayment(topupOrder, amount, transactionNo, bankCode);
    } else {
      await this.prisma.topupOrder.update({
        where: { id: topupOrder.id },
        data: { status: "FAILED" as OrderStatus },
      });
    }

    return { RspCode: "00", Message: "Confirm Success" };
  }

  async verifyReturn(params: Record<string, string>) {
    const isValid = vnpayService.verifySignature(params);
    const txnRef = params["vnp_TxnRef"];
    const responseCode = params["vnp_ResponseCode"];
    const transactionNo = params["vnp_TransactionNo"];
    const amount = Math.round(Number(params["vnp_Amount"]) / 100);
    const bankCode = params["vnp_BankCode"];

    if (!isValid) {
      return { success: false, message: "Chữ ký không hợp lệ", txnRef };
    }

    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { vnpayTxnRef: txnRef },
    });

    if (!topupOrder) {
      return { success: false, message: "Không tìm thấy đơn nạp tiền", txnRef };
    }

    if (responseCode === "00") {
      // Credit wallet via return URL too — idempotent, safe even if IPN already ran
      await this.processSuccessfulPayment(topupOrder, amount, transactionNo, bankCode);
    } else if (topupOrder.status === "PENDING") {
      await this.prisma.topupOrder.update({
        where: { id: topupOrder.id },
        data: { status: "FAILED" as OrderStatus },
      });
    }

    return {
      success: responseCode === "00",
      orderId: topupOrder.id,
      status: topupOrder.status,
      amount: Number(topupOrder.realMoney),
      message: responseCode === "00" ? "Thanh toán thành công" : "Thanh toán thất bại",
      txnRef,
    };
  }

  private async processSuccessfulPayment(
    topupOrder: { id: string; userId: string; realMoney: unknown },
    amount: number,
    transactionNo: string | undefined,
    bankCode: string | undefined
  ) {
    const userId = topupOrder.userId;

    await databaseService.transaction(async (tx) => {
      const updateResult = await tx.topupOrder.updateMany({
        where: { id: topupOrder.id, status: "PENDING" as OrderStatus },
        data: {
          status: "SUCCESS" as OrderStatus,
          realAmount: amount,
          vnpayTransactionNo: transactionNo,
          vnpayBankCode: bankCode,
        },
      });

      if (updateResult.count === 0) {
        console.log("[topup] already processed, skipping", topupOrder.id);
        return;
      }

      let wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await tx.wallet.create({ data: { userId, allowance: 0 } });
      }

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { allowance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount,
          transactionType: "DEPOSIT" as TransactionType,
          status: "SUCCESS" as TransactionStatus,
          description: `Nạp tiền qua VNPay (TxnRef: ${topupOrder.id})`,
          topupOrderId: topupOrder.id,
        },
      });

      console.log("[topup] wallet updated", { userId, amount });
    });
  }

  async getOrderStatus(orderId: string, userId: string) {
    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { id: orderId },
    });

    if (!topupOrder) {
      throw new Error("Topup order not found");
    }

    if (topupOrder.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return {
      id: topupOrder.id,
      status: topupOrder.status,
      paymentMethod: topupOrder.paymentMethod,
      amount: Number(topupOrder.realMoney),
      txnRef: topupOrder.vnpayTxnRef,
    };
  }
}
