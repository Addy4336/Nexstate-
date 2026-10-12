'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const aiAgents = [
    {
        name: "Riya",
        role: "Sales & Guide Agent",
        description: "Your 24/7 Personal Guide. Helps residents explore listings and Instant Book stays immediately. No waiting for human brokers.",
        image: "/images/riya.png",
        isGrayscale: false,
        hasCardBackground: false
    },
    {
        name: "Maya",
        role: "Maintenance Agent",
        description: "Zero Wait Time Repairs. Solves maintenance issues in minutes, not days. Leaky tap? WiFi down? Consider it sorted.",
        image: "/images/maya.png",
        isGrayscale: false,
        hasCardBackground: true
    },
    {
        name: "Zia",
        role: "Management Agent",
        description: "Flawless Business Operations. Ensures 100% uptime and efficiency. Handles logistics and operations so no task is ever delayed.",
        image: "/images/zia.png",
        isGrayscale: false,
        hasCardBackground: false
    }
];

export default function TeamSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-24 px-4 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
                    <div className="max-w-2xl space-y-4 md:space-y-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-medium">
                            AI Workforce
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1]">
                            Meet Your Dedicated <br className="hidden md:block" />
                            AI Property Managers
                        </h2>
                    </div>

                    <div className="max-w-md space-y-4 md:space-y-8 lg:pt-12">
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                            A fully autonomous team working 24/7 to ensure seamless operations, instant responses, and maximum efficiency for your property.
                        </p>
                    </div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                    {aiAgents.map((agent, index) => (
                        <div
                            key={index}
                            className={`group relative rounded-[2rem] transition-all duration-300 ${agent.hasCardBackground
                                ? 'bg-background p-4 sm:p-5 shadow-xl shadow-black/5 dark:shadow-white/5 border border-border'
                                : 'p-0 sm:p-4'
                                }`}
                        >
                            {/* Image Container */}
                            <div
                                className={`relative w-full overflow-hidden rounded-3xl mb-6 ${agent.hasCardBackground ? 'aspect-square' : 'aspect-[3/4]'
                                    } ${agent.isGrayscale ? 'grayscale hover:grayscale-0 transition-all duration-500' : ''}`}
                            >
                                <Image
                                    src={agent.image}
                                    alt={agent.name}
                                    fill
                                    className="object-cover object-top"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Info */}
                            <div className={`flex flex-col justify-between px-2 gap-3 ${agent.hasCardBackground ? 'pb-2' : ''}`}>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">{agent.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-2">{agent.role}</p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {agent.description}
                                    </p>
                                </div>

                                <div className="self-end mt-2 w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors cursor-pointer">
                                    <ArrowUpRight size={18} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
