'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Property, ApiResponse } from '@/types/property';
import { PropertyCard } from './PropertyCard';

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

export default function PremierHouses() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                // Fetch all public available properties, limit 6
                const response = await fetch(`${CMS_API_URL}/api/properties?limit=6`, {
                    cache: 'no-store'
                });

                if (response.ok) {
                    const data: ApiResponse = await response.json();
                    if (data.success) {
                        setProperties(data.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching featured properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProperties();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-background px-6 lg:px-8">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (properties.length === 0) {
        return null; // or hide section if no properties
    }

    return (
        <section className="py-20 bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground mb-4">
                            Explore our premier houses
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Each listing offers unique features, exceptional quality, and prime locations, ensuring an exclusive living experience.
                        </p>
                    </div>
                    <Link href="/properties">
                        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                            See All Properties <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>

            </div>
        </section>
    );
}
