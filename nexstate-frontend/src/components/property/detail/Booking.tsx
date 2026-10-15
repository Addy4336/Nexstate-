"use client";

import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns";
import { CalendarDays, Info, Lock, X } from "lucide-react";
import { brand, formatMoney } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { useMediaQuery } from "@/components/motion/hooks";
import { API_BASE } from "@/lib/api";
import { firstOpenStart, isBookedDay, rangeConflicts, type PropertyDetail } from "@/lib/property-detail";
import { cn } from "@/lib/utils";
import { CheckoutDialog } from "./CheckoutDialog";

/** The server's itemised price for a stay (GET /api/properties/:id/quote). The payment charges exactly this. */
export interface Quote {
    nights: number;
    rent: number;
    tax: number;
    taxRate: number;
    bookingFee: number;
    exitCleaningFee: number;
    tourismFee: number;
    securityDeposit: number;
    total: number;
}

const iso = (d: Date) => format(d, "yyyy-MM-dd"); // local date; never toISOString (shifts a day in IST)
const nice = (d: Date) => format(d, "d MMM yyyy");

function useQuote(propertyId: string, from?: Date, to?: Date) {
    const key = from && to ? `${iso(from)}|${iso(to)}` : "";
    const [state, setState] = useState<{ quote: Quote | null; loading: boolean; error: string | null }>({
        quote: null,
        loading: !!key,
        error: null,
    });
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        if (!key) {
            setState({ quote: null, loading: false, error: null });
            return;
        }
        const [start, end] = key.split("|");
        const ctrl = new AbortController();
        setState((s) => ({ ...s, loading: true, error: null }));
        const t = setTimeout(() => {
            fetch(`${API_BASE}/api/properties/${propertyId}/quote?start_date=${start}&end_date=${end}`, { signal: ctrl.signal })
                .then((r) => r.json())
                .then((d) => {
                    if (d?.success && d.quote) setState({ quote: d.quote as Quote, loading: false, error: null });
                    else setState({ quote: null, loading: false, error: d?.error || "Price unavailable for these dates." });
                })
                .catch((e: unknown) => {
                    if (e instanceof DOMException && e.name === "AbortError") return;
                    setState({ quote: null, loading: false, error: "Couldn't load the price. Check your connection." });
                });
        }, 200);
        return () => {
            clearTimeout(t);
            ctrl.abort();
        };
    }, [propertyId, key, retry]);

    return { ...state, retry: () => setRetry((n) => n + 1) };
}

/* ---------- pieces ---------- */

function Row({ label, value, hint, strong }: { label: string; value: string; hint?: string; strong?: boolean }) {
    return (
        <div className={cn("flex items-start justify-between gap-4", strong ? "text-base font-semibold text-ink" : "text-[15px]")}>
            <span className={cn(!strong && "text-stone")}>
                {label}
                {hint && <span className="mt-0.5 block text-xs text-stone/80">{hint}</span>}
            </span>
            <span className="shrink-0 tabular-nums">{value}</span>
        </div>
    );
}

export function QuoteBreakdown({ quote }: { quote: Quote }) {
    return (
        <div className="space-y-3">
            <Row label={`Rent · ${quote.nights} ${quote.nights === 1 ? "night" : "nights"}`} value={formatMoney(quote.rent)} />
            {quote.tax > 0 && <Row label={`${brand.market.taxLabel} (${quote.taxRate}%)`} value={formatMoney(quote.tax)} />}
            {quote.bookingFee > 0 && <Row label="Booking fee" value={formatMoney(quote.bookingFee)} />}
            {quote.exitCleaningFee > 0 && <Row label="Exit cleaning" hint="Linen, towels and restocking" value={formatMoney(quote.exitCleaningFee)} />}
            {quote.tourismFee > 0 && <Row label="Service fee" value={formatMoney(quote.tourismFee)} />}
            {quote.securityDeposit > 0 && (
                <Row label="Security deposit" hint="Refundable after move-out inspection" value={formatMoney(quote.securityDeposit)} />
            )}
            <div className="border-t border-line pt-3">
                <Row label="Total due now" value={formatMoney(quote.total)} strong />
            </div>
        </div>
    );
}

/* ---------- main ---------- */

