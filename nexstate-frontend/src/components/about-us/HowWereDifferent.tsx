import { brand } from "@nexstate/brand";
import React from 'react';
import { CheckCircle2, Building2, Layers, Heart } from 'lucide-react';

const HowWereDifferent = () => {
    return (
        <section className="bg-background py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">
                <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-muted-foreground">
                                How We’re Different
                            </span>
                        </div>
                        <h2 className="text-[32px] md:text-[48px] font-medium leading-[1.1] text-foreground mb-6">
                            We focus on outcomes, not complexity.
                        </h2>
                        <p className="text-muted-foreground text-[16px] md:text-[17px] leading-[1.6] mb-8 max-w-[500px]">
                            Unlike traditional rentals or fragmented co-living setups, {brand.name} brings everything under one platform.
                        </p>

                        <div className="space-y-4 mb-10">
                            {[
                                "Tech-enabled operations for faster response and transparency",
                                "Standardised living experience across properties",
                                "Professional management, not brokers",
                                "People-first approach — homes designed for real living"
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="mt-1 shrink-0 text-primary">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="text-foreground font-medium text-[15px]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Visual / At a Glance */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="bg-muted rounded-[40px] p-8 md:p-12 relative overflow-hidden border border-border/50">
                            {/* Background decoration */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

                            <h3 className="text-[24px] font-medium mb-8 relative z-10 flex items-center gap-3">
                                At a Glance
                            </h3>

                            <div className="grid gap-4 relative z-10">
                                <div className="bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm flex items-center gap-5 hover:bg-background/80 transition-colors duration-300">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-foreground text-[17px] font-semibold mb-1">Managed homes</span>
                                        <span className="text-muted-foreground text-[14px]">Across key urban locations</span>
                                    </div>
                                </div>

                                <div className="bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm flex items-center gap-5 hover:bg-background/80 transition-colors duration-300">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-foreground text-[17px] font-semibold mb-1">End-to-end solutions</span>
                                        <span className="text-muted-foreground text-[14px]">Full rental & co-living management</span>
                                    </div>
                                </div>

                                <div className="bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm flex items-center gap-5 hover:bg-background/80 transition-colors duration-300">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-foreground text-[17px] font-semibold mb-1">Technology-driven</span>
                                        <span className="text-muted-foreground text-[14px]">Human-centric approach</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowWereDifferent;
