import React from 'react';
import { Home, Key, ShieldCheck, TrendingUp, Settings, Heart, Smile } from 'lucide-react';

const WhatWeDo = () => {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">
                <div className="flex flex-col items-start md:items-center md:text-center mb-16 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[11px] font-semibold uppercase tracking-[2px] text-muted-foreground">
                            What We Do
                        </span>
                    </div>
                    <h2 className="text-[32px] md:text-[48px] font-medium leading-[1.15] text-foreground max-w-[800px]">
                        We manage thoughtfully designed homes across prime locations.
                    </h2>
                    <p className="text-muted-foreground text-[16px] md:text-[18px] leading-[1.6] max-w-[650px]">
                        Combining professional property management, technology, and community-first living.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* For Tenants */}
                    <div className="group bg-card hover:bg-muted/30 transition-colors duration-300 rounded-[32px] p-8 md:p-12 border border-border/40 shadow-sm hover:shadow-md">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                <Heart size={22} fill="currentColor" className="opacity-20" />
                                <Heart size={22} className="absolute" />
                            </div>
                            <h3 className="text-[24px] font-medium">For Tenants</h3>
                        </div>

                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-background p-2 rounded-xl border border-border shadow-sm shrink-0">
                                    <Home size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-[16px] mb-1">Fully managed homes</h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">Ready-to-move-in spaces designed for real comfort and living.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-background p-2 rounded-xl border border-border shadow-sm shrink-0">
                                    <Key size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-[16px] mb-1">Flexible stays</h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">Clear pricing with flexible terms that adapt to your lifestyle.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-background p-2 rounded-xl border border-border shadow-sm shrink-0">
                                    <ShieldCheck size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-[16px] mb-1">Fast support</h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">Smooth experiences with responsive technology-enabled assistance.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* For Owners */}
                    <div className="group bg-card hover:bg-muted/30 transition-colors duration-300 rounded-[32px] p-8 md:p-12 border border-border/40 shadow-sm hover:shadow-md">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp size={22} />
                            </div>
                            <h3 className="text-[24px] font-medium">For Property Owners</h3>
                        </div>

                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-background p-2 rounded-xl border border-border shadow-sm shrink-0">
                                    <TrendingUp size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-[16px] mb-1">Higher rental income</h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">More consistent revenue streams optimized by market data.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-background p-2 rounded-xl border border-border shadow-sm shrink-0">
                                    <Settings size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-[16px] mb-1">End-to-end management</h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">We handle everything from tenant finding to maintenance.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-background p-2 rounded-xl border border-border shadow-sm shrink-0">
                                    <Smile size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-[16px] mb-1">Zero headaches</h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">No day-to-day operational stress. We take care of it all.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
