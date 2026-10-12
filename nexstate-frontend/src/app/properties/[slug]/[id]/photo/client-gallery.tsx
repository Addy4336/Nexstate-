"use client"
import { brand } from "@nexstate/brand";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PhotoGalleryProps {
    propertyName: string;
    slug: string;
    id: string;
    params: Promise<{ slug: string, id: string }>;
    galleryPhotos: { src: string; alt: string; category: string }[];
    categories: string[];
}

export function ClientPhotoGallery({ propertyName, slug, id, galleryPhotos, categories }: PhotoGalleryProps) {
    const [selectedCategory, setSelectedCategory] = useState("Property");

    const filteredPhotos = galleryPhotos.filter(photo => photo.category === selectedCategory);

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
                    <h1 className="text-lg font-semibold text-center">{brand.name} - {propertyName}</h1>
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
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotos.map((photo, index) => (
                        <div key={index} className="aspect-[4/3] relative rounded-xl overflow-hidden group bg-muted">
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