export function Booking({ property }: { property: PropertyDetail }) {
    const minNights = Math.max(1, brand.booking.minNights);
    const ranges = property.bookedRanges;
    const earliest = useMemo(() => firstOpenStart(ranges, minNights, property.availableFrom), [ranges, minNights, property.availableFrom]);
    const today = startOfDay(new Date());

    const [range, setRange] = useState<DateRange | undefined>({ from: earliest, to: addDays(earliest, minNights) });
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [enquiryOpen, setEnquiryOpen] = useState(false);
    const desktop = useMediaQuery("(min-width: 1024px)");

    const from = range?.from;
    const to = range?.to && range.from && range.to > range.from ? range.to : undefined;
    const nights = from && to ? differenceInCalendarDays(to, from) : 0;
    const conflict = !!(from && to && rangeConflicts(from, to, ranges));
    const tooShort = nights > 0 && nights < minNights;
    const valid = !!(from && to) && !conflict && !tooShort;
    const { quote, loading, error, retry } = useQuote(property.id, valid ? from : undefined, valid ? to : undefined);
    const ready = valid && !!quote && !loading;

    const bookedNow = earliest > today;

    const reserve = () => {
        if (!ready) return;
        if (sheetOpen) {
            setSheetOpen(false);
            setTimeout(() => setCheckoutOpen(true), 250); // let the sheet close first
        } else {
            setCheckoutOpen(true);
        }
    };
    const ask = () => {
        if (sheetOpen) {
            setSheetOpen(false);
            setTimeout(() => setEnquiryOpen(true), 250);
        } else setEnquiryOpen(true);
    };

    // Picking always starts fresh: first tap = check-in, second tap = check-out (then the picker closes).
    const [picking, setPicking] = useState(false);
    const onPick = (r: DateRange | undefined, clicked: Date) => {
        if (!picking) {
            setPicking(true);
            setRange({ from: clicked, to: undefined });
            return;
        }
        setRange(r);
        if (r?.from && r?.to && r.to > r.from) {
            setPicking(false);
            setCalendarOpen(false);
        }
    };

    const calendar = (months: number) => (
        <Calendar
            mode="range"
            selected={range}
            onSelect={onPick}
            numberOfMonths={months}
            defaultMonth={from ?? earliest}
            startMonth={today}
            disabled={[
                { before: today },
                (d: Date) => isBookedDay(d, ranges),
                // While choosing check-out, grey out days that would make the stay shorter than the minimum.
                (d: Date) => !!(picking && range?.from && d > range.from && d < addDays(range.from, minNights)),
            ]}
            min={minNights}
            className="rounded-2xl"
        />
    );

    const dateFields = (inline: boolean) => {
        const fields = (
            <div className="grid grid-cols-2 divide-x divide-line rounded-2xl border border-line bg-white text-left">
                <span className="px-4 py-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-deep">Check-in</span>
                    <span className="mt-0.5 block text-[15px] font-medium text-ink">{from ? nice(from) : "Add date"}</span>
                </span>
                <span className="px-4 py-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-deep">Check-out</span>
                    <span className="mt-0.5 block text-[15px] font-medium text-ink">{to ? nice(to) : "Add date"}</span>
                </span>
            </div>
        );
        if (inline) return fields;
        return (
            <Popover
                open={calendarOpen}
                onOpenChange={(v) => {
                    setCalendarOpen(v);
                    if (!v) setPicking(false);
                }}
            >
                <PopoverTrigger asChild>
                    <button type="button" className="block w-full rounded-2xl outline-offset-2" aria-label="Choose your dates">
                        {fields}
                    </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto rounded-3xl border-line p-2 shadow-lift" data-lenis-prevent>
                    {calendar(desktop ? 2 : 1)}
                    <p className="px-3 pb-2 text-xs text-stone">
                        Minimum stay {minNights} nights. Greyed-out days are already booked.
                    </p>
                </PopoverContent>
            </Popover>
        );
    };

    const panel = (inline: boolean) => (
        <div className="space-y-5">
            <div>
                <p className="font-serif text-3xl tracking-tight text-ink">
                    {formatMoney(property.price)}
                    <span className="ml-1.5 font-sans text-base text-stone">/ month</span>
                </p>
                {bookedNow && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-medium text-brass-deep">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        Earliest check-in {nice(earliest)}
                    </p>
                )}
            </div>

            {dateFields(inline)}
            {inline && (
                <div className="flex justify-center rounded-2xl border border-line bg-white p-1">
                    {calendar(1)}
                </div>
            )}

            <div aria-live="polite" className="min-h-6">
                {!from || !to ? (
                    <p className="text-sm text-stone">Choose check-in and check-out to see the full price.</p>
                ) : conflict ? (
                    <p className="flex gap-2 text-sm text-destructive">
                        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        Those dates overlap an existing booking. Please pick different dates.
                    </p>
                ) : tooShort ? (
                    <p className="flex gap-2 text-sm text-destructive">
                        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        The minimum stay is {minNights} nights.
                    </p>
                ) : error ? (
                    <p className="text-sm text-destructive">
                        {error}{" "}
                        <button type="button" onClick={retry} className="underline underline-offset-4">
                            Try again
                        </button>
                    </p>
                ) : loading || !quote ? (
                    <div className="space-y-3" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="flex justify-between">
                                <span className="h-4 w-32 animate-pulse rounded bg-sand" />
                                <span className="h-4 w-20 animate-pulse rounded bg-sand" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <QuoteBreakdown quote={quote} />
                )}
            </div>

            <div className="space-y-3">
                <Button size="xl" className="w-full" disabled={!ready} onClick={reserve}>
                    Reserve
                </Button>
                <Button size="xl" variant="outline-dark" className="w-full" onClick={ask}>
                    Ask a question
                </Button>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-stone">
                <Lock className="size-3.5" aria-hidden="true" />
                You won&apos;t be charged until you pay on the next step.
            </p>
        </div>
    );

    return (
        <>
            {/* Desktop: sticky card */}
            <div className="hidden h-full lg:block">
                <div className="under-nav rounded-3xl border border-line bg-white/80 p-6 shadow-lift backdrop-blur">{panel(false)}</div>
            </div>

            {/* Phones and tablets: bottom bar + sheet */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="font-serif text-xl leading-tight text-ink">
                            {quote && ready ? formatMoney(quote.total) : formatMoney(property.price)}
                            <span className="ml-1 font-sans text-sm text-stone">{quote && ready ? "total" : "/ month"}</span>
                        </p>
                        <p className="truncate text-xs text-stone">
                            {from && to ? `${format(from, "d MMM")} – ${format(to, "d MMM")} · ${nights} nights` : "Add your dates"}
                        </p>
                    </div>
                    <Button size="pill" className="h-12 shrink-0 px-7" onClick={() => setSheetOpen(true)}>
                        Reserve
                    </Button>
                </div>
            </div>

            <Dialog.Root
                open={sheetOpen}
                onOpenChange={(v) => {
                    setSheetOpen(v);
                    if (!v) setPicking(false);
                }}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                    <Dialog.Content
                        data-lenis-prevent
                        aria-describedby={undefined}
                        className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[92svh] flex-col rounded-t-[1.75rem] bg-ivory shadow-lift outline-none duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom"
                    >
                        <div className="flex items-center justify-between px-6 pb-2 pt-5">
                            <Dialog.Title className="font-serif text-2xl tracking-tight">Your stay</Dialog.Title>
                            <Dialog.Close className="flex size-11 items-center justify-center rounded-full hover:bg-sand" aria-label="Close">
                                <X className="size-5" />
                            </Dialog.Close>
                        </div>
                        <div className="overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">{panel(true)}</div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {quote && from && to && (
                <CheckoutDialog
                    open={checkoutOpen}
                    onOpenChange={setCheckoutOpen}
                    property={property}
                    checkIn={iso(from)}
                    checkOut={iso(to)}
                    checkInLabel={nice(from)}
                    checkOutLabel={nice(to)}
                    quote={quote}
                />
            )}

            <EnquiryDialog
                isOpen={enquiryOpen}
                onClose={() => setEnquiryOpen(false)}
                propertyId={property.id}
                propertyTitle={property.title}
                propertyImage={property.images[0]}
                propertyLocation={property.location}
                bookingData={
                    from && to
                        ? { checkInDate: iso(from), checkOutDate: iso(to), totalAmount: quote?.total }
                        : null
                }
            />
        </>
    );
}
