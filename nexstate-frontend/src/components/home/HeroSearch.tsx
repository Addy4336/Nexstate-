"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { formatMoney } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { cityImages } from "@/lib/site-images";

const BUDGETS = [
    { value: "", label: "Any budget" },
    { value: "0-50000", label: `Under ${formatMoney(50000)}` },
    { value: "50000-100000", label: `${formatMoney(50000)} to ${formatMoney(100000)}` },
    { value: "100000-250000", label: `${formatMoney(100000)} to ${formatMoney(250000)}` },
    { value: "250000-", label: `${formatMoney(250000)} and above` },
];

const BEDS = [
    { value: "", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
];

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    return (
        <div className="relative px-4 py-3 md:px-5">
            <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-deep">
                {label}
            </label>
            {children}
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3.5 right-4 size-4 text-stone" />
        </div>
    );
}

const selectClass =
    "mt-1 w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-medium text-ink outline-none focus-visible:underline";

/** Search panel in the hero: native selects (best picker on phones), hands the filters to /properties. */
export function HeroSearch() {
    const router = useRouter();
    const [city, setCity] = useState("");
    const [beds, setBeds] = useState("");
    const [budget, setBudget] = useState("");

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (city) params.set("location", city);
        if (beds) params.set("bedrooms", beds);
        if (budget) {
            const [min, max] = budget.split("-");
            if (min && min !== "0") params.set("minPrice", min);
            if (max) params.set("maxPrice", max);
        }
        const qs = params.toString();
        router.push(qs ? `/properties?${qs}` : "/properties");
    }

    return (
        <form
            onSubmit={submit}
            role="search"
            aria-label="Search homes"
            className="glass grid max-w-4xl grid-cols-2 divide-y divide-line/70 overflow-hidden rounded-3xl border border-white/40 shadow-lift md:grid-cols-[1.2fr_0.7fr_1.2fr_auto] md:divide-x md:divide-y-0 md:rounded-full md:p-1.5 md:pr-1.5"
        >
            <div className="col-span-2 md:col-span-1">
                <Field id="hs-city" label="City">
                    <select id="hs-city" value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                        <option value="">All cities</option>
                        {cityImages.map((c) => (
                            <option key={c.slug} value={c.name === "Delhi NCR" ? "Delhi" : c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
            <div className="border-r border-line/70 md:border-r-0">
                <Field id="hs-beds" label="Bedrooms">
                    <select id="hs-beds" value={beds} onChange={(e) => setBeds(e.target.value)} className={selectClass}>
                        {BEDS.map((b) => (
                            <option key={b.value} value={b.value}>
                                {b.label}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
            <div>
                <Field id="hs-budget" label="Monthly budget">
                    <select id="hs-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
                        {BUDGETS.map((b) => (
                            <option key={b.value} value={b.value}>
                                {b.label}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
            <div className="col-span-2 p-2 md:col-span-1 md:p-0">
                <Button type="submit" size="xl" className="h-12 w-full md:h-full md:min-h-14 md:w-auto md:px-8">
                    Search <ArrowRight />
                </Button>
            </div>
        </form>
    );
}
