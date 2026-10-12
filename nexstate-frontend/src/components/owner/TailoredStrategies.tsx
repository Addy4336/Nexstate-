"use client";

import { brand } from "@nexstate/brand";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TailoredStrategies() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rotate-[-1deg] mr-2 rounded-md">
                                    Tailored Rental Strategies
                                </span>
                                for Maximum <br />
                                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rotate-[1deg] mt-2 rounded-md">
                                    Returns
                                </span>
                            </h2>

                            <div className="bg-primary text-primary-foreground p-3 inline-block font-medium text-lg md:text-xl mb-6 shadow-md rounded-lg">
                                At {brand.name}, we understand that every property is unique.
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                That's why we create personalized rental plans based on the property's location, type, and current market trends, ensuring the best possible returns and occupancy rates.
                            </p>
                        </motion.div>
                    </div>

                    {/* Illustration Side */}
                    <div className="flex-1 w-full max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative aspect-square md:aspect-[4/3]"
                        >
                            {/* Using a placeholder illustration that matches the description or a generic 'strategy' one if exact match isn't available. 
                                The user provided image suggests a vector illustration style. 
                            */}
                            <Image
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop"
                                alt="Tailored Rental Strategies"
                                fill
                                className="object-cover rounded-2xl shadow-lg"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
