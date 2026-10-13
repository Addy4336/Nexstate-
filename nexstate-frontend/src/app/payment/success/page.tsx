"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE } from "@/lib/api";

interface PaymentView {
    order_number: string;
    amount: number | string;
    currency: string | null;
    status: "success" | "pending" | "failed" | "cancelled" | string;
    booking_status: string | null;
    created_at: string;
    check_in_date: string | null;
    check_out_date: string | null;
    guests: number | null;
    provider_payment_id: string | null;
    property: { id: string; title: string } | null;
}

const POLL_MS = 2500;
const POLL_LIMIT = 12; // ~30s: enough for the provider's server callback to land

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order_number");
    const [payment, setPayment] = useState<PaymentView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const polls = useRef(0);

    useEffect(() => {
        if (!orderNumber) {
            setError("No order number provided");
            setLoading(false);
            return;
        }

        let cancelled = false;
        let timer: ReturnType<typeof setTimeout>;

        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/payments/${encodeURIComponent(orderNumber)}`, { cache: "no-store" });
                const data = await res.json();
                if (cancelled) return;
                if (!data.success || !data.payment) {
                    setError(data.error || "Payment not found");
                    setLoading(false);
                    return;
                }
                setPayment(data.payment);
                setLoading(false);
                // Still pending: the provider's server callback may not have arrived yet
                if (data.payment.status === "pending" && polls.current < POLL_LIMIT) {
                    polls.current += 1;
                    timer = setTimeout(load, POLL_MS);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load payment details");
                    setLoading(false);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="container max-w-2xl mx-auto px-4 py-16">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">We could not find this payment</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/">Go Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const paid = payment.status === "success";
    const pending = payment.status === "pending";
    const bookingProblem = paid && payment.booking_status && !["confirmed", "not_applicable"].includes(payment.booking_status);

    const heading = paid
        ? bookingProblem
            ? "Payment received"
            : "Payment successful"
        : pending
          ? "Confirming your payment"
          : payment.status === "cancelled"
            ? "Payment cancelled"
            : "Payment failed";

    const subheading = paid
        ? bookingProblem
            ? "We received your payment, but we need to confirm your dates with you."
            : "Thank you. Your booking is confirmed."
        : pending
          ? "This usually takes a few seconds. You can keep this page open."
          : payment.status === "cancelled"
            ? "You were not charged."
            : "No booking was made. If money was deducted, it is returned by your bank automatically.";

    const Icon = paid ? (bookingProblem ? AlertTriangle : CheckCircle2) : pending ? Clock : XCircle;
    const iconColor = paid ? (bookingProblem ? "text-amber-600" : "text-green-600") : pending ? "text-blue-600" : "text-red-600";

    return (
        <div className="container max-w-3xl mx-auto px-4 py-16">
            <div className="text-center space-y-6">
                <Icon className={`h-20 w-20 mx-auto ${iconColor}`} />
                <h1 className="text-4xl font-bold">{heading}</h1>
                <p className="text-lg text-muted-foreground">{subheading}</p>

                {bookingProblem && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-4 text-left text-sm text-amber-900">
                        <strong>Your dates may have just been taken by another booking.</strong> Our team will contact you
                        shortly to offer alternative dates or a full refund. Please quote order{" "}
                        <span className="font-mono">{payment.order_number}</span>.
                    </div>
                )}

                <Card className="text-left mt-8">
                    <CardHeader>
                        <CardTitle>Payment details</CardTitle>
                        <CardDescription>
                            Order number: <span className="font-mono font-semibold">{payment.order_number}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-muted-foreground">Amount</div>
                            <div className="font-semibold">{formatMoney(payment.amount)}</div>

                            <div className="text-muted-foreground">Status</div>
                            <div className="capitalize">{paid ? "paid" : payment.status}</div>

                            <div className="text-muted-foreground">Date</div>
                            <div>{new Date(payment.created_at).toLocaleString()}</div>

                            {payment.provider_payment_id && (
                                <>
                                    <div className="text-muted-foreground">Transaction ID</div>
                                    <div className="font-mono text-xs break-all">{payment.provider_payment_id}</div>
                                </>
                            )}
                        </div>

                        {payment.check_in_date && payment.check_out_date && (
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-3">Stay</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {payment.property && (
                                        <>
                                            <div className="text-muted-foreground">Property</div>
                                            <div className="font-medium">{payment.property.title}</div>
                                        </>
                                    )}
                                    <div className="text-muted-foreground">Check-in</div>
                                    <div className="font-medium">{new Date(payment.check_in_date).toLocaleDateString()}</div>
                                    <div className="text-muted-foreground">Check-out</div>
                                    <div className="font-medium">{new Date(payment.check_out_date).toLocaleDateString()}</div>
                                    {payment.guests && (
                                        <>
                                            <div className="text-muted-foreground">Guests</div>
                                            <div className="font-medium">{payment.guests}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-center pt-6">
                    <Button asChild size="lg">
                        <Link href="/properties">Browse more properties</Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                        <Link href="/">Go home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }
        >
            <PaymentStatusContent />
        </Suspense>
    );
}
