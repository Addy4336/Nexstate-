import { PaymentConfigError, type PaymentProvider } from "./types";
import { razorpayProvider } from "./razorpay";

export * from "./types";

/** Registered adapters. Add another gateway here and select it with PAYMENT_PROVIDER. */
const providers: Record<string, PaymentProvider> = {
    razorpay: razorpayProvider,
};

export function getPaymentProvider(): PaymentProvider {
    const id = (process.env.PAYMENT_PROVIDER || "razorpay").toLowerCase();
    const provider = providers[id];
    if (!provider) throw new PaymentConfigError(`Unknown PAYMENT_PROVIDER "${id}"`);
    return provider;
}

/** Razorpay's per-transaction ceiling is INR 5,00,000 for most methods; stay within it. */
export const MIN_AMOUNT = 1;
export const MAX_AMOUNT = 500_000;

export function isValidAmount(amount: number): boolean {
    return Number.isFinite(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
}

/** Major units (rupees) to minor units (paise), rounded to avoid float drift. */
export function toMinor(amount: number): number {
    return Math.round(amount * 100);
}

/** Our order number: unguessable, because it gates the public status lookup. */
export function generateOrderNumber(prefix: string): string {
    const random = crypto.getRandomValues(new Uint8Array(8));
    const hex = Array.from(random, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${prefix}-${Date.now()}-${hex}`;
}
