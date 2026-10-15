import { formatMoney } from "@nexstate/brand";
import type { Property } from "@/types/property";

/**
 * Search filters for /properties. The URL is the source of truth, so a filtered view can be
 * bookmarked or shared, and the server can render the same results the visitor will see.
 */
export interface Filters {
    q: string;
    city: string; // sent to the API as `location` (substring match)
    minPrice: string;
    maxPrice: string;
    beds: string;
    baths: string;
    type: string;
    sort: SortKey;
}

export type SortKey = "recommended" | "price-asc" | "price-desc" | "beds-desc";

export const SORTS: { value: SortKey; label: string }[] = [
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "beds-desc", label: "Most bedrooms" },
];

export const BUDGETS = [
    { value: "", label: "Any budget", min: "", max: "" },
    { value: "0-50000", label: `Under ${formatMoney(50000)}`, min: "", max: "50000" },
    { value: "50000-100000", label: `${formatMoney(50000)} to ${formatMoney(100000)}`, min: "50000", max: "100000" },
    { value: "100000-250000", label: `${formatMoney(100000)} to ${formatMoney(250000)}`, min: "100000", max: "250000" },
    { value: "250000-", label: `${formatMoney(250000)} and above`, min: "250000", max: "" },
];

export const HOME_TYPES = ["Apartment", "Villa", "Penthouse", "Studio", "House"];

export const BED_OPTIONS = [
    { value: "", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
];

type Params = { get(name: string): string | null };

const SORT_KEYS = new Set<string>(SORTS.map((s) => s.value));

export function parseFilters(p: Params): Filters {
    const sort = p.get("sort") || "recommended";
    return {
        q: p.get("q") || "",
        city: p.get("location") || "",
        minPrice: p.get("minPrice") || "",
        maxPrice: p.get("maxPrice") || "",
        beds: p.get("bedrooms") || "",
        baths: p.get("bathrooms") || "",
        type: p.get("propertyType") || "",
        sort: (SORT_KEYS.has(sort) ? sort : "recommended") as SortKey,
    };
}

/** Query string the CMS search endpoint understands (type, baths and sort are applied in the browser). */
export function toApiQuery(f: Filters): string {
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.city) p.set("location", f.city);
    if (f.minPrice) p.set("minPrice", f.minPrice);
    if (f.maxPrice) p.set("maxPrice", f.maxPrice);
    if (f.beds) p.set("bedrooms", f.beds);
    return p.toString();
}

/** Query string for the page URL; defaults are omitted so the plain page keeps a clean URL. */
export function toUrlQuery(f: Filters): string {
    const p = new URLSearchParams(toApiQuery(f));
    if (f.baths) p.set("bathrooms", f.baths);
    if (f.type) p.set("propertyType", f.type);
    if (f.sort !== "recommended") p.set("sort", f.sort);
    return p.toString();
}

/** Which budget preset the current min/max correspond to ("" for none, "custom" for a range we don't list). */
export function budgetValue(f: Pick<Filters, "minPrice" | "maxPrice">): string {
    if (!f.minPrice && !f.maxPrice) return "";
    const hit = BUDGETS.find((b) => b.value && b.min === f.minPrice && b.max === f.maxPrice);
    return hit ? hit.value : "custom";
}

export function activeFilterCount(f: Filters): number {
    return [f.q, f.city, f.minPrice || f.maxPrice, f.beds, f.baths, f.type].filter(Boolean).length;
}

/** Filters the API doesn't handle, plus ordering. Keeps the API's own order for "recommended" (featured first). */
export function applyClientSide(items: Property[], f: Filters): Property[] {
    let out = items;
    if (f.baths) out = out.filter((p) => p.bathrooms >= parseInt(f.baths, 10));
    if (f.type) {
        const t = f.type.toLowerCase();
        out = out.filter((p) => p.title.toLowerCase().includes(t) || (p.description || "").toLowerCase().includes(t));
    }
    switch (f.sort) {
        case "price-asc":
            return [...out].sort((a, b) => a.price - b.price);
        case "price-desc":
            return [...out].sort((a, b) => b.price - a.price);
        case "beds-desc":
            return [...out].sort((a, b) => b.bedrooms - a.bedrooms);
        default:
            return out;
    }
}

/** "Bandra West, Mumbai" -> "Mumbai". */
export function cityOf(location: string): string {
    const parts = location.split(",");
    return parts[parts.length - 1].trim();
}
