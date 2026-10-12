'use client';

import { brand } from "@nexstate/brand";
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
    {
        id: "01",
        category: "Submit Property",
        title: <>Submit Property <br /> Detail</>,
        description: "List your property and get it inspected by our team members to understand its potential.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "02",
        category: "Agreement",
        title: <>Signing <br /> Agreement</>,
        description: `Sign contract for long term and let ${brand.name} take over the responsibility for your property.`,
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "03",
        category: "Returns",
        title: <>Hassle-Free <br /> Higher Returns</>,
        description: "Get- Set - Go to get best rental returns in market from your properties with our expert management.",
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop"
    }
];

export default function ProcessSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-16 md:py-24 px-4 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-12" id='how-it-works'>
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
                            3 Simple Steps
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
                            How {brand.name} works?
                        </h2>
                    </div>

                    <p className="text-muted-foreground text-base md:text-lg max-w-md lg:text-right leading-relaxed">
                        Get high income from rent in a few simple steps. We handle everything from listing to daily management.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {steps.map((step) => (
                        <div key={step.id} className="group flex flex-col gap-6">

                            {/* Card Visual */}
                            <div className="bg-background rounded-3xl p-3 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500 group-hover:-translate-y-2">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                                    <Image
                                        src={step.image}
                                        alt={step.category}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                                        Step {step.id}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3 px-2">
                                <h3 className="text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex justify-center pt-8">
                    <Link href="/owner#owner-consultation-form">
                        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2 group transform hover:scale-105 active:scale-95 duration-300">
                            List Your Property
                            <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
