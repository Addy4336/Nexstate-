"use client";

import React from 'react';
import { MapPin, KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        id: 1,
        icon: <MapPin className="w-8 h-8" />,
        text: "Managed homes across key urban locations",
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-600"
    },
    {
        id: 2,
        icon: <KeyRound className="w-8 h-8" />,
        text: "End-to-end rental & co-living solutions",
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-600"
    },
    {
        id: 3,
        icon: <Sparkles className="w-8 h-8" />,
        text: "Technology-driven, human-centric",
        color: "from-amber-500/20 to-orange-500/20",
        iconColor: "text-amber-600"
    }
];

const AtAGlance = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <span className="py-2 px-6 rounded-full bg-secondary/30 text-secondary-foreground text-sm font-semibold tracking-wide uppercase border border-secondary/50 backdrop-blur-sm">
                            At a Glance
                        </span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="group relative h-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-card to-background rounded-[2rem] border border-border transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/20" />

                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />

                            <div className="relative p-8 h-full flex flex-col items-center text-center z-10 justify-center min-h-[250px]">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-background shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-500 ${feature.iconColor}`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl md:text-2xl font-medium text-foreground group-hover:text-foreground/90 transition-colors leading-relaxed">
                                    {feature.text}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AtAGlance;
