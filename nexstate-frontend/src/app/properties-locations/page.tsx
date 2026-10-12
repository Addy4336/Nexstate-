'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, MapPin, ArrowRight, Search } from 'lucide-react';

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

interface LocationResponse {
    success: boolean;
    data: string[];
    error?: string;
}

export default function PropertiesLocations() {
    const [locations, setLocations] = useState<string[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
                    setFilteredLocations(uniqueLocations);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredLocations(locations);
        } else {
            const filtered = locations.filter(loc =>
                loc.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredLocations(filtered);
        }
    }, [searchQuery, locations]);

    // Function to get image based on location name
    const getLocationImage = (location: string) => {
        const normalized = location.toLowerCase();

        if (normalized.includes('palm')) return "https://plus.unsplash.com/premium_photo-1690552679183-87f6b74dc4c1?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('marina')) return "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('downtown')) return "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('hills')) return "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('business')) return "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('jumeirah')) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60";
        if (normalized.includes('creek')) return "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=800&auto=format&fit=crop&q=60";

        // Default fallback
        return "https://images.unsplash.com/photo-1717168689326-36fa63a3b177?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGR1YmFpJTIwYmx1ZSUyMHdhdGVyc3xlbnwwfHwwfHx8MA%3D%3D";
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Redesigned Hero Section */}
            <section className="relative px-6 pt-32 pb-2 md:pt-40  flex flex-col items-center justify-center bg-background overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-70 pointer-events-none" />
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium tracking-widest uppercase border border-secondary/20">
                        <MapPin className="w-3 h-3" /> Exclusive Locations
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                        Find Your Perfect <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">Neighborhood</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Explore Dubai&apos;s most sought-after communities. From waterfront living to urban luxury, find the location that suits your lifestyle.
                    </p>

                    {/* Integrated Search Bar */}
                    <div className="max-w-xl mx-auto w-full relative mt-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative bg-background border border-border rounded-2xl shadow-lg flex items-center p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search className="w-5 h-5 text-muted-foreground ml-3" />
                            <input
                                type="text"
                                placeholder="Search areas like 'Downtown' or 'Marina'..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground/70"
                            />
                            <div className="hidden sm:flex items-center gap-1 pr-2">
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border/50">
                                    {filteredLocations.length} Areas
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Content Section */}
            <section className="px-6 pb-24 lg:px-8 max-w-[100rem] mx-auto">
                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-16 opacity-50" />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredLocations.map((location, index) => (
                            <Link
                                key={index}
                                href={`/properties/${location.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                            >
                                {/* Background Image */}
                                <Image
                                    src={getLocationImage(location)}
                                    alt={location}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Top Left Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-black text-xs font-bold shadow-sm">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <span>Exclusive</span>
                                    </span>
                                </div>

                                {/* Bottom Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4">
                                    <h3 className="text-2xl font-bold text-white leading-tight">
                                        {location}
                                    </h3>

                                    <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 w-fit group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        Explore
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredLocations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Search className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No locations found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            We couldn&apos;t find any locations matching &quot;{searchQuery}&quot;. Try generic terms like &quot;Marina&quot; or &quot;Palm&quot;.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
