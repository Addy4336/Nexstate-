"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, House, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/layout/Section";
import { RevealText } from "@/components/motion/RevealText";
import { EASE_OUT } from "@/components/motion/hooks";
import { PropertyCard } from "@/components/property/PropertyCard";
import { API_BASE } from "@/lib/api";
import {
    BED_OPTIONS,
    BUDGETS,
    HOME_TYPES,
    SORTS,
    activeFilterCount,
    applyClientSide,
    budgetValue,
    parseFilters,
    toApiQuery,
    toUrlQuery,
    type Filters,
} from "@/lib/property-filters";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

interface Props {
    initialProperties: Property[];
    /** API query string the server used for `initialProperties`; avoids refetching on first render. */
    initialKey: string;
    cities: string[];
}

/* ---------- small controls ---------- */

function SelectField({
    label,
    value,
    onChange,
    options,
    className,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    className?: string;
}) {
    const id = useId();
    return (
        <div className={cn("relative px-4 py-2.5", className)}>
            <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-deep">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-medium text-ink outline-none focus-visible:underline"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 size-4 text-stone" />
        </div>
    );
}

/** Single-choice pill group (bedrooms, bathrooms, home type). Pressing the active pill clears it. */
function Pills({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-deep">{label}</legend>
            <div className="flex flex-wrap gap-2">
                {options.map((o) => {
                    const on = o.value !== "" && value === o.value;
                    return (
                        <button
                            key={o.value || "any"}
                            type="button"
                            aria-pressed={on}
                            onClick={() => onChange(on ? "" : o.value)}
                            className={cn(
                                "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                                on ? "border-forest bg-forest text-ivory" : "border-line bg-white text-ink hover:border-ink/40"
                            )}
                        >
                            {o.label}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}

function Skeleton() {
    return (
        <div aria-hidden="true">
            <div className="aspect-[4/5] animate-pulse rounded-[1.25rem] bg-sand" />
            <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-sand" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-sand" />
        </div>
    );
}

/* ---------- main component ---------- */

export function PropertiesExplorer({ initialProperties, initialKey, cities }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
    const apiQs = toApiQuery(filters);

    const [items, setItems] = useState<Property[]>(initialProperties);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);
    const loadedKey = useRef(initialKey);

    const [sheetOpen, setSheetOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(() => !!(filters.baths || filters.type));

    /* URL <-> filters */
    const setFilters = useCallback(
        (patch: Partial<Filters>) => {
            const qs = toUrlQuery({ ...filters, ...patch });
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        },
        [filters, pathname, router]
    );
    const clearAll = () => router.replace(pathname, { scroll: false });

    /* Search text: type freely, push to the URL after a short pause. */
    const [qInput, setQInput] = useState(filters.q);
    const lastQ = useRef(filters.q);
    useEffect(() => {
        if (filters.q !== lastQ.current) {
            lastQ.current = filters.q;
            setQInput(filters.q);
        }
    }, [filters.q]);
    useEffect(() => {
        if (qInput === filters.q) return;
        const t = setTimeout(() => {
            lastQ.current = qInput;
            setFilters({ q: qInput.trim() });
        }, 350);
        return () => clearTimeout(t);
    }, [qInput, filters.q, setFilters]);

    /* Fetch whenever the API-relevant part of the URL changes (first render uses the server's data). */
    useEffect(() => {
        if (apiQs === loadedKey.current) return;
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);
        fetch(`${API_BASE}/api/properties/search?${apiQs}`, { signal: ctrl.signal })
            .then(async (res) => {
                if (!res.ok) throw new Error("The search service is not responding.");
                const json = await res.json();
                if (!json.success) throw new Error(json.error || "Search failed.");
                loadedKey.current = apiQs;
                setItems(json.data as Property[]);
            })
            .catch((e: unknown) => {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : "Something went wrong.");
            })
            .finally(() => {
                if (!ctrl.signal.aborted) setLoading(false);
            });
        return () => ctrl.abort();
    }, [apiQs, retry]);

    const list = useMemo(() => applyClientSide(items, filters), [items, filters]);
    const count = activeFilterCount(filters);
    const budget = budgetValue(filters);

    const cityOptions = useMemo(() => {
        const set = new Set(cities);
        if (filters.city) set.add(filters.city);
        return [{ value: "", label: "All cities" }, ...[...set].sort().map((c) => ({ value: c, label: c }))];
    }, [cities, filters.city]);
    const budgetOptions = useMemo(
        () => (budget === "custom" ? [...BUDGETS, { value: "custom", label: "Custom range", min: "", max: "" }] : BUDGETS),
        [budget]
    );
    const setBudget = (v: string) => {
        const b = BUDGETS.find((x) => x.value === v);
        if (b) setFilters({ minPrice: b.min, maxPrice: b.max });
    };

    const chips: { key: string; label: string; clear: () => void }[] = [
        filters.q && { key: "q", label: `“${filters.q}”`, clear: () => setFilters({ q: "" }) },
        filters.city && { key: "city", label: filters.city, clear: () => setFilters({ city: "" }) },
        budget && {
            key: "budget",
            label: budgetOptions.find((o) => o.value === budget)?.label ?? "Budget",
            clear: () => setFilters({ minPrice: "", maxPrice: "" }),
        },
        filters.beds && { key: "beds", label: `${filters.beds}+ bedrooms`, clear: () => setFilters({ beds: "" }) },
        filters.baths && { key: "baths", label: `${filters.baths}+ bathrooms`, clear: () => setFilters({ baths: "" }) },
        filters.type && { key: "type", label: filters.type, clear: () => setFilters({ type: "" }) },
    ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

    const countText = `${list.length} ${list.length === 1 ? "home" : "homes"}${filters.city ? ` in ${filters.city}` : ""}`;

    return (
        <>
            {/* Page header */}
            <section className="bg-sand pb-10 pt-32 md:pb-14 md:pt-40">
                <Container>
                    <Eyebrow>Homes</Eyebrow>
                    <RevealText as="h1" immediate text="Find your *home*" className="text-display mt-4" />
                    <p className="text-lead mt-5 max-w-xl text-stone" aria-live="polite">
                        {loading ? "Searching…" : `${countText}, furnished and ready to move in.`}
                    </p>
                </Container>
            </section>

            {/* Sticky filter bar */}
            <div className="under-nav z-30 -mt-7">
                <Container>
                    <div className={cn("glass rounded-[1.75rem] border border-line/80 p-1.5 shadow-lift transition-[border-radius] duration-300", moreOpen ? "lg:rounded-[2rem]" : "lg:rounded-full")}>
                        {/* Phones and tablets: search + filters sheet */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <label className="relative flex-1">
                                <span className="sr-only">Search homes</span>
                                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone" />
                                <input
                                    type="search"
                                    value={qInput}
                                    onChange={(e) => setQInput(e.target.value)}
                                    placeholder="Search by area or name"
                                    className="h-12 w-full rounded-full bg-transparent pl-11 pr-3 text-[15px] text-ink outline-none placeholder:text-stone focus-visible:ring-2 focus-visible:ring-brass"
                                />
                            </label>
                            <Button type="button" size="pill" className="h-12 shrink-0 px-5" onClick={() => setSheetOpen(true)}>
                                <SlidersHorizontal />
                                Filters
                                {count > 0 && (
                                    <span className="ml-0.5 flex size-5 items-center justify-center rounded-full bg-brass text-[11px] font-semibold text-ink">
                                        {count}
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* Desktop: inline controls */}
                        <div className="hidden items-stretch lg:flex">
                            <label className="relative flex min-w-0 flex-[1.3] items-center border-r border-line/70 pl-5">
                                <span className="sr-only">Search homes</span>
                                <Search aria-hidden="true" className="mr-3 size-4 shrink-0 text-stone" />
                                <input
                                    type="search"
                                    value={qInput}
                                    onChange={(e) => setQInput(e.target.value)}
                                    placeholder="Search by area or name"
                                    className="h-14 w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-stone focus-visible:underline"
                                />
                            </label>
                            <SelectField label="City" value={filters.city} onChange={(v) => setFilters({ city: v })} options={cityOptions} className="flex-1 border-r border-line/70" />
                            <SelectField label="Bedrooms" value={filters.beds} onChange={(v) => setFilters({ beds: v })} options={BED_OPTIONS} className="w-36 border-r border-line/70" />
                            <SelectField label="Budget / month" value={budget} onChange={setBudget} options={budgetOptions} className="flex-1" />
                            <button
                                type="button"
                                aria-expanded={moreOpen}
                                onClick={() => setMoreOpen((v) => !v)}
                                className="ml-1 flex h-14 items-center gap-2 rounded-full px-5 text-sm font-medium text-ink transition-colors hover:bg-sand"
                            >
                                <SlidersHorizontal className="size-4" aria-hidden="true" />
                                More
                            </button>
                        </div>

                        <AnimatePresence initial={false}>
                            {moreOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: EASE_OUT }}
                                    className="hidden overflow-hidden lg:block"
                                >
                                    <div className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-4 border-t border-line/70 px-5 py-4">
                                        <Pills label="Bathrooms" value={filters.baths} onChange={(v) => setFilters({ baths: v })} options={BED_OPTIONS.filter((o) => o.value)} />
                                        <Pills label="Home type" value={filters.type} onChange={(v) => setFilters({ type: v })} options={HOME_TYPES.map((t) => ({ value: t, label: t }))} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Container>
            </div>

            {/* Results */}
            <section className="py-10 md:py-14" aria-busy={loading}>
                <Container>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            {chips.map((c) => (
                                <button
                                    key={c.key}
                                    type="button"
                                    onClick={c.clear}
                                    className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-sm text-ink transition-colors hover:border-ink/40"
                                    aria-label={`Remove filter: ${c.label}`}
                                >
                                    {c.label}
                                    <X className="size-3.5 text-stone group-hover:text-ink" aria-hidden="true" />
                                </button>
                            ))}
                            {chips.length > 1 && (
                                <button type="button" onClick={clearAll} className="px-2 text-sm text-brass-deep underline underline-offset-4">
                                    Clear all
                                </button>
                            )}
                        </div>
                        <label className="ml-auto flex items-center gap-2 text-sm text-stone">
                            Sort
                            <span className="relative">
                                <select
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ sort: e.target.value as Filters["sort"] })}
                                    className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-white pl-4 pr-9 text-sm font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-brass"
                                >
                                    {SORTS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-stone" />
                            </span>
                        </label>
                    </div>

                    {/* Progress hairline while a new search loads */}
                    <div aria-hidden="true" className="mt-5 h-px overflow-hidden bg-line">
                        <div className={cn("h-full w-1/3 bg-brass transition-opacity", loading ? "animate-[loadbar_1.1s_ease-in-out_infinite] opacity-100" : "opacity-0")} />
                    </div>

                    {error ? (
                        <div className="mx-auto max-w-md py-20 text-center">
                            <p className="font-serif text-2xl">We couldn&apos;t load homes just now</p>
                            <p className="mt-3 text-stone">{error}</p>
                            <Button className="mt-6" size="pill" onClick={() => setRetry((n) => n + 1)}>
                                Try again
                            </Button>
                        </div>
                    ) : list.length === 0 && !loading ? (
                        <div className="mx-auto max-w-lg py-20 text-center">
                            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-sand text-forest">
                                <House className="size-7" aria-hidden="true" />
                            </span>
                            <h2 className="mt-6 font-serif text-3xl tracking-tight">No homes match these filters</h2>
                            <p className="mt-3 text-stone">
                                Try a wider budget or fewer filters, or tell us what you need and we&apos;ll look for it.
                            </p>
                            <div className="mt-7 flex flex-wrap justify-center gap-3">
                                {count > 0 && (
                                    <Button size="xl" onClick={clearAll}>
                                        Clear filters
                                    </Button>
                                )}
                                <Button asChild size="xl" variant="outline-dark">
                                    <Link href="/contact">Tell us what you need</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <ul
                            className={cn(
                                "mt-8 grid gap-x-6 gap-y-12 transition-opacity duration-300 sm:grid-cols-2 xl:grid-cols-3",
                                loading && "pointer-events-none opacity-50"
                            )}
                        >
                            {loading && list.length === 0
                                ? Array.from({ length: 6 }, (_, i) => (
                                      <li key={i}>
                                          <Skeleton />
                                      </li>
                                  ))
                                : (
                                      <AnimatePresence mode="popLayout" initial={false}>
                                          {list.map((p, i) => (
                                              <motion.li
                                                  key={p.id}
                                                  layout="position"
                                                  initial={{ opacity: 0, y: 24 }}
                                                  animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: Math.min(i, 6) * 0.05, ease: EASE_OUT } }}
                                                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                              >
                                                  <PropertyCard property={p} priority={i < 3} />
                                              </motion.li>
                                          ))}
                                      </AnimatePresence>
                                  )}
                        </ul>
                    )}
                </Container>
            </section>

            {/* Mobile filter sheet */}
            <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content
                        data-lenis-prevent
                        aria-describedby={undefined}
                        className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[90svh] flex-col rounded-t-[1.75rem] bg-ivory shadow-lift outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
                    >
                        <div className="flex items-center justify-between px-6 pb-2 pt-5">
                            <Dialog.Title className="font-serif text-2xl tracking-tight">Filters</Dialog.Title>
                            <Dialog.Close className="flex size-11 items-center justify-center rounded-full hover:bg-sand" aria-label="Close filters">
                                <X className="size-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-6 overflow-y-auto px-6 pb-6 pt-2">
                            <div className="grid gap-2 rounded-2xl border border-line bg-white">
                                <SelectField label="City" value={filters.city} onChange={(v) => setFilters({ city: v })} options={cityOptions} />
                                <div className="mx-4 border-t border-line" />
                                <SelectField label="Budget / month" value={budget} onChange={setBudget} options={budgetOptions} />
                                <div className="mx-4 border-t border-line" />
                                <SelectField label="Sort by" value={filters.sort} onChange={(v) => setFilters({ sort: v as Filters["sort"] })} options={SORTS} />
                            </div>
                            <Pills label="Bedrooms" value={filters.beds} onChange={(v) => setFilters({ beds: v })} options={BED_OPTIONS.filter((o) => o.value)} />
                            <Pills label="Bathrooms" value={filters.baths} onChange={(v) => setFilters({ baths: v })} options={BED_OPTIONS.filter((o) => o.value)} />
                            <Pills label="Home type" value={filters.type} onChange={(v) => setFilters({ type: v })} options={HOME_TYPES.map((t) => ({ value: t, label: t }))} />
                        </div>

                        <div className="flex items-center gap-3 border-t border-line bg-ivory px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <Button variant="outline-dark" size="pill" className="h-12 px-5" onClick={clearAll} disabled={count === 0}>
                                Clear
                            </Button>
                            <Button size="pill" className="h-12 flex-1" onClick={() => setSheetOpen(false)}>
                                {loading ? "Searching…" : `Show ${list.length} ${list.length === 1 ? "home" : "homes"}`}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
