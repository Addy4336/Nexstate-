"use client";

import React from 'react';
import { MessageSquare, Settings, UserCheck, CreditCard, Headphones, Languages, ArrowUpRight } from 'lucide-react';

const features = [
    {
        icon: MessageSquare,
        title: "24/7 AI-Powered Conversations",
        description: "Zero missed leads. Engage every visitor instantly with intelligent, human-like responses."
    },
    {
        icon: Settings,
        title: "No-Code Setup",
        description: "Deploy in minutes. Our intuitive dashboard requires absolutely no technical expertise."
    },
    {
        icon: UserCheck,
        title: "Smart Lead Qualification",
        description: "AI automatically filters and scores leads so your team only focuses on high-intent prospects."
    },
    {
        icon: CreditCard,
        title: "CRM & Payment Integrations",
        description: "Seamlessly syncs with your existing tools. Works with Salesforce, HubSpot, Stripe, and more."
    },
    {
        icon: Headphones,
        title: "Omnichannel Support",
        description: "Be everywhere your customers are. Unified support across Website, WhatsApp, and Messenger."
    },
    {
        icon: Languages,
        title: "Multi-Language & Personalization",
        description: "Speak their language. Automatically detects and responds in the user's native tongue."
    }
];

export default function SalesManagement() {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-muted/20 relative overflow-hidden">
            {/* Background Gradient Circles - Adjusted for mobile */}
            <div className="absolute top-0 left-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse [animation-duration:4s]"></div>
            <div className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-gradient-to-tl from-secondary/30 to-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none animate-pulse [animation-duration:5s]"></div>
            <div className="absolute top-1/2 left-1/2 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-gradient-to-r from-primary/10 to-secondary/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="hidden sm:block absolute top-1/4 right-1/4 w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] bg-gradient-to-bl from-secondary/20 to-transparent rounded-full blur-2xl pointer-events-none animate-pulse [animation-duration:6s]"></div>
            <div className="hidden sm:block absolute bottom-1/4 left-1/4 w-[150px] lg:w-[250px] h-[150px] lg:h-[250px] bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl pointer-events-none animate-pulse [animation-duration:7s]"></div>

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:40px_40px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-3xl mx-auto px-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-foreground leading-tight tracking-tight mb-4 sm:mb-6">
                        Elevate sales with <br className="hidden sm:block" />
                        <span className="text-primary italic">seamless management</span>
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground/80">
                        Everything you need to automate, manage, and scale your customer interactions in one powerful platform.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-card/60 backdrop-blur-xl rounded-2xl sm:rounded-[20px] p-5 sm:p-6 lg:p-8 border border-border/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 hover:bg-card/80 hover:border-primary/20"
                        >
                            {/* Card Inner Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl sm:rounded-[20px] bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            {/* Subtle shimmer effect on hover */}
                            <div className="absolute inset-0 rounded-2xl sm:rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>

                            <div className="flex flex-col h-full gap-4 sm:gap-5 lg:gap-6 relative z-10">
                                {/* Icon Container */}
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110">
                                    <feature.icon
                                        className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 pr-2">
                                            {feature.title}
                                        </h3>
                                        {/* Subtle Arrow on Hover */}
                                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 flex-shrink-0" />
                                    </div>
                                    <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
