"use client";

import { brand } from "@nexstate/brand";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { NumberTicker } from '@/components/ui/number-ticker';
import Link from 'next/link';

const getPropertyImage = (property: any): string => {
    if (property.cover_image && property.cover_image.length > 0) return property.cover_image; // Should be string, but API might return array - check backend if needed, assuming array usually based on others, but usually cover_image is string. Let's look at api: cover_image is likely string or array of strings? In supabase it's usually text[]. Wait, typical supabase is text[]? Let's assume string for cover_image based on usage, or check usage. In `properties.ts` it selects `*`. Let's assume standard handling. 
    // Actually, looking at `src/app/properties/page.tsx`:
    // if (property.cover_image && property.cover_image.length > 0) return property.cover_image[0];

    // BUT! In `properties.ts`: `console.log("Sample property images:", JSON.stringify({ images: data[0].images, cover_image: data[0].cover_image ...`
    // If cover_image is a single string (URL), .length > 0 works. If it's an array, it also works.

    // Let's use a robust fallback logic:
    if (Array.isArray(property.cover_image) && property.cover_image.length > 0) return property.cover_image[0];
    if (typeof property.cover_image === 'string' && property.cover_image) return property.cover_image;

    if (Array.isArray(property.images) && property.images.length > 0) return property.images[0];

    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60"; // Valid fallback
};

