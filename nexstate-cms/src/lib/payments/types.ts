/**
 * Payment provider contract. The checkout/verify/webhook routes only talk to this
 * interface, so supporting another gateway (Stripe, a client's own) means adding
 * one adapter and setting PAYMENT_PROVIDER, with no route changes.
 *
 * All amounts crossing this boundary are in MINOR units (paise for INR).
 */

export interface CheckoutParams {
    /** Our unguessable order number; used as the provider receipt. */
    orderNumber: string;
    amountMinor: number;
    currency: string;
    description: string;
    customer: { name: string; email: string; phone?: string | null };
}

export interface ProviderCheckout {
    provider: string;
    /** Provider's id for the order; stored so callbacks can be matched back to our payment. */
    providerOrderId: string;
    /** Everything the browser needs to open the provider's checkout. Contains no secrets. */
    clientPayload: Record<string, unknown>;
    /** Provider's raw order object (stored for audit). */
    raw: unknown;
}

export interface VerifiedClientPayment {
    providerOrderId: string;
    providerPaymentId: string;
}

export type WebhookEvent =
    | {
          kind: "paid";
          providerOrderId: string;
          providerPaymentId: string;
          amountMinor: number;
          currency: string;
          raw: unknown;
      }
    | { kind: "failed"; providerOrderId: string; providerPaymentId?: string; reason?: string; raw: unknown }
    | { kind: "ignored"; raw?: unknown };

export interface PaymentProvider {
    readonly id: string;
    /** True when all required credentials are present. Checked before any payment row is created. */
    isConfigured(): boolean;
    createCheckout(params: CheckoutParams): Promise<ProviderCheckout>;
    /** Verifies the signed result the browser hands back after checkout. Returns null if the signature is invalid. */
    verifyClientPayment(data: Record<string, string | undefined>): VerifiedClientPayment | null;
    /** Verifies and parses a server-to-server callback. Returns null if the signature is invalid or the body is malformed. */
    parseWebhook(rawBody: string, signature: string | null): WebhookEvent | null;
}

/** Thrown when the provider isn't configured (missing keys). Safe to show a generic message for. */
export class PaymentConfigError extends Error {}

/** Thrown when the provider rejects a request. `message` is already safe to log, not to show users. */
export class PaymentProviderError extends Error {}
