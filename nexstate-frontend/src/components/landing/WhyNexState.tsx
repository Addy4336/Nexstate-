"use client";

import { brand } from "@nexstate/brand";
import { Bot, Armchair, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: <Bot className="w-8 h-8 text-primary-foreground" />,
        title: "Fully managed, ready-to-move-in AI smart homes",
        description: `${brand.name} manages everything from dynamic yield optimization to predictive maintenance, ensuring owners get maximum returns and residents enjoy seamless, intelligent stays.`,
        className: "md:col-span-4 bg-primary text-primary-foreground border-none",
        iconBg: "bg-primary-foreground/20",
        lightText: true
    },
    {
        icon: <Armchair className="w-6 h-6 text-primary" />,
        title: "All bills included in one monthly payment",
        description: "No hidden fees or additional charges. One simple, all-inclusive bill covers rent, wifi, and utilities.",
        className: "md:col-span-2",
        iconBg: "bg-secondary",
        lightText: false
    },
    {
        icon: <Clock className="w-6 h-6 text-primary" />,
        title: "Flexible stays",
        description: "Stay for a month or a year. Flexible digital contracts managed directly via client portal.",
        className: "md:col-span-2",
        iconBg: "bg-secondary",
        lightText: false
    },
    {
        icon: <Sparkles className="w-6 h-6 text-primary" />,
        title: "Hotel-grade standards",
        description: "Professional cleaning, 24/7 support, and high-end amenities with transparent pricing.",
        className: "md:col-span-2",
        iconBg: "bg-secondary",
        lightText: false
    },
    {
        icon: <Bot className="w-6 h-6 text-primary" />,
        title: "AI Powered Assistant",
        description: "Adaptive AI support for instant search, property recommendations, and site visit booking.",
        className: "md:col-span-2",
        iconBg: "bg-secondary",
        lightText: false
    }
];

export default function WhyNexState() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle Background Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl mb-6"
                    >
                        Why {brand.name}?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground"
                    >
                        We're not just another real estate portal.
                        <br className="hidden sm:block" /> Reimagining property operations and search with AI technology at the core.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden",
                                feature.className
                            )}
                        >
                            {/* Hover content shift effect */}
                            <div className="relative z-10">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300", feature.iconBg)}>
                                    {feature.icon}
                                </div>

                                <h3 className={cn("text-2xl font-bold mb-3", feature.lightText ? "text-white" : "text-foreground")}>
                                    {feature.title}
                                </h3>

                                <p className={cn("leading-relaxed", feature.lightText ? "text-white/80" : "text-muted-foreground")}>
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative gradient for non-highlight cards */}
                            {!feature.lightText && (
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
