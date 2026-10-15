import type { Metadata } from "next";
import { Suspense } from "react";
import { brand } from "@nexstate/brand";
import { apiGet } from "@/lib/server-api";
import { cityImages } from "@/lib/site-images";
import { cityOf, parseFilters, toApiQuery } from "@/lib/property-filters";
import { PropertiesExplorer } from "@/components/property/PropertiesExplorer";
import type { Property } from "@/types/property";

export const metadata: Metadata = {
    title: "Furnished homes for rent",
    description: `Browse furnished apartments, villas and studios across India with live availability and transparent pricing. ${brand.tagline}.`,
};

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Server-rendered from the URL: the first paint already contains the results (good for SEO and speed),
 * and the client takes over for live filtering after that.
 */
export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams;
    const first = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined)) ?? null;
    const filters = parseFilters({ get: first });
    const key = toApiQuery(filters);

    const [properties, locations] = await Promise.all([
        apiGet<Property[]>(`/properties/search?${key}`, [], 30),
        apiGet<string[]>("/properties/meta/locations", [], 300),
    ]);

    // City filter choices: the cities we market plus any city that actually has a listing.
    const cities = [...new Set([...cityImages.map((c) => (c.name === "Delhi NCR" ? "Delhi" : c.name)), ...locations.map(cityOf)])];

    return (
        <main>
            <Suspense>
                <PropertiesExplorer initialProperties={properties} initialKey={key} cities={cities} />
            </Suspense>
        </main>
    );
}
