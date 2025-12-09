// src/lib/momo.ts
import crypto from 'crypto';
import axios from 'axios';

// Config mặc định cho Sandbox
const config = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
  secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/wallet',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:3000/wallet', // Dev chấp nhận dùng redirect thay IPN
};

export const createMomoPayment = async (orderId: string, amount: number, orderInfo: string) => {
  const requestId = orderId; // Có thể dùng ID khác nếu muốn
  const requestType = "payWithATM";
  const extraData = ""; // Pass empty string if not used

  // Tạo chữ ký (Signature) theo thuật toán HMAC SHA256
  // Thứ tự tham số cực kỳ quan trọng: accessKey -> amount -> extraData -> ipnUrl -> orderId -> orderInfo -> partnerCode -> redirectUrl -> requestId -> requestType
  const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${config.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac('sha256', config.secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode: config.partnerCode,
    partnerName: "Test Portfolio",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: "vi",
    requestType: requestType,
    autoCapture: true,
    extraData: extraData,
    signature: signature,
  };

  try {
    const response = await axios.post(config.endpoint, requestBody);
    return response.data; // Chứa payUrl
  } catch (error) {
    console.error("Momo Error:", error);
    throw new Error("Không thể tạo thanh toán Momo");
  }
};

export const verifyMomoSignature = (query: any) => {
    const {
        partnerCode, accessKey, requestId, amount, orderId, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature
    } = query;
    
    // Thứ tự tham số để verify signature trả về từ MoMo
    const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${config.partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const generatedSignature = crypto
        .createHmac('sha256', config.secretKey)
        .update(rawSignature)
        .digest('hex');

    return generatedSignature === signature;
}