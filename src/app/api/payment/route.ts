import { type NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_MESSAGES } from '@/lib/constants/error-messages';
import { COIN_PACKAGES, VIP_PLANS } from '@/types';

// Payment types
interface PaymentRecord {
  id: string;
  userId: string;
  type: 'coin' | 'vip';
  productId: string;
  productName: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Mock payment history
const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    userId: 'user-1',
    type: 'coin',
    productId: 'standard',
    productName: '스탠다드 코인 패키지',
    amount: 10000,
    paymentMethod: 'card',
    status: 'completed',
    transactionId: 'TXN-123456',
    createdAt: new Date('2024-12-10'),
    completedAt: new Date('2024-12-10'),
  },
  {
    id: 'pay-2',
    userId: 'user-1',
    type: 'vip',
    productId: 'vip-monthly',
    productName: 'VIP 월정액',
    amount: 5900,
    paymentMethod: 'card',
    status: 'completed',
    transactionId: 'TXN-123457',
    createdAt: new Date('2024-12-01'),
    completedAt: new Date('2024-12-01'),
  },
  {
    id: 'pay-3',
    userId: 'user-1',
    type: 'coin',
    productId: 'basic',
    productName: '베이직 코인 패키지',
    amount: 5000,
    paymentMethod: 'kakao',
    status: 'completed',
    transactionId: 'TXN-123458',
    createdAt: new Date('2024-11-25'),
    completedAt: new Date('2024-11-25'),
  },
];

// Supported payment methods
const PAYMENT_METHODS = [
  { id: 'card', name: '신용/체크카드', icon: '💳' },
  { id: 'kakao', name: '카카오페이', icon: '🟡' },
  { id: 'naver', name: '네이버페이', icon: '🟢' },
  { id: 'toss', name: '토스페이', icon: '🔵' },
  { id: 'phone', name: '휴대폰 결제', icon: '📱' },
  { id: 'bank', name: '계좌이체', icon: '🏦' },
];

// Validation schemas
const initPaymentSchema = z.object({
  userId: z.string().min(1),
  productType: z.enum(['coin', 'vip']),
  productId: z.string().min(1),
  paymentMethod: z.string().min(1),
});

const verifyPaymentSchema = z.object({
  paymentId: z.string().min(1),
  transactionId: z.string().min(1),
});

const refundSchema = z.object({
  userId: z.string().min(1),
  paymentId: z.string().min(1),
  reason: z.string().min(10).max(500),
});

