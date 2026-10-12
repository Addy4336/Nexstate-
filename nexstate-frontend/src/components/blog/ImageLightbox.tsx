'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ImageLightboxProps {
    images: string[];
    coverImage: string;
    title: string;
}

export function ImageLightbox({ images, coverImage, title }: ImageLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Combine cover image with gallery images for the lightbox
    const allImages = [coverImage, ...(images?.filter(img => img !== coverImage) || [])];

    useEffect(() => {
        setMounted(true);
    }, []);

    const openLightbox = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeLightbox = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    }, []);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    }, [allImages.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    }, [allImages.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeLightbox, goToPrevious, goToNext]);

    const lightboxContent = isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
            {/* Close button */}
            <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-[110] px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                {currentIndex + 1} / {allImages.length}
            </div>

            {/* Previous button */}
            {allImages.length > 1 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
                </button>
            )}

            {/* Main image */}
            <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 flex items-center justify-center">
                <div className="relative w-full h-full animate-in fade-in zoom-in-95 duration-300">
                    <Image
                        src={allImages[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                        priority
                    />
                </div>
            </div>

            {/* Next button */}
            {allImages.length > 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
                </button>
            )}

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${index === currentIndex
                                    ? 'ring-2 ring-white scale-105'
                                    : 'opacity-50 hover:opacity-80'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Click backdrop to close */}
            <div
                className="absolute inset-0 z-[99]"
                onClick={closeLightbox}
            />
        </div>
    );

    return (
        <>
            {/* Cover Image - Clickable */}
            <div
                className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-lg bg-muted cursor-pointer group"
                onClick={() => openLightbox(0)}
            >
                <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                />
                {/* Zoom overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 rounded-full bg-white/90 text-foreground shadow-xl transform scale-90 group-hover:scale-100">
                        <ZoomIn className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Gallery Images - Clickable */}
            {allImages.length > 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allImages.slice(1).map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => openLightbox(index + 1)}
                            >
                                <Image
                                    src={image}
                                    alt={`${title} - Image ${index + 2}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Zoom overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 rounded-full bg-white/90 text-foreground shadow-lg transform scale-90 group-hover:scale-100">
                                        <ZoomIn className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox Portal */}
            {mounted && createPortal(lightboxContent, document.body)}
        </>
    );
}
