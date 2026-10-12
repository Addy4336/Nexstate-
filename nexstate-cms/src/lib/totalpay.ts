import { brand } from "@nexstate/brand";
import { randomBytes, timingSafeEqual } from "crypto";
/**
 * TotalPay Checkout Integration
 * 
 * Documentation: https://docs.totalpay.global/docs/guides/checkout_integration
 * 
 * This implements TotalPay's Checkout protocol which uses a hosted payment page.
 * 
 * Flow:
 * 1. Create session → Get redirect_url
 * 2. Redirect customer to TotalPay's hosted checkout page
 * 3. Customer enters payment details and completes payment
 * 4. TotalPay sends callback to our notification URL
 * 5. Customer is redirected to success_url or cancel_url
 */

import crypto from 'crypto';

// TotalPay Checkout API Configuration
const CHECKOUT_URL = process.env.TOTALPAY_CHECKOUT_URL || 'https://checkout.totalpay.global';
const MERCHANT_KEY = process.env.TOTALPAY_MERCHANT_KEY || '';
const PASSWORD = process.env.TOTALPAY_PASSWORD || '';
const TEST_MODE = process.env.TOTALPAY_TEST_MODE === 'true';

// Request timeout
const REQUEST_TIMEOUT = 30000;

// TypeScript interfaces
export interface CheckoutSessionParams {
  amount: number;
  currency?: string;
  description: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  successUrl: string;
  cancelUrl: string;
  notificationUrl: string;
}

export interface CheckoutSessionResponse {
  redirect_url: string;
  payment_id?: string;
}

export interface CheckoutCallbackData {
  id: string; // payment_id
  order_number: string;
  order_amount: string;
  order_currency: string;
  order_description: string;
  order_status: string; // prepare, settled, pending, 3ds, redirect, decline, refund, reversal, chargeback
  type: string; // sale, 3ds, redirect, capture, refund, void, chargeback, debit, transfer
  status: string; // success, fail, waiting, undefined
  reason?: string;
  customer_name?: string;
  customer_email?: string;
  customer_country?: string;
  customer_city?: string;
  customer_address?: string;
  customer_ip: string;
  card?: string; // masked card number
  card_token?: string;
  date?: string;
  hash: string;
  [key: string]: any;
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex"); // unguessable: order number gates the public status lookup
  return `${brand.orderPrefix}-${timestamp}-${random}`;
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
}

/**
 * Calculate hash for checkout authentication request
 * Formula: sha1(md5(uppercase(order.number + order.amount + order.currency + order.description + password)))
 */
export function calculateCheckoutHash(
  orderNumber: string,
  amount: string,
  currency: string,
  description: string
): string {
  const concatenated = orderNumber + amount + currency + description + PASSWORD;
  const md5Hash = crypto.createHash('md5').update(concatenated.toUpperCase()).digest('hex');
  const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');
  return sha1Hash;
}

/**
 * Calculate hash for callback validation
 * Formula: sha1(md5(uppercase(payment_id + order.number + order.amount + order.currency + order.description + password)))
 */
export function calculateCallbackHash(
  paymentId: string,
  orderNumber: string,
  amount: string,
  currency: string,
  description: string
): string {
  const concatenated = paymentId + orderNumber + amount + currency + description + PASSWORD;
  const md5Hash = crypto.createHash('md5').update(concatenated.toUpperCase()).digest('hex');
  const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');
  return sha1Hash;
}

/**
 * Verify callback signature from TotalPay
 */
