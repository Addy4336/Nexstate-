"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, Loader2, MapPin, X } from "lucide-react";
import { brand } from "@nexstate/brand";
import { Button } from "@/components/ui/button";

interface EnquiryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyTitle: string;
    propertyImage?: string;
    propertyLocation?: string;
    bookingData?: {
        checkInDate?: string;
        checkOutDate?: string;
        guests?: number;
        cancellationPolicy?: string;
        totalAmount?: number;
    } | null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty = { name: "", email: "", phone: "", message: "" };

function Field({
    label,
    optional,
    textarea,
    ...props
}: { label: string; optional?: boolean; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const id = useId();
    const cls =
        "mt-1.5 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-forest focus-visible:ring-2 focus-visible:ring-brass/40";
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-ink">
                {label}
                {optional && <span className="ml-1 font-normal text-stone">(optional)</span>}
            </label>
            {textarea ? (
                <textarea id={id} rows={3} className={`${cls} resize-none py-3`} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
            ) : (
                <input id={id} className={`${cls} h-12`} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
            )}
        </div>
    );
}

/**
 * "Ask a question" about a home. Sends a tenant enquiry to the CMS (via /api/enquiries),
 * including the dates the visitor was looking at, so the team can reply with context.
 * Bottom sheet on phones, centred dialog on larger screens.
 */
export function EnquiryDialog({ isOpen, onClose, propertyId, propertyTitle, propertyImage, propertyLocation, bookingData }: EnquiryDialogProps) {
    const [form, setForm] = useState(empty);
    const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
    const [error, setError] = useState<string | null>(null);

    // Fresh form each time it opens after a successful send.
    useEffect(() => {
        if (isOpen && state === "sent") {
            setState("idle");
            setForm(empty);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const valid = form.name.trim().length >= 2 && EMAIL.test(form.email.trim()) && form.phone.trim().length >= 6;

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!valid) {
            setError("Please add your name, a valid email and a phone number.");
            return;
        }
        setState("sending");
        setError(null);
        try {
            const res = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    propertyId,
                    propertyTitle,
                    type: "tenant_enquiry",
                    propertyDetails: bookingData
                        ? {
                              checkInDate: bookingData.checkInDate,
                              checkOutDate: bookingData.checkOutDate,
                              guests: bookingData.guests,
                              cancellationPolicy: bookingData.cancellationPolicy,
                              totalAmount: bookingData.totalAmount,
                              bookingType: "reservation",
                          }
                        : null,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) throw new Error(data.error || "We couldn't send your message.");
            setState("sent");
        } catch (err) {
            setError(err instanceof Error ? err.message : "We couldn't send your message.");
            setState("idle");
        }
    }

    const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    return (
        <Dialog.Root open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content
                    data-lenis-prevent
                    className="fixed inset-x-0 bottom-0 z-[61] max-h-[94svh] overflow-y-auto rounded-t-[1.75rem] bg-ivory p-6 shadow-lift outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,480px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-8 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Dialog.Title className="font-serif text-3xl tracking-tight">
                                {state === "sent" ? "Message sent" : "Ask about this home"}
                            </Dialog.Title>
                            <Dialog.Description className="mt-1 text-sm text-stone">
                                {state === "sent"
                                    ? `Thanks${form.name ? `, ${form.name.split(" ")[0]}` : ""}. We usually reply the same day.`
                                    : "Questions about the home, the area or your dates. We reply by email or phone."}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close className="-mr-2 -mt-1 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-sand" aria-label="Close">
                            <X className="size-5" />
                        </Dialog.Close>
                    </div>

                    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-white p-3">
                        <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                            {propertyImage && <Image src={propertyImage} alt="" fill sizes="80px" className="object-cover" />}
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate font-medium text-ink">{propertyTitle}</span>
                            {propertyLocation && (
                                <span className="mt-0.5 flex items-center gap-1 truncate text-sm text-stone">
                                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                                    {propertyLocation}
                                </span>
                            )}
                        </span>
                    </div>

                    {state === "sent" ? (
                        <div className="mt-8 text-center">
                            <CheckCircle2 className="mx-auto size-12 text-forest" aria-hidden="true" />
                            <p className="mt-4 text-stone">
                                We&apos;ll reply to <span className="font-medium text-ink">{form.email}</span>.
                            </p>
                            <Button size="xl" className="mt-6 w-full" onClick={onClose}>
                                Done
                            </Button>
                        </div>
                    ) : (
                        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
                            <Field label="Full name" autoComplete="name" value={form.name} onChange={set("name")} required />
                            <Field label="Email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set("email")} required />
                            <Field
                                label="Phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder={brand.market.country === "India" ? "+91 98765 43210" : ""}
                                value={form.phone}
                                onChange={set("phone")}
                                required
                            />
                            <Field label="Your question" optional textarea value={form.message} onChange={set("message")} placeholder="Is it pet friendly? Can I move in a week earlier?" />
                            {error && (
                                <p role="alert" className="text-sm text-destructive">
                                    {error}
                                </p>
                            )}
                            <Button type="submit" size="xl" className="w-full" disabled={state === "sending"}>
                                {state === "sending" ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Sending…
                                    </>
                                ) : (
                                    "Send message"
                                )}
                            </Button>
                            <p className="text-center text-xs text-stone">We only use your details to reply about this home.</p>
                        </form>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
