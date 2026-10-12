import { brand } from "@nexstate/brand";
import { Suspense } from 'react';
import { getFilteredProperties } from "@/lib/properties";
import { PropertySearch } from "@/components/user/PropertySearch";
import { PropertyCard } from "@/components/user/PropertyCard";
import { Loader2 } from "lucide-react";

export const metadata = {
    title: `Available Properties | ${brand.name}`,
    description: "Browse our curated selection of furnished homes in Dubai.",
};

interface PropertiesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const params = await searchParams;

    const query = typeof params.query === 'string' ? params.query : undefined;
    const location = typeof params.location === 'string' ? params.location : undefined;
    const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined;
    const bedrooms = typeof params.bedrooms === 'string' ? parseInt(params.bedrooms) : undefined;

    const properties = await getFilteredProperties({
        query,
        location,
        minPrice,
        maxPrice,
        bedrooms
    });

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container px-4 md:px-6">
                <div className="max-w-xl mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Next Home</h1>
                    <p className="text-muted-foreground">
                        Search through our hand-picked selection of premium properties.
                    </p>
                </div>

                <Suspense fallback={<div className="h-20 bg-muted/50 rounded-xl animate-pulse" />}>
                    <PropertySearch />
                </Suspense>

                {properties.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Loader2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No properties found</h3>
                        <p className="text-muted-foreground text-center max-w-sm mt-1">
                            Try adjusting your search filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