export default function PropertyShowcase() {
    const [slides, setSlides] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_URL}/api/properties?limit=5`);
                const result = await response.json();

                if (result.success && result.data.length > 0) {
                    const mappedSlides = result.data.map((p: any) => {
                        const mainImage = getPropertyImage(p);
                        // Construct gallery: Main image + other images, filtered for validity
                        const rawImages = [mainImage, ...(Array.isArray(p.images) ? p.images : [])];
                        // Unique and non-empty images
                        const images = Array.from(new Set(rawImages.filter((img: any) => typeof img === 'string' && img.length > 0)));

                        // Ensure at least one image exists
                        if (images.length === 0) images.push("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60");

                        return {
                            id: p.id,
                            slug: p.location ? p.location.toLowerCase().replace(/\s+/g, '-') : 'property',
                            images: images,
                            middleCard: {
                                title: p.title || "Untitled Property",
                                description: p.description || `Experience detailed luxury living with ${brand.name}.`,
                                footerText: `Located in ${p.location || "Dubai"}`
                            },
                            rightCard: {
                                // Try to show the second image for variety, otherwise the main image
                                image: images[1] || images[0],
                                price: p.price ? `${Number(p.price).toLocaleString()} AED` : "Ask for Price"
                            }
                        };
                    });
                    setSlides(mappedSlides);
                }
            } catch (error) {
                console.error("Failed to fetch properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (loading) {
        return (
            <section className="py-20 lg:py-28 bg-background px-6 lg:px-8">
                <div className="max-w-350 mx-auto">
                    <div className="h-20 w-3/4 md:w-1/2 bg-secondary/10 animate-pulse rounded-2xl mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 min-h-[400px]">
                        <div className="md:col-span-2 lg:col-span-6 bg-secondary/10 animate-pulse rounded-[2.5rem] h-[300px] lg:h-full"></div>
                        <div className="lg:col-span-3 bg-secondary/10 animate-pulse rounded-[2.5rem] h-[200px] lg:h-full"></div>
                        <div className="lg:col-span-3 bg-secondary/10 animate-pulse rounded-[2.5rem] h-[200px] lg:h-full"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (slides.length === 0) return null;

    const currentData = slides[currentSlide];
    // Ensure activeImageIndex is within bounds of new data
    const safeImageIndex = activeImageIndex < currentData.images.length ? activeImageIndex : 0;
    const activeImage = currentData.images[safeImageIndex] || currentData.images[0];

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === slides.length - 1;

    const handlePrevious = () => {
        if (!isFirstSlide) {
            setCurrentSlide(prev => prev - 1);
            setActiveImageIndex(0);
        }
    };

    const handleNext = () => {
        if (!isLastSlide) {
            setCurrentSlide(prev => prev + 1);
            setActiveImageIndex(0);
        }
    };

    return (
        <section id="standard-tier" className="py-20 lg:py-28 bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header - Keeps Original Layout but updates Title */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 lg:gap-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground max-w-3xl leading-[1.1]">
                        {brand.name} <span className="text-primary italic">{brand.tiers.standard}.</span> <br />
                        The Essentials Collection.
                    </h2>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-[200px] sm:max-w-[250px] leading-relaxed">
                            Private rooms & co-living spaces for those prioritizing community, affordability, and flexibility.
                        </p>
                    </div>
                </div>

                {/* 3-Column Layout (Original Design) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-16 items-stretch lg:min-h-[300px]">

                    {/* Left Column - Large Image (50%) */}
                    <div className="md:col-span-2 lg:col-span-6 relative h-[300px] lg:h-full rounded-[2.5rem] overflow-hidden group">
                        {activeImage && (
                            <Image
                                src={activeImage}
                                alt="Standard Property"
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-105"
                            />
                        )}
                        {/* Floating Thumbnails */}
                        <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-md p-1.5 rounded-full flex items-center shadow-lg transform transition-transform hover:scale-105 z-10 w-auto max-w-full overflow-x-auto">
                            <div className="flex gap-2 px-1">
                                {currentData.images.slice(0, 4).map((img: string, idx: number) => ( // Limit thumbnails to 4
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${safeImageIndex === idx
                                            ? 'border-primary scale-105 ring-2 ring-primary/20'
                                            : 'border-background hover:scale-105'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            fill
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column (25%) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full min-h-75 lg:min-h-full">
                        {/* Text Card */}
                        <div className="flex-1 bg-secondary/10 rounded-[2.5rem] p-4 flex flex-col justify-center items-center text-center border border-border/10">
                            <h3 className="text-3xl font-medium text-foreground mb-6 leading-tight whitespace-pre-line">
                                {currentData.middleCard.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-8 max-w-60">
                                {currentData.middleCard.description}
                            </p>
                        </div>
                        {/* Footer Text aligned under Middle Col */}
                        <div className="flex-1 max-h-[3.5rem] flex items-end">
                            <p className="text-sm text-muted-foreground leading-relaxed px-2 pb-2">
                                {currentData.middleCard.footerText}
                            </p>
                        </div>
                    </div>

                    {/* Right Column (25%) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full min-h-[300px] lg:min-h-full justify-between">
                        {/* Top Content: Image + Pricing */}
                        <div className="flex-1 flex flex-col gap-3 p-2 bg-foreground/5 rounded-[2.5rem]">
                            {/* Square Image - Constrained width */}
                            <div className="relative aspect-square w-full mb-2 rounded-[2rem] overflow-hidden group px-3">
                                <Image
                                    src={currentData.rightCard.image}
                                    alt="Room Preview"
                                    fill
                                    className="object-cover rounded-[1.5rem] transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Pricing & Button */}
                            <div className="text-center flex flex-col items-center gap-2 pb-1">
                                <p className="text-lg font-medium text-foreground">Pricing Starts at {currentData.rightCard.price}</p>
                                <Link href={`/properties/${currentData.slug}/${currentData.id}`}>
                                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-md group">
                                        Check Availability <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Content: Arrows */}
                        <div className="flex gap-3 justify-center lg:justify-end px-2 pb-2 min-h-14 items-end">
                            <button
                                onClick={handlePrevious}
                                disabled={isFirstSlide}
                                className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-colors bg-background ${isFirstSlide
                                    ? 'opacity-40 cursor-not-allowed'
                                    : 'hover:bg-muted cursor-pointer'
                                    }`}
                            >
                                <ArrowLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isLastSlide}
                                className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-colors bg-background ${isLastSlide
                                    ? 'opacity-40 cursor-not-allowed'
                                    : 'hover:bg-muted cursor-pointer'
                                    }`}
                            >
                                <ArrowRight className="w-5 h-5 text-foreground" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Stats Section (Kept from Original, updated values) */}
                <div className="bg-muted/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14">
                    <div className="flex flex-wrap lg:flex-nowrap justify-between gap-y-8">
                        {[
                            { value: 98, suffix: "%", label: "Occupancy Rate" },
                            { value: 500, suffix: "+", label: "Rooms Managed" },
                            { value: 1500, suffix: "+", label: "Active Tenants" },
                            { value: 4, suffix: ".8/5", label: "Tenant Rating" }
                        ].map((stat, idx) => (
                            <div key={idx} className="flex items-center w-1/2 lg:w-auto">
                                {idx !== 0 && (
                                    <Separator orientation="vertical" className="h-16 sm:h-20 lg:h-24 mr-4 sm:mr-6 lg:mr-10 hidden lg:block" />
                                )}
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight">
                                        <NumberTicker value={stat.value} />{stat.suffix}
                                    </h4>
                                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
