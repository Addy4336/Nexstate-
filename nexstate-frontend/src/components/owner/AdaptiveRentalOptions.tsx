"use client";

import { brand } from "@nexstate/brand";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const options = [
    {
        title: "Short & Mid-Term Focus",
        points: [
            "Leverage peak seasons with high-value short-term bookings.",
            "Maintain steady occupancy during quieter periods with monthly rental solutions."
        ],
        // First card styling (Secondary Theme Color)
        className: "bg-secondary/20 text-secondary-foreground"
    },
    {
        title: "Long-Term Rental Flexibility",
        points: [
            "Easily transition to long-term yearly leasing for properties better suited to extended stays or based on owner preferences."
        ],
        // Second card styling (Primary Tint)
        className: "bg-primary/5 text-foreground border border-primary/10"
    },
    {
        title: "Innovative Marketing and Extensive Network",
        points: [
            "Harness cutting-edge technology to boost your property's visibility across multiple platforms.",
            "Benefit from our wide-reaching network, including real estate professionals, travel agents, corporate connections, and various listing platforms, ensuring consistent demand year-round especially in low seasons."
        ],
        // Third card styling (Primary Tint)
        className: "bg-primary/5 text-foreground border border-primary/10"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AdaptiveRentalOptions() {
    return (
        <section className="py-20 bg-background text-foreground">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Heading */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold uppercase inline-block relative">
                        <span className="relative z-10">Adaptive Rental Options</span>
                        <span className="absolute left-0 bottom-1 w-full h-3 bg-primary/20 -z-0"></span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16"
                >
                    {options.map((option, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className={`rounded-3xl p-8 ${option.className} flex flex-col h-full hover:shadow-lg transition-shadow duration-300`}
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">
                                {option.title}
                            </h3>
                            <ul className="space-y-4">
                                {option.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base leading-relaxed">
                                        <Check className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-muted-foreground text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
                >
                    With {brand.name}, your property is positioned to achieve optimal performance, no matter the season or market conditions.
                </motion.p>

            </div>
        </section>
    );
}
