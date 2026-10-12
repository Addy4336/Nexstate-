'use client';

import { brand } from "@nexstate/brand";
import Image from 'next/image';
import { ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';

const highlights = [
    "Short & Mid-Term Focus",
    "Long-Term Rental Flexibility",
    "Innovative Marketing",
    "Extensive Network",
];

export default function AboutSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">

                {/* Top Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                    <div className="space-y-4 md:space-y-6 max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-medium">
                            Why Choose {brand.name}?
                        </span>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1]">
                            Why {brand.name} is<br />
                            Your Best Choice
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-4 pb-2">
                        <Link    href="/owner#owner-consultation-form">
                        <button className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 dark:shadow-none text-sm sm:text-base">
                            Get Started <ArrowUpRight size={18} />
                        </button>
                        </Link>
                        {/* <button className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-background text-foreground font-medium border border-border shadow-sm hover:bg-muted transition-colors text-sm sm:text-base">
                            Learn more
                        </button> */}
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8 md:space-y-10 w-full">

                        <div className="space-y-4">
                            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Trustable & Easy</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-md text-base sm:text-lg">
                                At {brand.name}, our property management approach is simple. We are dedicated to maintaining honesty, clarity, and trust in every interaction while delivering a seamless and stress-free experience for property owners.
                            </p>
                            <p className="text-muted-foreground leading-relaxed max-w-md text-base sm:text-lg">
                                With {brand.name}, your property is positioned to achieve optimal performance, no matter the season or market conditions.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-3 sm:space-y-4">
                            {highlights.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                    </div>
                                    <span className="text-foreground text-sm sm:text-base">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-8 sm:gap-20 pt-4 sm:pt-8 border-t border-border/50 lg:border-none">
                            <div>
                                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground flex items-start leading-none tracking-tight">
                                    98
                                    <span className="text-primary text-xl sm:text-2xl md:text-3xl mt-1 font-medium">%</span>
                                </div>
                                <p className="text-muted-foreground text-xs sm:text-sm mt-2 sm:mt-3 font-medium">Occupancy Rate</p>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground flex items-start leading-none tracking-tight">
                                    12.5
                                    <span className="text-primary text-xl sm:text-2xl md:text-3xl mt-1 font-medium">%</span>
                                </div>
                                <p className="text-muted-foreground text-xs sm:text-sm mt-2 sm:mt-3 font-medium">Avg. Annual ROI</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Image with Custom Shape */}
                    <div className="flex-1 w-full relative pl-2 pr-2 sm:px-0">
                        {/* Shape Definition */}
                        <svg className="absolute w-0 h-0" aria-hidden="true">
                            <defs>
                                <clipPath id="about-mask-precise" clipPathUnits="objectBoundingBox">
                                    <path d="
                                        M 0.08 0 
                                        L 0.92 0 Q 1 0 1 0.08 
                                        L 1 0.55 Q 1 0.65 0.9 0.65
                                        L 0.8 0.65 Q 0.75 0.65 0.75 0.7
                                        L 0.75 0.92 Q 0.75 1 0.67 1
                                        L 0.08 1 Q 0 1 0 0.92
                                        L 0 0.15 Q 0 0.05 0.05 0.02
                                        L 0.08 0
                                        Z
                                    " />
                                </clipPath>
                            </defs>
                        </svg>

                        <div className="relative w-full aspect-square md:aspect-square lg:aspect-[4/3]">
                            {/* Main Image with Clip Path */}
                            <div className="absolute inset-0 z-10 w-full h-full">
                                <div
                                    className="w-full h-full relative overflow-hidden bg-primary/10"
                                    style={{
                                        clipPath: 'url(#about-mask-precise)',
                                        WebkitClipPath: 'url(#about-mask-precise)',
                                    }}
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800&auto=format&fit=crop"
                                        alt="Luxury Dubai Villa"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-multiply"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
