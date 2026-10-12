"use client";

import { brand } from "@nexstate/brand";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

interface LocationResponse {
    success: boolean;
    data: string[];
    error?: string;
}

const LocationSection = () => {
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(`${CMS_API_URL}/api/properties/meta/locations`);
                if (!response.ok) throw new Error('Failed to fetch locations');

                const result: LocationResponse = await response.json();
                if (result.success) {
                    // Deduplicate and normalize locations
                    const uniqueLocations = Array.from(new Set(
                        result.data.map(loc => {
                            // Normalize: trim, lowercase, then capitalize words
                            return loc.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                        })
                    ));
                    setLocations(uniqueLocations);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Display only first 8 unless showAll is true
    const displayLocations = showAll ? locations : locations.slice(0, 8);
    const hasMore = locations.length > 8;

    // Function to get image based on location name (can be expanded with a mapping object)
    const getLocationImage = (location: string) => {
        // You can add specific mappings here if you have known locations
        const normalized = location.toLowerCase();

        if (normalized.includes('palm')) return "https://plus.unsplash.com/premium_photo-1690552679183-87f6b74dc4c1?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('marina')) return "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('downtown')) return "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('hills')) return "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop";
        if (normalized.includes('business')) return "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60";

        // Default fallback
        return "https://images.unsplash.com/photo-1717168689326-36fa63a3b177?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGR1YmFpJTIwYmx1ZSUyMHdhdGVyc3xlbnwwfHwwfHx8MA%3D%3D";
    };

    return (
        <section className=" bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <span className="text-secondary-foreground font-semibold tracking-widest text-xs uppercase bg-secondary/10 px-3 py-1 rounded-full">
                        Featured Areas
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground">
                        {brand.name} <span className="italic text-primary">Exclusive</span> Locations
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light leading-relaxed">
                        Discover {brand.market.city}&apos;s most prestigious neighborhoods with {brand.name}&apos;s luxury property collections.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No locations found.
                    </div>
                ) : (
                    <>
                        {/* Destinations Grid */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto">
                            {displayLocations.map((location, index) => (
                                <Link
                                    key={index}
                                    // {/* Navigate to properties page with location slug */}
                                    href={`/properties/${location.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="group relative flex flex-col items-center cursor-pointer transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="relative w-32 h-32 md:w-60 md:h-60 rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <Image
                                            src={getLocationImage(location)}
                                            alt={location}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Hover overlay with icon */}
                                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center mt-3 space-y-1">
                                        <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 capitalize">
                                            {location}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All Button */}
                        {hasMore && !showAll && (
                            <div className="flex justify-center mt-12">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setShowAll(true)}
                                    className="group"
                                >
                                    View All Locations
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default LocationSection;
