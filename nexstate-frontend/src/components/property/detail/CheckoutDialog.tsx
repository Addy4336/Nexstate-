"use client";

import { useId, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShieldCheck, X } from "lucide-react";
import { formatMoney } from "@nexstate/brand";
import { PaymentButton } from "@/components/payments/payment-button";
import type { PropertyDetail } from "@/lib/property-detail";
import { QuoteBreakdown, type Quote } from "./Booking";

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    property: PropertyDetail;
    checkIn: string;
    checkOut: string;
    checkInLabel: string;
    checkOutLabel: string;
    quote: Quote;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Field({
    label,
    hint,
    error,
    ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-ink">
                {label}
                {hint && <span className="ml-1 font-normal text-stone">{hint}</span>}
            </label>
            <input
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-err` : undefined}
                className="mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-forest focus-visible:ring-2 focus-visible:ring-brass/40 aria-[invalid=true]:border-destructive"
                {...input}
            />
            {error && (
                <p id={`${id}-err`} className="mt-1 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

/** Final step: who is staying, the server's price for the chosen dates, then Razorpay. */
export function CheckoutDialog({ open, onOpenChange, property, checkIn, checkOut, checkInLabel, checkOutLabel, quote }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [touched, setTouched] = useState({ name: false, email: false });

    const nameError = name.trim().length < 2 ? "Please enter your full name." : undefined;
    const emailError = !EMAIL.test(email.trim()) ? "Please enter a valid email address." : undefined;
    const valid = !nameError && !emailError;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content
                    data-lenis-prevent
                    className="fixed inset-x-0 bottom-0 z-[61] max-h-[94svh] overflow-y-auto rounded-t-[1.75rem] bg-ivory p-6 shadow-lift outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-8 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Dialog.Title className="font-serif text-3xl tracking-tight">Confirm and pay</Dialog.Title>
                            <Dialog.Description className="mt-1 text-sm text-stone">
                                {property.title} · {checkInLabel} to {checkOutLabel}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close className="-mr-2 -mt-1 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-sand" aria-label="Close">
                            <X className="size-5" />
                        </Dialog.Close>
                    </div>

                    <div className="mt-6 rounded-2xl border border-line bg-white p-5">
                        <QuoteBreakdown quote={quote} />
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
                        <Field
                            label="Full name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            error={touched.name ? nameError : undefined}
                            required
                        />
                        <Field
                            label="Email"
                            hint="for your booking confirmation"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                            error={touched.email ? emailError : undefined}
                            required
                        />
                        <Field
                            label="Phone"
                            hint="(optional)"
                            type="tel"
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </form>

                    <div className="mt-6">
                        <PaymentButton
                            propertyId={property.id}
                            customerName={name.trim()}
                            customerEmail={email.trim()}
                            customerPhone={phone.trim() || undefined}
                            checkInDate={checkIn}
                            checkOutDate={checkOut}
                            disabled={!valid}
                            className="h-12 w-full rounded-full text-[15px]"
                        >
                            Pay {formatMoney(quote.total)} securely
                        </PaymentButton>
                        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-stone">
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                            Secure payment by Razorpay: UPI, cards, netbanking and wallets.
                        </p>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
