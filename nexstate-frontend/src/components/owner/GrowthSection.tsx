'use client';

import { brand } from "@nexstate/brand";
import Image from 'next/image';
import { ArrowUpRight, Play, MapPin, TrendingUp } from 'lucide-react';

const featuredProperties = [
    {
        title: "Short & Mid-Term Focus",
        location: "Peak Season Optimization",
        price: "High Yield",
        yield: `Up to ${brand.claims.yieldUplift}`,
        beds: "Daily",
        baths: "Monthly",
    },
    {
        title: "Long-Term Rental",
        location: "Steady Occupancy",
        price: "Stable Income",
        yield: "Guaranteed",
        beds: "Yearly",
        baths: "Lease",
    },
];

export default function GrowthSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-24 px-4 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">

                {/* Centered Heading */}
                <div className="text-center max-w-4xl mx-auto space-y-4 md:space-y-6">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-medium border border-secondary/20">
                        Testimonials
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.2]">
                        Owner Video<br className="hidden md:block" />
                        Testimonials
                    </h2>
                </div>

                {/* Video/Image Container */}
                <div className="w-full relative aspect-video md:aspect-[2.4/1] rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl">
                    {/* Background Image */}
                    <Image
                        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop"
                        alt="Owner Testimonial"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20 relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center pl-1 shadow-2xl">
                                <Play fill="currentColor" className="text-primary w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Content Row */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8 pt-0 md:pt-4">

                    {/* Left Description */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-12 max-w-2xl">
                        <span className="text-primary font-medium text-base md:text-lg whitespace-nowrap pt-1 flex items-center gap-2">
                            <TrendingUp size={18} className="md:w-5 md:h-5" />
                            Performance
                        </span>
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                            With {brand.name}, your property is positioned to achieve optimal performance, no matter the season or market conditions.
                        </p>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 w-full lg:w-auto">
                        <button className="flex-1 sm:flex-none justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 dark:shadow-none whitespace-nowrap text-sm sm:text-base">
                            Watch Stories <ArrowUpRight size={18} />
                        </button>
                    </div>

                </div>

                {/* Property Listings & Image Section */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 pt-8 md:pt-20 border-t border-border mt-8 md:mt-12">

                   
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-4 md:space-y-6 order-2 lg:order-1">
                        <h3 className="text-xl font-semibold mb-4">Rental Strategies</h3>

                        {featuredProperties.map((property, index) => (
                            <div key={index} className="group cursor-pointer p-4 md:p-5 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">{property.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs md:text-sm">
                                            <MapPin size={14} />
                                            {property.location}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all flex-shrink-0">
                                        <ArrowUpRight size={16} className="md:w-[18px] md:h-[18px]" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                                    <span className="text-primary font-semibold text-base md:text-lg">{property.price}</span>
                                    <span className="text-xs px-2 md:px-3 py-1 md:py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full font-medium">{property.yield}</span>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="lg:col-span-4 relative flex justify-center order-1 lg:order-2">
                       
                        <svg className="absolute w-0 h-0" aria-hidden="true">
                            <defs>
                                <clipPath id="center-image-mask" clipPathUnits="objectBoundingBox">
                                    <path d="
                                        M 0 0.15 
                                        Q 0 0 0.15 0 
                                        L 0.85 0 
                                        Q 1 0 1 0.15 
                                        L 1 0.85 
                                        Q 1 1 0.85 1 
                                        L 0.25 1 
                                        Q 0.15 1 0.15 0.9
                                        L 0.15 0.85
                                        Q 0.15 0.75 0.05 0.75
                                        L 0 0.75
                                        Z
                                    " />
                                </clipPath>
                            </defs>
                        </svg>

                        <div className="relative w-full aspect-square max-w-md">
                            <div className="absolute inset-0 w-full h-full transform transition-transform hover:scale-[1.02] duration-500">
                                <div
                                    className="w-full h-full relative overflow-hidden bg-primary/10"
                                    style={{
                                        clipPath: 'url(#center-image-mask)',
                                        WebkitClipPath: 'url(#center-image-mask)',
                                    }}
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"
                                        alt="Luxury Property"
                                        fill
                                        className="object-cover"
                                    />
                                 
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                
                    <div className="lg:col-span-3 flex flex-col justify-center gap-6 md:gap-8 lg:pl-4 order-3">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground leading-tight">
                            Your Partner <br /> in Property
                        </h3>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary"></div>
                                <span className="text-foreground font-medium text-sm md:text-base">{brand.claims.occupancy} Occupancy Rate</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary"></div>
                                <span className="text-foreground font-medium text-sm md:text-base">RERA Licensed</span>
                            </div>
                        </div>
                    </div>

                </div> */}

            </div>
        </section>
    );
}