export function verifyCallbackSignature(callbackData: CheckoutCallbackData): boolean {
  if (!callbackData?.hash || typeof callbackData.hash !== "string") return false;
  if (!MERCHANT_KEY || !PASSWORD) return false; // fail closed when not configured

  const expectedHash = calculateCallbackHash(
    callbackData.id,
    callbackData.order_number,
    callbackData.order_amount,
    callbackData.order_currency,
    callbackData.order_description
  );

  const a = Buffer.from(expectedHash);
  const b = Buffer.from(callbackData.hash);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Create TotalPay checkout session
 * Returns redirect URL where customer should be sent to complete payment
 */
export async function createTotalPaySession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResponse> {
  try {
    console.log('🔵 Creating TotalPay Checkout session:', {
      orderNumber: params.orderNumber,
      amount: params.amount,
      currency: params.currency || 'AED',
      testMode: TEST_MODE
    });

    if (!validatePaymentAmount(params.amount)) {
      throw new Error('Invalid payment amount');
    }

    // Validate configuration
    if (!MERCHANT_KEY || !PASSWORD) {
      throw new Error('TotalPay not configured. Set TOTALPAY_MERCHANT_KEY and TOTALPAY_PASSWORD');
    }

    // Format amount: XX.XX for 2-exponent currencies like AED, USD
    const formattedAmount = params.amount.toFixed(2);
    const currency = params.currency || 'AED';

    // Calculate hash
    const hash = calculateCheckoutHash(
      params.orderNumber,
      formattedAmount,
      currency,
      params.description
    );

    // Build request payload (JSON)
    const payload = {
      merchant_key: MERCHANT_KEY,
      operation: 'purchase' as const,
      methods: [] as string[], // Empty = all available methods
      order: {
        number: params.orderNumber,
        amount: formattedAmount,
        currency: currency,
        description: params.description,
      },
      customer: {
        name: params.customerName,
        email: params.customerEmail,
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      hash: hash,
    };

    console.log('📤 Sending checkout session request:', {
      url: `${CHECKOUT_URL}/api/v1/session`,
      orderNumber: params.orderNumber,
      amount: formattedAmount,
      currency,
      hash: hash.substring(0, 20) + '...',
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${CHECKOUT_URL}/api/v1/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseText = await response.text();
    console.log('📊 TotalPay response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error_message || errorData.message || errorMessage;
        console.error('❌ TotalPay API Error:', errorData);
      } catch (e) {
        console.error('❌ TotalPay response (not JSON):', responseText);
      }
      throw new Error(`TotalPay API request failed: ${errorMessage}`);
    }

    const data = JSON.parse(responseText);
    console.log('✅ TotalPay checkout session created:', {
      redirect_url: data.redirect_url?.substring(0, 50) + '...',
      payment_id: data.payment_id,
    });

    return {
      redirect_url: data.redirect_url,
      payment_id: data.payment_id,
    };
  } catch (error: any) {
    console.error('❌ TotalPay checkout session failed:', error);
    throw new Error(error.message || 'Failed to create checkout session');
  }
}

/**
 * Map TotalPay order status to our payment status
 * 
 * TotalPay order_status values:
 * - prepare: Initial state
 * - settled: Payment completed successfully
 * - pending: Payment is being processed
 * - 3ds: 3D Secure authentication required
 * - redirect: Redirect required
 * - decline: Payment declined
 * - refund: Payment refunded
 * - reversal: Payment reversed
 * - chargeback: Chargeback initiated
 */
export function mapOrderStatusToPaymentStatus(orderStatus: string): 'success' | 'failed' | 'pending' {
  switch (orderStatus.toLowerCase()) {
    case 'settled':
      return 'success';
    case 'decline':
    case 'refund':
    case 'reversal':
    case 'chargeback':
      return 'failed';
    case 'prepare':
    case 'pending':
    case '3ds':
    case 'redirect':
      return 'pending';
    default:
      console.warn('⚠️ Unknown TotalPay order_status:', orderStatus);
      return 'pending';
  }
}

/**
 * Get payment status from TotalPay
 * Endpoint: /api/v1/payment/status
 */
export async function getPaymentStatus(paymentId: string) {
  const hash = crypto
    .createHash('sha1')
    .update(
      crypto
        .createHash('md5')
        .update((paymentId + PASSWORD).toUpperCase())
        .digest('hex')
    )
    .digest('hex');

  const response = await fetch(`${CHECKOUT_URL}/api/v1/payment/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_key: MERCHANT_KEY,
      payment_id: paymentId,
      hash: hash,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get payment status: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Parse webhook/callback payload
 */
export function parseWebhookPayload(body: any): CheckoutCallbackData | null {
  try {
    if (!body.order_number || !body.id || !body.order_status) {
      console.error('Missing required callback fields');
      return null;
    }

    return {
      id: body.id,
      order_number: body.order_number,
      order_amount: body.order_amount,
      order_currency: body.order_currency,
      order_description: body.order_description,
      order_status: body.order_status,
      type: body.type,
      status: body.status,
      reason: body.reason,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_country: body.customer_country,
      customer_city: body.customer_city,
      customer_address: body.customer_address,
      customer_ip: body.customer_ip,
      card: body.card,
      card_token: body.card_token,
      date: body.date,
      hash: body.hash,
      ...body
    };
  } catch (error) {
    console.error('Failed to parse callback:', error);
    return null;
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get payment status display info
 */
export function getPaymentStatusInfo(status: string) {
  const statusMap: Record<string, { label: string; color: string; description: string }> = {
    pending: { label: 'Pending', color: 'yellow', description: 'Payment processing' },
    settled: { label: 'Success', color: 'green', description: 'Payment completed' },
    success: { label: 'Success', color: 'green', description: 'Payment completed' },
    declined: { label: 'Declined', color: 'red', description: 'Payment declined' },
    failed: { label: 'Failed', color: 'red', description: 'Payment failed' },
    cancelled: { label: 'Cancelled', color: 'orange', description: 'Payment cancelled' },
  };

  return statusMap[status?.toLowerCase()] || {
    label: status,
    color: 'gray',
    description: 'Unknown status',
  };
}
