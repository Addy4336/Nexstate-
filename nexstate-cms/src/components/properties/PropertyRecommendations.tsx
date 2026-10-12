"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
    TrendingUp,
    Sparkles,
    DollarSign,
    MapPin,
    Bed,
    Bath,
    ArrowRight,
    Star,
} from "lucide-react";

export interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    cover_image?: string;
    property_type?: string;
    amenities?: string[];
}

interface PropertyRecommendationsProps {
    currentProperty?: Property;
    userSearchCriteria?: {
        location?: string;
        budgetMax?: number;
        propertyType?: string;
    };
    similarProperties?: Property[];
    upgradeOptions?: Property[];
    budgetAlternatives?: Property[];
    popularInArea?: Property[];
}

// Recommendation scoring logic
export function scorePropertyRelevance(
    property: Property,
    criteria: {
        location?: string;
        budgetMin?: number;
        budgetMax?: number;
        propertyType?: string;
        amenities?: string[];
    }
): number {
    let score = 0;

    // Location match (highest weight)
    if (criteria.location && property.location.toLowerCase().includes(criteria.location.toLowerCase())) {
        score += 30;
    }

    // Budget match
    if (criteria.budgetMin && criteria.budgetMax) {
        const priceInRange = property.price >= criteria.budgetMin && property.price <= criteria.budgetMax;
        if (priceInRange) score += 25;
    }

    // Property type match
    if (criteria.propertyType && property.property_type === criteria.propertyType) {
        score += 20;
    }

    // Amenities match
    if (criteria.amenities && property.amenities) {
        const matchingAmenities = criteria.amenities.filter((a) =>
            property.amenities?.includes(a)
        ).length;
        score += matchingAmenities * 5;
    }

    return score;
}

// Get upgrade recommendations (10-30% higher price)
export function getUpgradeOptions(
    properties: Property[],
    currentPrice: number,
    maxResults: number = 4
): Property[] {
    const minUpgradePrice = currentPrice * 1.1;
    const maxUpgradePrice = currentPrice * 1.3;

    return properties
        .filter((p) => p.price >= minUpgradePrice && p.price <= maxUpgradePrice)
        .slice(0, maxResults);
}

// Get budget alternatives (10-30% lower price)
export function getBudgetAlternatives(
    properties: Property[],
    currentPrice: number,
    maxResults: number = 4
): Property[] {
    const minPrice = currentPrice * 0.7;
    const maxPrice = currentPrice * 0.9;

    return properties
        .filter((p) => p.price >= minPrice && p.price <= maxPrice)
        .slice(0, maxResults);
}

// Property Card Component
function PropertyCard({
    property,
    badge,
    badgeColor = "default",
}: {
    property: Property;
    badge?: string;
    badgeColor?: "default" | "success" | "warning";
}) {
    const badgeColors = {
        default: "bg-blue-500",
        success: "bg-green-500",
        warning: "bg-amber-500",
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-[4/3]">
                {property.cover_image ? (
                    <Image
                        src={property.cover_image}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                    </div>
                )}
                {badge && (
                    <Badge className={`absolute top-2 left-2 ${badgeColors[badgeColor]}`}>
                        {badge}
                    </Badge>
                )}
            </div>
            <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-accent">
                        AED {property.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {property.bedrooms}
                        </span>
                        <span className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {property.bathrooms}
                        </span>
                    </div>
                </div>
                <Link href={`/properties/${property.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

// Main Recommendations Component
export function PropertyRecommendations({
    currentProperty,
    similarProperties = [],
    upgradeOptions = [],
    budgetAlternatives = [],
    popularInArea = [],
}: PropertyRecommendationsProps) {
    const hasRecommendations =
        similarProperties.length > 0 ||
        upgradeOptions.length > 0 ||
        budgetAlternatives.length > 0 ||
        popularInArea.length > 0;

    if (!hasRecommendations) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Similar Properties */}
            {similarProperties.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-bold">Similar Properties</h2>
                        </div>
                        <Link href="/properties" className="text-sm text-accent hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {similarProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                badge="Similar"
                                badgeColor="default"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Upgrade Options */}
            {upgradeOptions.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-bold">Upgrade Your Stay</h2>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {upgradeOptions.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                badge="Premium"
                                badgeColor="success"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Budget Alternatives */}
            {budgetAlternatives.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-amber-500" />
                            <h2 className="text-xl font-bold">Budget-Friendly Options</h2>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {budgetAlternatives.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                badge="Great Value"
                                badgeColor="warning"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Popular in Area */}
            {popularInArea.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            <h2 className="text-xl font-bold">Popular in This Area</h2>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {popularInArea.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
