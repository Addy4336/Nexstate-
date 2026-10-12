import React from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ProcessFlow() {
    const agents = [
        {
            title: "Riya - The Sales & Guide AI",
            description: "Your 24/7 Personal Guide. Helps residents explore listings and Instant Book stays immediately. No waiting for human brokers.",
            image: "/images/riya.png",
            isGrayscale: false
        },
        {
            title: "Maya - The Maintenance AI",
            description: "Zero Wait Time Repairs. Solves maintenance issues in minutes, not days. Leaky tap? WiFi down? Consider it sorted.",
            image: "/images/maya.png",
            isGrayscale: false
        },
        {
            title: "Zia - The Management AI",
            description: "Flawless Business Operations. Ensures 100% uptime and efficiency. Handles logistics and operations so no task is ever delayed.",
            image: "/images/zia.png",
            isGrayscale: false
        }
    ];

    return (
        <section className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-foreground">
                        Tools to build your vision
                    </h2>
                </div>

                {/* Steps Visualization */}
                <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-16 sm:mb-20 lg:mb-24">
                    {[
                        "Instant Response",
                        "Secure & Private",
                        "Always Available"
                    ].map((step, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`
                          px-4 sm:px-6 py-2 sm:py-3 rounded-xl border transition-all duration-300 relative
                          ${index === 0
                                        ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10'
                                        : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                                    }
                        `}
                            >
                                <span className="font-medium whitespace-nowrap text-sm sm:text-base">{step}</span>

                                {/* Border Animation for Active Step */}
                                {index === 0 && (
                                    <span className="absolute inset-0 rounded-xl border-2 border-primary/20 animate-pulse"></span>
                                )}
                            </div>

                            {index < 2 && (
                                <div className="hidden sm:flex items-center px-2 relative">
                                    {/* Connecting Line */}
                                    <div className="w-8 sm:w-12 h-[1px] bg-border relative">
                                        {index === 0 && (
                                            <div className="absolute inset-0 bg-primary/50 origin-left animate-[width_1s_ease-in-out_infinite]"></div>
                                        )}
                                    </div>

                                    {/* Arrow Indicator */}
                                    <div className={`
                                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                w-5 h-5 sm:w-6 sm:h-6 rounded-full border bg-card flex items-center justify-center z-10
                                ${index === 0 ? 'border-primary/30 text-primary' : 'border-border text-muted-foreground'}
                           `}>
                                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="space-y-12 sm:space-y-16 lg:space-y-24">
                    {/* Feature 1: Sales Agent */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-20 items-center">
                        {/* Image Side */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden aspect-square">
                                <Image
                                    src={agents[0].image}
                                    alt={agents[0].title}
                                    fill
                                    className="object-cover object-top transition-all duration-500 hover:scale-105"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:pl-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight">
                                {agents[0].title}
                            </h3>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                {agents[0].description}
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: Maintenance Agent */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-20 items-center">
                        {/* Text Side - Order 2 on Mobile, Order 1 on Desktop */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-6 order-2 lg:order-1 lg:pr-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight">
                                {agents[1].title}
                            </h3>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                {agents[1].description}
                            </p>
                        </div>

                        {/* Image Side - Order 1 on Mobile, Order 2 on Desktop */}
                        <div className="relative group order-1 lg:order-2">
                            <div className="absolute -inset-4 bg-gradient-to-l from-primary/20 to-secondary/20 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                            <div className="relative rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden aspect-square">
                                <Image
                                    src={agents[1].image}
                                    alt={agents[1].title}
                                    fill
                                    className="object-cover object-top transition-all duration-500 hover:scale-105"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Management Agent */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-20 items-center">
                        {/* Image Side */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden aspect-square">
                                <Image
                                    src={agents[2].image}
                                    alt={agents[2].title}
                                    fill
                                    className="object-cover object-top transition-all duration-500 hover:scale-105"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:pl-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight">
                                {agents[2].title}
                            </h3>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                {agents[2].description}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