// GET /api/payment - Get payment data
async function handleGetPaymentData(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type'); // products, history, methods

  if (type === 'products') {
    return apiSuccess({
      coinPackages: COIN_PACKAGES,
      vipPlans: VIP_PLANS,
    });
  }

  if (type === 'methods') {
    return apiSuccess({ methods: PAYMENT_METHODS });
  }

  if (!userId) {
    return apiError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  // Return payment history
  const payments = mockPayments.filter((p) => p.userId === userId);
  const summary = {
    totalSpent: payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    coinPurchases: payments.filter((p) => p.type === 'coin' && p.status === 'completed').length,
    vipPurchases: payments.filter((p) => p.type === 'vip' && p.status === 'completed').length,
  };

  return apiSuccess({ payments, summary });
}

// POST /api/payment/init - Initialize payment
async function handleInitPayment(request: NextRequest) {
  const body = await request.json();
  const result = initPaymentSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { userId, productType, productId, paymentMethod } = result.data;

  let product;
  let amount;

  if (productType === 'coin') {
    product = COIN_PACKAGES.find((p) => p.id === productId);
    if (!product) {
      return apiError('상품을 찾을 수 없습니다.', 404);
    }
    amount = product.price;
  } else {
    product = VIP_PLANS.find((p) => p.id === productId);
    if (!product) {
      return apiError('상품을 찾을 수 없습니다.', 404);
    }
    amount = product.price;
  }

  // Create pending payment record
  const payment: PaymentRecord = {
    id: `pay-${Date.now()}`,
    userId,
    type: productType,
    productId,
    productName: product.name,
    amount,
    paymentMethod,
    status: 'pending',
    createdAt: new Date(),
  };

  mockPayments.push(payment);

  // In real implementation, this would return payment gateway URL or data
  return apiSuccess({
    paymentId: payment.id,
    amount,
    productName: product.name,
    paymentMethod,
    // Mock payment gateway data
    gatewayData: {
      merchantId: 'STORYVERSE',
      orderId: payment.id,
      orderName: product.name,
      amount,
      successUrl: `/payment/success?paymentId=${payment.id}`,
      failUrl: `/payment/fail?paymentId=${payment.id}`,
    },
  });
}

// POST /api/payment/verify - Verify and complete payment
async function handleVerifyPayment(request: NextRequest) {
  const body = await request.json();
  const result = verifyPaymentSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { paymentId, transactionId } = result.data;

  const payment = mockPayments.find((p) => p.id === paymentId);
  if (!payment) {
    return apiError('결제 정보를 찾을 수 없습니다.', 404);
  }

  if (payment.status !== 'pending') {
    return apiError('이미 처리된 결제입니다.', 400);
  }

  // In real implementation, verify with payment gateway
  payment.status = 'completed';
  payment.transactionId = transactionId;
  payment.completedAt = new Date();

  // Calculate rewards
  let rewards;
  if (payment.type === 'coin') {
    const pkg = COIN_PACKAGES.find((p) => p.id === payment.productId);
    rewards = {
      coins: (pkg?.coins || 0) + (pkg?.bonus || 0),
      type: 'coin',
    };
  } else {
    const plan = VIP_PLANS.find((p) => p.id === payment.productId);
    rewards = {
      tier: plan?.tier,
      period: plan?.period,
      bonusCoins: plan?.bonusCoins || 0,
      type: 'vip',
    };
  }

  return apiSuccess({
    message: '결제가 완료되었습니다!',
    payment: {
      id: payment.id,
      status: payment.status,
      transactionId,
      completedAt: payment.completedAt,
    },
    rewards,
  });
}

// POST /api/payment/refund - Request refund
async function handleRefundRequest(request: NextRequest) {
  const body = await request.json();
  const result = refundSchema.safeParse(body);

  if (!result.success) {
    return apiError(
      result.error.issues[0]?.message ?? ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
      400
    );
  }

  const { paymentId, reason } = result.data;

  const payment = mockPayments.find((p) => p.id === paymentId);
  if (!payment) {
    return apiError('결제 정보를 찾을 수 없습니다.', 404);
  }

  if (payment.status !== 'completed') {
    return apiError('환불할 수 없는 결제입니다.', 400);
  }

  // Check if refund is within allowed period (7 days)
  const daysSincePurchase = Math.floor(
    (Date.now() - (payment.completedAt?.getTime() || 0)) / (1000 * 60 * 60 * 24)
  );

  if (daysSincePurchase > 7) {
    return apiError('환불 가능 기간(7일)이 지났습니다.', 400);
  }

  // Create refund request
  const refundRequest = {
    id: `refund-${Date.now()}`,
    paymentId,
    reason,
    amount: payment.amount,
    status: 'processing',
    requestedAt: new Date(),
    estimatedCompletionAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  };

  return apiSuccess({
    message: '환불 신청이 접수되었습니다. 영업일 기준 5일 내 처리됩니다.',
    refund: refundRequest,
  });
}

export async function GET(request: NextRequest) {
  try {
    return handleGetPaymentData(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'verify') {
      return handleVerifyPayment(request);
    }

    if (action === 'refund') {
      return handleRefundRequest(request);
    }

    return handleInitPayment(request);
  } catch {
    return apiError(ERROR_MESSAGES.SERVER.INTERNAL_ERROR, 500);
  }
}
