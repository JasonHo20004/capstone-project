import crypto from "crypto";

export interface VNPayCreatePaymentParams {
  amount: number;
  orderInfo: string;
  txnRef: string;
  ipAddr: string;
  locale?: "vn" | "en";
}

export class VNPayService {
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly vnpUrl: string;
  private readonly returnUrl: string;

  constructor() {
    this.tmnCode = process.env.VNPAY_TMN_CODE ?? "";
    this.hashSecret = process.env.VNPAY_HASH_SECRET ?? "";
    this.vnpUrl =
      process.env.VNPAY_URL ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    this.returnUrl =
      process.env.VNPAY_RETURN_URL ?? "http://localhost:3000/api/topup-orders/vnpay-return";

    if (!this.tmnCode || !this.hashSecret) {
      console.warn("[VNPay] VNPAY_TMN_CODE or VNPAY_HASH_SECRET is not set");
    }
  }

  createPaymentUrl(params: VNPayCreatePaymentParams): string {
    const { amount, orderInfo, txnRef, ipAddr, locale = "vn" } = params;

    const vnpParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: String(amount * 100), // VNPay requires amount * 100
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: this.formatDate(new Date()),
    };

    const sortedParams = this.sortObject(vnpParams);
    const signData = new URLSearchParams(sortedParams).toString();
    const secureHash = crypto
      .createHmac("sha512", this.hashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    sortedParams["vnp_SecureHash"] = secureHash;

    return `${this.vnpUrl}?${new URLSearchParams(sortedParams).toString()}`;
  }

  verifySignature(params: Record<string, string>): boolean {
    const secureHash = params["vnp_SecureHash"];
    if (!secureHash) return false;

    const cloned = { ...params };
    delete cloned["vnp_SecureHash"];
    delete cloned["vnp_SecureHashType"];

    const sortedParams = this.sortObject(cloned);
    const signData = new URLSearchParams(sortedParams).toString();
    const signed = crypto
      .createHmac("sha512", this.hashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    return signed.toLowerCase() === secureHash.toLowerCase();
  }

  private sortObject(obj: Record<string, string>): Record<string, string> {
    const sorted: Record<string, string> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    }
    return sorted;
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      String(date.getFullYear()) +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }
}

export const vnpayService = new VNPayService();
