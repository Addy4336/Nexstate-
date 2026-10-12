"use client"
import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, ImageOff, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { processImageUrls } from '@/lib/image-utils';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface GalleryPhoto {
    src: string;
    alt: string;
    category: string;
}

export default function PropertyPhotosPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
    const { slug, id } = use(params);

    // Format slug for display
    const propertyName = slug
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Property';

    const [selectedCategory, setSelectedCategory] = useState("All Photos");
    const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [propertyTitle, setPropertyTitle] = useState(propertyName);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Fetch property data from API
    useEffect(() => {
        async function fetchPropertyImages() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch property');
                }

                const result = await response.json();

                if (!result.success || !result.data) {
                    throw new Error(result.error || 'Property not found');
                }

                const property = result.data;

                // Set property title
                if (property.title) {
                    setPropertyTitle(property.title);
                }

                // Collect all images
                const images: string[] = [];

                // Add cover images first
                if (property.cover_image && Array.isArray(property.cover_image)) {
                    images.push(...property.cover_image);
                }

                // Add additional images
                if (property.images && Array.isArray(property.images)) {
                    images.push(...property.images);
                }

                // Process images: filter empty values, convert Google Drive URLs, remove duplicates
                const uniqueImages = processImageUrls(images);

                // Format images for gallery
                const formattedPhotos: GalleryPhoto[] = uniqueImages.map((src, index) => {
                    return {
                        src: src,
                        alt: `${property.title || propertyName} - Photo ${index + 1}`,
                        category: "All Photos"
                    };
                });

                setGalleryPhotos(formattedPhotos);
            } catch (err) {
                console.error('Error fetching property images:', err);
                setError(err instanceof Error ? err.message : 'Failed to load images');
            } finally {
                setLoading(false);
            }
        }

        fetchPropertyImages();
    }, [id, propertyName]);

    const handleImageError = (index: number, src: string) => {
        console.error(`Failed to load image ${index + 1}:`, src);
        setFailedImages(prev => new Set(prev).add(index));
    };

    // Lightbox handlers
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const categories = ["All Photos"];
    const filteredPhotos = galleryPhotos.filter(photo => photo.category === selectedCategory);

    const goToPrevious = useCallback(() => {
        setLightboxIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goToNext = useCallback(() => {
        setLightboxIndex((prev) => Math.min(filteredPhotos.length - 1, prev + 1));
    }, [filteredPhotos.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    if (lightboxIndex > 0) goToPrevious();
                    break;
                case 'ArrowRight':
                    if (lightboxIndex < filteredPhotos.length - 1) goToNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, goToPrevious, goToNext, lightboxIndex, filteredPhotos.length]);

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="max-w-[1224px] w-full mx-auto px-4 xl:px-0 py-8">
                <div className="relative flex items-center justify-center mb-8">
                    <Link
                        href={`/properties/${slug}/${id}`}
                        className="absolute left-0 p-2 hover:bg-accent rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-semibold text-center">{propertyTitle}</h1>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                ? 'border-black text-black font-medium bg-transparent shadow-sm'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {category} {galleryPhotos.length > 0 && `(${galleryPhotos.length})`}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading photos...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ImageOff className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">Failed to load photos</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && galleryPhotos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ImageOff className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No photos available for this property</p>
                    </div>
                )}

                {/* Photos Grid */}
                {!loading && !error && filteredPhotos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredPhotos.map((photo, index) => (
                            <div
                                key={index}
                                className="aspect-[4/3] relative rounded-xl overflow-hidden group bg-muted cursor-pointer"
                                onClick={() => !failedImages.has(index) && openLightbox(index)}
                            >
                                {failedImages.has(index) ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-muted">
                                        <ImageOff className="w-8 h-8 text-muted-foreground mb-2" />
                                        <p className="text-xs text-muted-foreground text-center break-all">
                                            Failed to load: {photo.src.substring(0, 50)}...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={photo.src}
                                            alt={photo.alt}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                            onError={() => handleImageError(index, photo.src)}
                                        />
                                        {/* Zoom overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && filteredPhotos.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
                        {lightboxIndex + 1} / {filteredPhotos.length}
                    </div>

                    {/* Previous button - hidden on first image */}
                    {lightboxIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                    )}

                    {/* Next button - hidden on last image */}
                    {lightboxIndex < filteredPhotos.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    )}

                    {/* Main content container - vertical layout */}
                    <div
                        className="flex flex-col items-center gap-4 max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Main image */}
                        <div className="flex-1 flex items-center justify-center min-h-0">
                            <img
                                src={filteredPhotos[lightboxIndex]?.src}
                                alt={filteredPhotos[lightboxIndex]?.alt}
                                className="max-w-[90vw] max-h-[70vh] object-contain rounded-lg animate-in fade-in zoom-in-95 duration-200"
                            />
                        </div>

                        {/* Thumbnail strip below the image */}
                        {filteredPhotos.length > 1 && (
                            <div className="flex gap-2 px-4 py-3 bg-black/50 rounded-xl max-w-[90vw] overflow-x-auto scrollbar-hide">
                                {filteredPhotos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(index);
                                        }}
                                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 border-2 ${index === lightboxIndex
                                            ? 'border-white scale-105'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={photo.src}
                                            alt={photo.alt}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

