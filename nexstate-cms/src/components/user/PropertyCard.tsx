"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { PublicProperty } from "@/lib/public-property";
import { getImageUrl } from "@/lib/utils";
import { useState } from "react";
import { FavoriteButton } from "./FavoriteButton";

interface PropertyCardProps {
    property: PublicProperty;
    layout?: "grid" | "list";
}

export function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
    const [imgError, setImgError] = useState(false);
    const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";

    const getPropertyImage = (property: PublicProperty) => {
        if (imgError) return PLACEHOLDER_IMAGE;

        if (property.images && property.images.length > 0 && property.images[0]) {
            return getImageUrl(property.images[0]);
        }
        if (property.cover_image && property.cover_image.length > 0 && property.cover_image[0]) {
            return getImageUrl(property.cover_image[0]);
        }
        return PLACEHOLDER_IMAGE;
    };

    return (
        <Link href={`/properties/${property.id}`} className="block h-full">
            <div className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border card-hover h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={getPropertyImage(property)}
                        alt={property.title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        {property.featured && (
                            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                                Featured
                            </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${property.status === 'available' ? 'bg-green-500/90 text-white' : 'bg-card/90 text-foreground'
                            }`}>
                            {property.status}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-4 right-4">
                        <FavoriteButton propertyId={property.id} variant="icon" />
                    </div>

                    <div className="absolute bottom-4 left-4">
                        <p className="text-primary-foreground font-bold text-xl">
                            AED {property.price.toLocaleString()}<span className="text-sm font-normal opacity-80">/month</span>
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-1">
                        {property.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-accent" />
                        <span className="line-clamp-1">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-border mt-auto">
                        <div className="flex flex-col items-center justify-center text-center">
                            <BedDouble className="w-5 h-5 text-accent mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center border-l border-border">
                            <Bath className="w-5 h-5 text-accent mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center border-l border-border">
                            <Maximize className="w-5 h-5 text-accent mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">{property.area_sqft} sqft</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
