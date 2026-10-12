import React from 'react';
import Image from "next/image";

const PROPERTIES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop",
        title: "The Smart Studio",
        info: "Business Bay, Dubai",
        tag: "Instant Booking Available"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop",
        title: "Tech-Ready 1BHK",
        info: "Dubai Marina",
        tag: "Fully Managed by AI"
    }
];

export default function ExploreProperties() {
    return (
        <section className="bg-background py-16 md:py-28 overflow-hidden">
            <div className="container mx-auto px-4 md:px-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-16 mb-10 md:mb-16 text-center md:text-left">
                    <div className="w-full md:w-1/2">
                        <span className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide uppercase block mb-2 md:mb-3">
                            We'll Find You A Home
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground leading-tight">
                            Explore AI-Managed Homes
                        </h2>
                    </div>

                    <div className="w-full md:w-1/2 md:pt-8">
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto md:mx-0">
                            Live smarter in homes optimized by technology.
                        </p>
                    </div>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {PROPERTIES.map((property) => (
                        <div key={property.id} className="group cursor-pointer">
                            {/* Card Image Wrapper */}
                            <div className="relative aspect-[5/4] sm:aspect-[4/3] overflow-hidden rounded-[2rem] shadow-sm group-hover:shadow-2xl transition-all duration-500 w-full mb-6">
                                {/* Tag Overlay */}
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-[#23527C] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                        {property.tag}
                                    </span>
                                </div>

                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />

                                {/* Dark Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Floating Action Button */}
                                <div className="absolute bottom-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 hover:bg-[#23527C] hover:border-[#23527C] text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7 7 17 7 17 17"></polyline>
                                    </svg>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="pl-2">
                                <div className="flex flex-col">
                                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-[#23527C] transition-colors duration-300 mb-2">
                                        {property.title}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="h-px w-8 bg-muted-foreground/30"></span>
                                        <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
                                            {property.info}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
