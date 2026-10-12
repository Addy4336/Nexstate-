'use client';

import { brand } from "@nexstate/brand";
import Image from 'next/image';
import { ArrowUpRight, Plus, Star, MapPin, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-8 pb-12 lg:pt-4 lg:pb-24 px-4 sm:px-6 md:px-12">

            {/* SVG Clip Path Definition - Tabbed Shape */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.05 0 H 0.65 Q 0.7 0 0.7 0.05 V 0.15 Q 0.7 0.2 0.75 0.2 H 0.95 Q 1 0.2 1 0.25 V 0.70 Q 1 0.75 0.95 0.75 H 0.75 Q 0.7 0.75 0.7 0.80 V 0.95 Q 0.7 1 0.65 1 H 0.05 Q 0 1 0 0.95 V 0.05 Q 0 0 0.05 0 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12 lg:gap-16">

                {/* Header Section (Full Width) */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left mt-4 gap-4 lg:gap-2">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                        <span className="text-primary">{brand.name}</span> for
                    </h1>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 sm:gap-x-4 lg:gap-x-8 gap-y-3 w-full">
                        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                            <span className="px-4 sm:px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm lg:text-base font-medium">
                                <Building2 size={14} className="inline mr-1.5 sm:w-4 sm:h-4" />
                                Villas
                            </span>
                            <span className="px-4 sm:px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm lg:text-base font-medium">Apartments</span>
                            <span className="px-4 sm:px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm lg:text-base font-medium flex items-center gap-2 shadow-sm">
                                <MapPin size={14} className="sm:w-4 sm:h-4" />
                                Dubai
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                            Individual Owners<span className="text-primary">.</span>
                        </h1>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-end">

                    {/* Left Column: Description & CTAs */}
                    <div className="flex flex-col gap-6 md:gap-8 lg:pb-8 relative z-10 text-center lg:text-left order-2 lg:order-1">
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0">
                            Why partner with {brand.name}? We provide up to {brand.claims.yieldUplift} more rental yield, on-time rent payments, and handle all property management and maintenance.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                            <Link href="/owner#owner-consultation-form">
                            <button className="w-full sm:w-auto bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/25">
                                List Your Property
                                <ArrowUpRight size={18} />
                            </button>
                            </Link>
                            <Link href="/owner#how-it-works">
                            <button className="text-foreground font-medium underline decoration-1 underline-offset-4 hover:text-primary transition-colors">
                                How it works
                            </button>
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between max-w-md pt-6 sm:pt-8 border-t border-border mt-2 mx-auto lg:mx-0 gap-6 sm:gap-0 lg:mr-10">
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4">
                                <span className="text-sm text-muted-foreground font-medium mb-1">Properties Managed</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-bold text-foreground">2,500</span>
                                    <span className="text-3xl sm:text-4xl font-bold text-primary">+</span>
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground">Across Dubai</span>
                            </div>

                            <div className="flex flex-col gap-2 items-center sm:items-start px-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl font-bold text-foreground">4.9</span>
                                    <div className="flex gap-0.5 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-muted overflow-hidden relative">
                                            <Image
                                                src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 40}.jpg`}
                                                alt="Owner"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground z-10">
                                        <Plus size={14} className="sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative h-[300px] sm:h-[450px] lg:h-[420px] w-full flex items-center justify-center perspective-1000 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Custom Clipped Image Container */}
                            <div
                                className="relative w-full h-full bg-primary/5 transition-all duration-500"
                                style={{
                                    clipPath: 'url(#hero-clip)',
                                    WebkitClipPath: 'url(#hero-clip)',
                                }}
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop"
                                    alt="Dubai Marina Skyline"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                {/* Overlay Text inside the Image */}
                                <div className="absolute bottom-[20%] sm:bottom-[32%] lg:bottom-[28%] left-[8%] lg:left-[10%] text-white z-10 w-full max-w-xs">
                                    <h3 className="text-xl sm:text-2xl sm:text-3xl font-medium leading-tight mb-2 drop-shadow-md">
                                        Your Partner in <br /> Property Success
                                    </h3>
                                </div>
                            </div>

                            {/* Floating Action Button - Positioned in the bottom-right cutout */}
                            <div className="absolute bottom-0 right-[2%] z-20">
                                <button className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                                    <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8 font-light text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
