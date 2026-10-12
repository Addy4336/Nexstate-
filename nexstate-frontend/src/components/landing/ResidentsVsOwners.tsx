"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, User, Building2, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ResidentsVsOwners() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium mb-6 backdrop-blur-sm"
                    >
                        <Crown className="w-4 h-4 text-secondary" />
                        <span>Premium Ecosystem</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight"
                    >
                        Unmatched Value for <span className="text-primary">Everyone</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        We've built a seamless ecosystem that bridges the gap between searching for a home and managing a property investment.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    {/* Residents Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="group relative bg-card rounded-[2.5rem] border border-border/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-primary/20 flex flex-col"
                    >
                        {/* Background Gradient & Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5 opacity-100 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />

                        {/* Image Header */}
                        <div className="relative h-64 w-full overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
                                alt="For Residents"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                            <div className="absolute bottom-6 left-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground uppercase tracking-wider">Experience</p>
                                    <h3 className="text-2xl font-bold text-foreground">For Residents</h3>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-2 flex flex-col flex-1 relative">
                            <div className="space-y-4 mb-8 flex-1">
                                {[
                                    "Fully furnished, move-in-ready homes",
                                    "Short–mid–long stay flexibility",
                                    "All bills included in one monthly payment",
                                    "Prime, well-connected Dubai locations",
                                    "Hotel-grade cleaning and maintenance",
                                    "100% digital journey from discovery to move-in"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 group/item">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                                            <Check className="w-3 h-3 text-primary group-hover/item:text-primary-foreground transition-colors" />
                                        </div>
                                        <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/tenants" className="mt-auto">
                                <button className="w-full group/btn flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary py-4 rounded-xl text-primary hover:text-primary-foreground font-semibold transition-all duration-300">
                                    Find Your Home
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Owners Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="group relative bg-card rounded-[2.5rem] border border-border/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-secondary/20 flex flex-col"
                    >
                        {/* Background Gradient & Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-secondary/5 opacity-100 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute -left-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-500" />

                        {/* Image Header */}
                        <div className="relative h-64 w-full overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                                alt="For Owners"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                            <div className="absolute bottom-6 left-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground shadow-lg shadow-secondary/30">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground uppercase tracking-wider">Invest</p>
                                    <h3 className="text-2xl font-bold text-foreground">For Owners</h3>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-2 flex flex-col flex-1 relative">
                            <div className="space-y-4 mb-8 flex-1">
                                {[
                                    "Higher, data-backed yields",
                                    "End-to-end property and tenant management",
                                    "Professional furnishing and listing setup",
                                    "AI-based dynamic pricing revenue",
                                    "Transparent reporting and performance insights",
                                    "Strong on-ground team support"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 group/item">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-secondary group-hover/item:scale-110 transition-all duration-300">
                                            <Check className="w-3 h-3 text-secondary-foreground group-hover/item:text-secondary-foreground transition-colors" />
                                        </div>
                                        <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/owner" className="mt-auto">
                                <button className="w-full group/btn flex items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary py-4 rounded-xl text-secondary-foreground/80 hover:text-secondary-foreground font-semibold transition-all duration-300">
                                    Maximize Returns
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
