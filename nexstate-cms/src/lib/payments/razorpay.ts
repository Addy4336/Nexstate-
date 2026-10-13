import { createHmac, timingSafeEqual } from "crypto";
import { brand } from "@nexstate/brand";
import {
    PaymentConfigError,
    PaymentProviderError,
    type CheckoutParams,
    type PaymentProvider,
    type ProviderCheckout,
    type VerifiedClientPayment,
    type WebhookEvent,
} from "./types";

/**
 * Razorpay (Orders API + Standard Checkout).
 *
 * Env:
 *   RAZORPAY_KEY_ID           public key id (rzp_test_... / rzp_live_...)
 *   RAZORPAY_KEY_SECRET       server-only
 *   RAZORPAY_WEBHOOK_SECRET   the secret you set when creating the webhook in the dashboard
 *   RAZORPAY_API_BASE         optional override (tests); defaults to https://api.razorpay.com/v1
 */

function config() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new PaymentConfigError("Razorpay is not configured");
    return { keyId, keySecret, base: process.env.RAZORPAY_API_BASE || "https://api.razorpay.com/v1" };
}

function hmacHex(secret: string, payload: string): string {
    return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Constant-time comparison of two hex strings. */
function safeEqualHex(a: string, b: string): boolean {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export const razorpayProvider: PaymentProvider = {
    id: "razorpay",

    isConfigured(): boolean {
        return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    },

    async createCheckout(p: CheckoutParams): Promise<ProviderCheckout> {
        const { keyId, keySecret, base } = config();

        const res = await fetch(`${base}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
            },
            body: JSON.stringify({
                amount: p.amountMinor,
                currency: p.currency,
                receipt: p.orderNumber,
                notes: { order_number: p.orderNumber },
            }),
            signal: AbortSignal.timeout(15_000),
        });

        const order = (await res.json().catch(() => null)) as any;
        if (!res.ok || !order?.id) {
            const reason = order?.error?.description || `HTTP ${res.status}`;
            throw new PaymentProviderError(`Razorpay order creation failed: ${reason}`);
        }

        return {
            provider: "razorpay",
            providerOrderId: order.id,
            raw: order,
            clientPayload: {
                key: keyId,
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                name: brand.name,
                description: p.description,
                prefill: {
                    name: p.customer.name,
                    email: p.customer.email,
                    contact: p.customer.phone || undefined,
                },
                notes: { order_number: p.orderNumber },
                theme: { color: brand.themeColor },
            },
        };
    },

    verifyClientPayment(data): VerifiedClientPayment | null {
        const { keySecret } = config();
        const orderId = data.razorpay_order_id;
        const paymentId = data.razorpay_payment_id;
        const signature = data.razorpay_signature;
        if (!orderId || !paymentId || !signature) return null;

        const expected = hmacHex(keySecret, `${orderId}|${paymentId}`);
        if (!safeEqualHex(expected, signature)) return null;
        return { providerOrderId: orderId, providerPaymentId: paymentId };
    },

    parseWebhook(rawBody: string, signature: string | null): WebhookEvent | null {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret || !signature) return null;
        if (!safeEqualHex(hmacHex(secret, rawBody), signature)) return null;

        let body: any;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return null;
        }

        const payment = body?.payload?.payment?.entity;
        const order = body?.payload?.order?.entity;

        switch (body?.event) {
            case "payment.captured":
            case "order.paid": {
                const providerOrderId = payment?.order_id || order?.id;
                const providerPaymentId = payment?.id;
                const amountMinor = Number(payment?.amount ?? order?.amount_paid);
                const currency = payment?.currency || order?.currency;
                if (!providerOrderId || !providerPaymentId || !Number.isFinite(amountMinor) || !currency) return null;
                return { kind: "paid", providerOrderId, providerPaymentId, amountMinor, currency, raw: body };
            }
            case "payment.failed": {
                const providerOrderId = payment?.order_id;
                if (!providerOrderId) return null;
                return {
                    kind: "failed",
                    providerOrderId,
                    providerPaymentId: payment?.id,
                    reason: payment?.error_description || payment?.error_reason,
                    raw: body,
                };
            }
            default:
                return { kind: "ignored", raw: body };
        }
    },
};
