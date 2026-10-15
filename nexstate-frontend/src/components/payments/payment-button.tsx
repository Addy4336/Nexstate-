"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface PaymentButtonProps {
    propertyId?: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    enquiryId?: string;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    /**
     * Called just before / after the provider window is shown. A surrounding modal dialog must stop
     * being modal meanwhile: modal dialogs set pointer-events:none on <body> and trap focus, which
     * would leave the provider window (appended to <body>) unclickable and untypeable.
     */
    onCheckoutOpen?: () => void;
    onCheckoutClose?: () => void;
}

// Minimal typing for Razorpay Standard Checkout (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => {
            open: () => void;
            on: (event: string, handler: (response: any) => void) => void;
        };
    }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckoutScript(): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (window.Razorpay) return Promise.resolve(true);
    return new Promise((resolve) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
        const script = existing ?? document.createElement("script");
        script.addEventListener("load", () => resolve(true), { once: true });
        script.addEventListener("error", () => resolve(false), { once: true });
        if (!existing) {
            script.src = CHECKOUT_SRC;
            script.async = true;
            document.body.appendChild(script);
        }
    });
}

async function postJson(path: string, body: unknown) {
    const res = await fetch(`${API_BASE}/api${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
}

/**
 * Starts a payment. The server computes the amount from the stored property rate and the
 * chosen dates; the browser only ever supplies who is paying and which dates.
 */
export function PaymentButton({
    propertyId,
    customerEmail,
    customerName,
    customerPhone,
    checkInDate,
    checkOutDate,
    guests,
    enquiryId,
    className,
    children = "Proceed to Payment",
    disabled = false,
    onCheckoutOpen,
    onCheckoutClose,
}: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!propertyId || !checkInDate || !checkOutDate || !customerEmail || !customerName) {
                throw new Error("Please fill in your details and choose your dates");
            }

            const scriptReady = await loadCheckoutScript();
            if (!scriptReady || !window.Razorpay) {
                throw new Error("Could not load the payment window. Check your connection and try again.");
            }

            const { ok, data } = await postJson("/payments/create-session", {
                propertyId,
                customerEmail,
                customerName,
                customerPhone,
                checkInDate,
                checkOutDate,
                guests,
                enquiryId,
            });
            if (!ok || !data.success) throw new Error(data.error || "Could not start the payment");

            const orderNumber: string = data.order_number;
            let finished = false;

            const rzp = new window.Razorpay({
                ...data.checkout,
                handler: async (response: Record<string, string>) => {
                    finished = true;
                    setLoading(true);
                    const verified = await postJson("/payments/verify", { orderNumber, data: response });
                    // The status page reads the real payment state from the server, so a slow
                    // or failed verify call never shows a wrong result.
                    // Full page load rather than client routing: it cannot be left half-finished by the
                    // payment overlay or an open dialog, and the receipt page fetches fresh state anyway.
                    window.location.assign(`/payment/success?order_number=${encodeURIComponent(orderNumber)}${verified.ok ? "" : "&check=1"}`);
                },
                modal: {
                    ondismiss: () => {
                        onCheckoutClose?.();
                        if (finished) return;
                        void postJson("/payments/cancel", { orderNumber });
                        setLoading(false);
                        setError("Payment cancelled. You have not been charged.");
                    },
                },
            });

            rzp.on("payment.failed", (response: any) => {
                if (finished) return;
                setError(response?.error?.description || "The payment failed. Please try again.");
                setLoading(false);
            });

            onCheckoutOpen?.();
            rzp.open();
        } catch (err: any) {
            setError(err?.message || "Failed to start the payment");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Button onClick={handlePayment} disabled={loading || disabled} className={className} size="lg">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Processing..." : children}
            </Button>
            {error && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </p>
            )}
        </div>
    );
}
