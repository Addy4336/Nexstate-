"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/actions/favorite-actions";
import { PropertyCard } from "@/components/user/PropertyCard";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PublicProperty } from "@/lib/public-property";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<PublicProperty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            setFavorites(await getFavorites());
            setIsLoading(false);
        };
        loadFavorites();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container px-4 md:px-6">
                <div className="max-w-xl mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Properties</h1>
                    <p className="text-muted-foreground">
                        Your favorite properties all in one place.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Heart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
                        <p className="text-muted-foreground text-center max-w-sm mb-6">
                            Browse our properties and click the heart icon to save your favorites here.
                        </p>
                        <Link href="/properties">
                            <Button className="btn-primary">Browse Properties</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
