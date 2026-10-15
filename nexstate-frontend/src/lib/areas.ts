import { cityOf } from "./property-filters";
import { locationSlug } from "./slug";
import type { Property } from "@/types/property";

export interface Area {
    slug: string;
    name: string; // "Indiranagar"
    city: string; // "Bengaluru"
    count: number;
    fromPrice: number;
}

/** "Bandra West, Mumbai" -> "Bandra West". */
export function areaOf(location: string): string {
    return location.split(",")[0].trim();
}

/** Neighbourhoods that actually have listings, with how many homes and the lowest monthly price. */
export function groupAreas(properties: Property[]): Area[] {
    const map = new Map<string, Area>();
    for (const p of properties) {
        const slug = locationSlug(p.location);
        const prev = map.get(slug);
        if (prev) {
            prev.count += 1;
            prev.fromPrice = Math.min(prev.fromPrice, p.price);
        } else {
            map.set(slug, { slug, name: areaOf(p.location), city: cityOf(p.location), count: 1, fromPrice: p.price });
        }
    }
    return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Readable name from a URL slug when no listing can tell us the real spelling. */
export function nameFromSlug(slug: string): string {
    return decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
