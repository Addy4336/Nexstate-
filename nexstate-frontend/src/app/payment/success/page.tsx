"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Loader2, Printer, XCircle } from "lucide-react";
import { brand, formatMoney } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Section";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";

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

/** "2026-11-01" -> "1 Nov 2026", read as a local date (new Date() would treat it as UTC). */
const day = (d: string) => format(parseISO(d), "d MMM yyyy");

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-[80svh] bg-sand pb-20 pt-32 md:pt-40">
            <Container className="max-w-2xl">{children}</Container>
        </main>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-6 py-3.5">
            <dt className="text-stone">{label}</dt>
            <dd className="text-right font-medium text-ink">{children}</dd>
        </div>
    );
}

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order_number");
    const [payment, setPayment] = useState<PaymentView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const polls = useRef(0);

    useEffect(() => {
        if (!orderNumber) {
            setError("This link is missing its order number.");
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
                    setError("We couldn't load the payment details. Please refresh in a moment.");
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
            <Shell>
                <div className="flex min-h-[40svh] flex-col items-center justify-center gap-4 text-stone" role="status">
                    <Loader2 className="size-8 animate-spin text-forest" aria-hidden="true" />
                    Checking your payment…
                </div>
            </Shell>
        );
    }

    if (error || !payment) {
        return (
            <Shell>
                <div className="rounded-3xl bg-white p-8 text-center shadow-soft md:p-12">
                    <XCircle className="mx-auto size-12 text-destructive" aria-hidden="true" />
                    <h1 className="text-headline mt-5">We couldn&apos;t find this payment</h1>
                    <p className="text-lead mt-4 text-stone">{error}</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Button asChild size="xl">
                            <Link href="/properties">Browse homes</Link>
                        </Button>
                        <Button asChild size="xl" variant="outline-dark">
                            <Link href="/contact">Contact us</Link>
                        </Button>
                    </div>
                </div>
            </Shell>
        );
    }

    const paid = payment.status === "success";
    const pending = payment.status === "pending";
    const bookingProblem = paid && payment.booking_status && !["confirmed", "not_applicable"].includes(payment.booking_status);

    const heading = paid
        ? bookingProblem
            ? "Payment received"
            : "You're booked in"
        : pending
          ? "Confirming your payment"
          : payment.status === "cancelled"
            ? "Payment cancelled"
            : "Payment failed";

    const subheading = paid
        ? bookingProblem
            ? "We received your payment, but we need to confirm your dates with you."
            : "Thank you. Your payment went through and your dates are reserved."
        : pending
          ? "This usually takes a few seconds. You can keep this page open."
          : payment.status === "cancelled"
            ? "You were not charged."
            : "No booking was made. If money was deducted, your bank returns it automatically.";

    const Icon = paid ? (bookingProblem ? AlertTriangle : CheckCircle2) : pending ? Clock : XCircle;
    const tone = paid ? (bookingProblem ? "bg-amber-100 text-amber-700" : "bg-forest text-ivory") : pending ? "bg-sand text-brass-deep" : "bg-red-100 text-destructive";

    return (
        <Shell>
            <div className="text-center">
                <span className={cn("mx-auto flex size-16 items-center justify-center rounded-full", tone)}>
                    <Icon className={cn("size-8", pending && "animate-pulse")} aria-hidden="true" />
                </span>
                <h1 className="text-headline mt-6" aria-live="polite">
                    {heading}
                </h1>
                <p className="text-lead mx-auto mt-4 max-w-md text-stone">{subheading}</p>
            </div>

            {bookingProblem && (
                <div role="alert" className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                    <strong>Your dates may have just been taken by another booking.</strong> Our team will contact you shortly to
                    offer alternative dates or a full refund. Please quote order <span className="font-mono">{payment.order_number}</span>.
                </div>
            )}

            {/* Receipt */}
            <section className="mt-10 rounded-3xl bg-white p-6 shadow-soft md:p-8" aria-labelledby="receipt">
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                    <h2 id="receipt" className="text-title">
                        {paid ? "Booking receipt" : "Payment details"}
                    </h2>
                    <p className="font-serif text-2xl tracking-tight">{formatMoney(payment.amount)}</p>
                </div>
                <dl className="divide-y divide-line text-[15px]">
                    {payment.property && <Row label="Home">{payment.property.title}</Row>}
                    {payment.check_in_date && <Row label="Check-in">{day(payment.check_in_date)}</Row>}
                    {payment.check_out_date && <Row label="Check-out">{day(payment.check_out_date)}</Row>}
                    {payment.guests ? <Row label="Guests">{payment.guests}</Row> : null}
                    <Row label="Status">
                        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide", paid ? "bg-forest/10 text-forest" : pending ? "bg-sand text-brass-deep" : "bg-red-50 text-destructive")}>
                            {paid ? "Paid" : payment.status}
                        </span>
                    </Row>
                    <Row label="Order number">
                        <span className="font-mono text-sm">{payment.order_number}</span>
                    </Row>
                    {payment.provider_payment_id && (
                        <Row label="Transaction ID">
                            <span className="break-all font-mono text-sm">{payment.provider_payment_id}</span>
                        </Row>
                    )}
                    <Row label="Date">{format(new Date(payment.created_at), "d MMM yyyy, h:mm a")}</Row>
                </dl>
                {paid && (
                    <p className="mt-5 text-sm text-stone">
                        Any security deposit in this total is refunded after the move-out inspection. Questions? Write to{" "}
                        {brand.contact.email ? (
                            <a className="text-forest underline decoration-brass underline-offset-4" href={`mailto:${brand.contact.email}`}>
                                {brand.contact.email}
                            </a>
                        ) : (
                            "us"
                        )}{" "}
                        quoting your order number.
                    </p>
                )}
            </section>

            <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
                {payment.property && (
                    <Button asChild size="xl">
                        <Link href={`/properties/home/${payment.property.id}`}>
                            View the home <ArrowRight />
                        </Link>
                    </Button>
                )}
                {paid && (
                    <Button size="xl" variant="outline-dark" onClick={() => window.print()}>
                        <Printer /> Print receipt
                    </Button>
                )}
                {!paid && !pending && (
                    <Button asChild size="xl" variant="outline-dark">
                        <Link href="/properties">Browse homes</Link>
                    </Button>
                )}
            </div>
        </Shell>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <Shell>
                    <div className="flex min-h-[40svh] items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-forest" aria-hidden="true" />
                    </div>
                </Shell>
            }
        >
            <PaymentStatusContent />
        </Suspense>
    );
}
