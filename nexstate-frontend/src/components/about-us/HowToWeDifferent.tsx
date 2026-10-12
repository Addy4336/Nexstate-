"use client";

import { brand } from "@nexstate/brand";
import { Zap, LayoutGrid, Briefcase, Heart, BrainCircuit, BarChart3 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function HowToWeDifferent() {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <section className="py-24 bg-foreground text-background relative overflow-hidden">
            {/* Abstract Tech Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-sm font-medium mb-4">
                        <BrainCircuit className="w-4 h-4" />
                        <span>Why Choose Us</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-background">
                        How We’re Different
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto opacity-80">
                        Unlike traditional rentals or fragmented co-living setups, {brand.name} brings everything under one platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Feature Interaction List */}
                    <div className="lg:col-span-5 space-y-4">
                        {[
                            {
                                id: "tech",
                                icon: <Zap className="w-5 h-5" />,
                                title: "Tech-enabled operations",
                                description: "For faster response and transparency in every interaction.",
                            },
                            {
                                id: "standard",
                                icon: <LayoutGrid className="w-5 h-5" />,
                                title: "Standardised living experience",
                                description: "Consistent quality and comfort across all our properties.",
                            },
                            {
                                id: "management",
                                icon: <Briefcase className="w-5 h-5" />,
                                title: "Professional management",
                                description: "No brokers, just dedicated professionals managing your home.",
                            },
                            {
                                id: "people",
                                icon: <Heart className="w-5 h-5" />,
                                title: "People-first approach",
                                description: "Homes designed for real living, focusing on your well-being.",
                            }
                        ].map((feature, index) => {
                            const isActive = activeFeature === index;
                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onMouseEnter={() => setActiveFeature(index)}
                                    className={cn(
                                        "group p-4 rounded-xl cursor-pointer transition-all duration-300 border",
                                        isActive
                                            ? "bg-background/10 border-primary/50 shadow-lg shadow-primary/10"
                                            : "bg-transparent border-transparent hover:bg-background/5 hover:border-background/10"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "mt-1 p-2 rounded-lg transition-colors duration-300",
                                            isActive ? "bg-primary/20 text-primary-foreground" : "bg-background/5 text-muted group-hover:text-background"
                                        )}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className={cn("font-semibold text-lg transition-colors", isActive ? "text-background" : "text-muted group-hover:text-background")}>
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-muted/70 mt-1 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div className="pt-4 px-4">
                            <p className="text-lg font-medium text-primary-foreground italic">
                                "We focus on outcomes, not complexity."
                            </p>
                        </div>
                    </div>

                    {/* Visualization Side */}
                    <div className="lg:col-span-7 relative h-[350px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">

                        {/* Main Tech Visual */}
                        <div className="relative w-full h-full">
                            <Image
                                src="/images/DYNAMIC_PRICES_8K.webp"
                                alt={`${brand.name} Operations`}
                                fill
                                unoptimized
                                className="object-cover rounded-4xl drop-shadow-2xl z-10 animate-pulse-slow"
                            />

                            {/* Floating Data Points (Just for flair) */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[2%] right-[0%] bg-black/60 backdrop-blur-md border border-indigo-500/30 p-4 rounded-xl z-20 shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-mono text-emerald-400">OPERATIONS OPTIMIZED</span>
                                </div>
                                <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[95%] bg-indigo-500 rounded-full" />
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[25%] left-[5%] bg-black/60 backdrop-blur-md border border-violet-500/30 p-4 rounded-xl z-20 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-4 h-4 text-violet-400" />
                                    <span className="text-xs font-mono text-violet-200">SATISFACTION 98%</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Glowing Rings behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-dashed border-violet-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
