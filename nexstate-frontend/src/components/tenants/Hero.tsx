"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Bed, Bath, MapPin, Loader2, Star, X, Home } from 'lucide-react';

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Property interface
interface Property {
    id: string;
    title: string;
    description: string | null;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number | null;
    status: string;
    images: string[] | null;
    cover_image: string[] | null;
    featured: boolean;
    amenities: string[] | null;
}

// Price range options with min/max values
const PRICE_RANGES = [
    { value: '0-5000', label: 'Under AED 5,000', min: 0, max: 5000 },
    { value: '5000-10000', label: 'AED 5,000 - 10,000', min: 5000, max: 10000 },
    { value: '10000-20000', label: 'AED 10,000 - 20,000', min: 10000, max: 20000 },
    { value: '20000-50000', label: 'AED 20,000 - 50,000', min: 20000, max: 50000 },
    { value: '50000+', label: 'AED 50,000+', min: 50000, max: undefined },
];

// Helper functions
function getPropertyImage(property: Property): string {
    if (property.cover_image && property.cover_image.length > 0) {
        return property.cover_image[0];
    }
    if (property.images && property.images.length > 0) {
        return property.images[0];
    }
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60';
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function Hero() {
    // Search form state
    const [propertyType, setPropertyType] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [bedrooms, setBedrooms] = useState('');

    // Dynamic locations from API
    const [locations, setLocations] = useState<string[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(true);

    // Search results state
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref for scrolling to results
    const resultsRef = useRef<HTMLDivElement>(null);

    // Fetch locations from API
    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await fetch(`${CMS_API_URL}/api/properties/meta/locations`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        setLocations(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoadingLocations(false);
            }
        }
        fetchLocations();
    }, []);

    // Handle tag click to set property type
    const handleTagClick = (tag: string) => {
        const tagToType: Record<string, string> = {
            'House': 'house',
            'Apartment': 'apartment',
            'Villa': 'villa',
        };
        setPropertyType(tagToType[tag] || '');
    };

    // Handle search submit
    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // Build query parameters for API
            const params = new URLSearchParams();

            if (location) params.append('location', location);

            // Parse price range to minPrice and maxPrice
            if (price) {
                const priceRange = PRICE_RANGES.find(r => r.value === price);
                if (priceRange) {
                    if (priceRange.min !== undefined) params.append('minPrice', priceRange.min.toString());
                    if (priceRange.max !== undefined) params.append('maxPrice', priceRange.max.toString());
                }
            }

            // Handle bedrooms
            if (bedrooms) {
                if (bedrooms === 'studio') {
                    params.append('bedrooms', '0');
                } else if (bedrooms === '5+') {
                    params.append('bedrooms', '5');
                } else {
                    params.append('bedrooms', bedrooms);
                }
            }

            const response = await fetch(`${CMS_API_URL}/api/properties/search?${params.toString()}`);

            if (!response.ok) throw new Error('Failed to fetch properties');

            const data = await response.json();

            if (data.success) {
                let filtered = data.data;

                // Apply property type filter client-side
                if (propertyType) {
                    filtered = filtered.filter((p: Property) =>
                        p.title.toLowerCase().includes(propertyType.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(propertyType.toLowerCase()))
                    );
                }

                setProperties(filtered);

                // Scroll to results after a short delay
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                throw new Error(data.error || 'Failed to fetch properties');
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    // Clear search results
    const clearSearch = () => {
        setHasSearched(false);
        setProperties([]);
        setPropertyType('');
        setPrice('');
        setLocation('');
        setBedrooms('');
    };

    return (
        <>
            <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
                {/* Background Video */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute w-full h-full object-cover"
                    >
                        <source src="/video/bg_video.mp4" type="video/mp4" />
                    </video>
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/30" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 md:pb-8">

                    {/* Hero Text Section */}
                    <div className="flex-1 flex flex-col relative top-4 sm:top-8  justify-center">
                        {/* Tags - Clickable to set property type */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                            {['House', 'Apartment', 'Villa'].map((tag) => {
                                const tagToType: Record<string, string> = {
                                    'House': 'house',
                                    'Apartment': 'apartment',
                                    'Villa': 'villa',
                                };
                                const isActive = propertyType === tagToType[tag];
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-sm ${isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 lg:gap-8">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.15] sm:leading-[1.1]">
                                AI-Powered Network of <br className="hidden xs:block" /> Fully Furnished Rented Homes in Dubai
                            </h1>

                            <p className="max-w-lg text-white/80 text-xs sm:text-sm leading-relaxed lg:text-right lg:pb-2">
                                Flexible living for modern residents and higher, hassle-free returns for property owners – powered by intelligent operations, hotel-grade standards, and a fully digital experience.
                            </p>
                        </div>
                    </div>

                    {/* Search Card Section */}
                    <div className="bg-background rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl w-full mt-4 sm:mt-8">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4">Find the best place</h2>

                        {/* Search Fields Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">

                            {/* Looking For */}
                            <div className="space-y-1">
                                <label className="text-[10px] sm:text-xs font-semibold text-foreground block">Looking for</label>
                                <Select value={propertyType} onValueChange={setPropertyType}>
                                    <SelectTrigger className="w-full bg-muted border-border rounded-md sm:rounded-lg h-9 sm:h-10 text-xs sm:text-sm">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="house">House</SelectItem>
                                        <SelectItem value="apartment">Apartment</SelectItem>
                                        <SelectItem value="villa">Villa</SelectItem>
                                        <SelectItem value="penthouse">Penthouse</SelectItem>
                                        <SelectItem value="studio">Studio</SelectItem>
                                        <SelectItem value="townhouse">Townhouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price */}
                            <div className="space-y-1">
                                <label className="text-[10px] sm:text-xs font-semibold text-foreground block">Price</label>
                                <Select value={price} onValueChange={setPrice}>
                                    <SelectTrigger className="w-full bg-muted border-border rounded-md sm:rounded-lg h-9 sm:h-10 text-xs sm:text-sm">
                                        <SelectValue placeholder="Select Price" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-5000">Under AED 5,000</SelectItem>
                                        <SelectItem value="5000-10000">AED 5,000 - 10,000</SelectItem>
                                        <SelectItem value="10000-20000">AED 10,000 - 20,000</SelectItem>
                                        <SelectItem value="20000-50000">AED 20,000 - 50,000</SelectItem>
                                        <SelectItem value="50000+">AED 50,000+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Locations - Dynamic from API */}
                            <div className="space-y-1">
                                <label className="text-[10px] sm:text-xs font-semibold text-foreground block">Locations</label>
                                <Select value={location} onValueChange={setLocation} disabled={loadingLocations}>
                                    <SelectTrigger className="w-full bg-muted border-border rounded-md sm:rounded-lg h-9 sm:h-10 text-xs sm:text-sm">
                                        <SelectValue placeholder={loadingLocations ? "Loading..." : "Select Location"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.length > 0 ? (
                                            locations.map((loc) => (
                                                <SelectItem key={loc} value={loc}>
                                                    {loc}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-locations" disabled>
                                                No locations available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Number of rooms */}
                            <div className="space-y-1">
                                <label className="text-[10px] sm:text-xs font-semibold text-foreground block">Number of rooms</label>
                                <Select value={bedrooms} onValueChange={setBedrooms}>
                                    <SelectTrigger className="w-full bg-muted border-border rounded-md sm:rounded-lg h-9 sm:h-10 text-xs sm:text-sm">
                                        <SelectValue placeholder="Select Bedrooms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="studio">Studio</SelectItem>
                                        <SelectItem value="1">1 Bedroom</SelectItem>
                                        <SelectItem value="2">2 Bedrooms</SelectItem>
                                        <SelectItem value="3">3 Bedrooms</SelectItem>
                                        <SelectItem value="4">4 Bedrooms</SelectItem>
                                        <SelectItem value="5+">5+ Bedrooms</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                        {/* Footer with Search Button */}
                        <div className="flex justify-end gap-3 pt-2 sm:pt-3 border-t border-border">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-primary text-primary-foreground px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold hover:bg-primary/90 transition-all shadow-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    'Search Properties'
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Search Results Section */}
            {hasSearched && (
                <section ref={resultsRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                                    {loading ? 'Searching...' : `${properties.length} Properties Found`}
                                </h2>
                                <p className="text-muted-foreground text-sm mt-1">
                                    {propertyType && <span className="capitalize">{propertyType}</span>}
                                    {location && <span> in {location}</span>}
                                    {price && <span> • {PRICE_RANGES.find(r => r.value === price)?.label}</span>}
                                    {bedrooms && <span> • {bedrooms === 'studio' ? 'Studio' : `${bedrooms}+ beds`}</span>}
                                </p>
                            </div>
                            <button
                                onClick={clearSearch}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full hover:bg-background"
                            >
                                <X className="w-4 h-4" />
                                Clear Search
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground mb-4">{error}</p>
                                <button onClick={handleSearch} className="text-primary underline">
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && properties.length === 0 && (
                            <div className="text-center py-20">
                                <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-foreground mb-2">No properties found</h3>
                                <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                                <button onClick={clearSearch} className="text-primary underline">
                                    Clear filters
                                </button>
                            </div>
                        )}

                        {/* Properties Grid */}
                        {!loading && !error && properties.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {properties.map((property) => (
                                    <Link
                                        key={property.id}
                                        href={`/properties/${property.location.toLowerCase().replace(/\s+/g, '-')}/${property.id}`}
                                        className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={getPropertyImage(property)}
                                                alt={property.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Featured Badge */}
                                            {property.featured && (
                                                <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <Star className="w-3 h-3" />
                                                    Featured
                                                </div>
                                            )}

                                            {/* Price Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                                <p className="text-white text-xl font-bold">
                                                    {formatPrice(property.price)}
                                                    <span className="text-sm font-normal text-white/80">/month</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-4 sm:p-5 space-y-3">
                                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                {property.title}
                                            </h3>

                                            {/* Location */}
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span className="line-clamp-1">{property.location}</span>
                                            </p>

                                            {/* Features */}
                                            <div className="flex items-center gap-4 pt-2 border-t border-border">
                                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Bed className="w-4 h-4" />
                                                    {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Bath className="w-4 h-4" />
                                                    {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                                                </span>
                                                {property.area_sqft && (
                                                    <span className="text-sm text-muted-foreground">
                                                        {property.area_sqft.toLocaleString()} sqft
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* View All Properties Link */}
                        {!loading && properties.length > 0 && (
                            <div className="text-center mt-10">
                                <Link
                                    href="/properties"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                                >
                                    View All Properties
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}
