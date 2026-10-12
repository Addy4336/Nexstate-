"use client";

import { brand } from "@nexstate/brand";
import { useState } from 'react';
import Image from 'next/image';
import { User, Briefcase, Heart, Quote, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Customer Persona Data from PDF
const PERSONAS = [
    {
        id: 'mohammed',
        name: 'Mohammed',
        age: 28,
        origin: 'Arab',
        role: 'Aspiring Entrepreneur',
        income: 'AED 11,000 / Month',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80', // Corporate look
        quote: "I need a place to focus on my work and network for my potential idea.",
        needs: [
            "No-pain accommodation",
            "Place to relax & concentrate",
            "Networking opportunities"
        ],
        whyUs: [
            "Fully furnished, ready-to-shift homes",
            "Saves money to invest in business ideas",
            "Networking with like-minded flatmates"
        ],
        color: "bg-blue-500"
    },
    {
        id: 'deepika',
        name: 'Deepika',
        age: 25,
        origin: 'Indian',
        role: 'New to City',
        income: 'AED 6,000 / Month',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', // Professional female
        quote: "New job, new city. I need safety, affordability, and to make new friends.",
        needs: [
            "Accommodation near office",
            "Affordable living & less deposit",
            "Safe environment (Only-girls homes)"
        ],
        whyUs: [
            "Secured & safe (Only-girls options)",
            "All-inclusive bills (No calculations)",
            "Value-added services (No hassle)"
        ],
        color: "bg-pink-500"
    },
    {
        id: 'alex',
        name: 'Alex',
        age: 31,
        origin: 'Russian',
        role: 'Job Seeker',
        income: 'Savings: AED 15,000',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80', // Professional male
        quote: "I need to cut down costs while looking for new opportunities.",
        needs: [
            "Extremely affordable living",
            "Networking for jobs",
            "Confidence boost via community"
        ],
        whyUs: [
            "Boosts confidence with co-living",
            "Peace of mind with all-in-one services",
            "Contacts for new opportunities"
        ],
        color: "bg-amber-500"
    },
    {
        id: 'shafiq',
        name: 'Shafiq',
        age: 48,
        origin: 'Pakistani',
        role: 'Senior Accountant',
        income: 'AED 9,000 / Month',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80', // Mature professional
        quote: "I need to save securely for my family while having a decent place to stay.",
        needs: [
            "Fulfill family responsibilities",
            "Secure money & save",
            "Monotonous routine breaker"
        ],
        whyUs: [
            "Affordable living options",
            "People to communicate with",
            "Relaxed, all-inclusive packages"
        ],
        color: "bg-emerald-600"
    },
    {
        id: 'saddiq',
        name: 'Saddiq',
        age: 20,
        origin: 'Kenyan',
        role: 'Student & Freelancer',
        income: 'Variable / No Salary',
        image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&auto=format&fit=crop&q=80', // Young student
        quote: "I need a place to study, work, and live with like-minded students.",
        needs: [
            "Affordable & quality living",
            "Study & work space",
            "Food solutions & friends"
        ],
        whyUs: [
            "Room for 2 with study setup",
            "All-inclusive student friendly package",
            "Community of classmates & friends"
        ],
        color: "bg-indigo-500"
    }
];

export default function TenantStories() {
    const [activePersona, setActivePersona] = useState(PERSONAS[0]);

    return (
        <section className="py-12 md:py-20 lg:py-32 bg-secondary/5 px-4 md:px-6 lg:px-8 overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10 md:mb-16 lg:mb-24 px-2">
                    <span className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-3 md:mb-4 block">Our Community</span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-foreground mb-4 md:mb-6">
                        Designed for <span className="italic text-primary">Every</span> Journey
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Whether you're starting a new job, building a business, or studying for your future, {brand.name} provides the perfect foundation for your success.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Column: Persona Selector */}
                    {/* Mobile: Horizontal Scroll, Desktop: Vertical Stack */}
                    <div className="lg:col-span-4 flex flex-row lg:flex-col gap-4 overflow-x-auto pb-6 lg:pb-0 snap-x scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                        {PERSONAS.map((persona) => (
                            <button
                                key={persona.id}
                                onClick={() => setActivePersona(persona)}
                                className={cn(
                                    "group relative p-3 md:p-4 rounded-xl text-left transition-all duration-300 border flex-shrink-0 min-w-[260px] lg:min-w-0 snap-center",
                                    activePersona.id === persona.id
                                        ? "bg-background border-primary/20 shadow-lg scale-[1.02]"
                                        : "bg-transparent border-transparent hover:bg-background/50 hover:border-border/50"
                                )}
                            >
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 transition-all flex-shrink-0",
                                        activePersona.id === persona.id ? "border-primary" : "border-transparent opacity-70 group-hover:opacity-100"
                                    )}>
                                        <Image
                                            src={persona.image}
                                            alt={persona.name}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h4 className={cn(
                                            "font-medium text-base md:text-lg transition-colors",
                                            activePersona.id === persona.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                        )}>
                                            {persona.name}
                                        </h4>
                                        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider truncate max-w-[150px]">{persona.role}</p>
                                    </div>
                                </div>

                                {/* Active Indicator */}
                                {activePersona.id === persona.id && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hidden md:block">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Active Persona Details */}
                    <div className="lg:col-span-8">
                        <div className="bg-background rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 border border-border/50 shadow-xl relative overflow-hidden min-h-[auto] md:min-h-[500px] flex flex-col justify-between">

                            {/* Decorative Background Blob */}
                            <div className={cn("absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-10 -mr-16 -mt-16 md:-mr-20 md:-mt-20 transition-colors duration-700", activePersona.color)} />

                            <div className="relative z-10">
                                {/* Profile Header */}
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 md:mb-10 items-start">
                                    <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden shrink-0 shadow-lg rotate-3 border-4 border-background self-start">
                                        <Image
                                            src={activePersona.image}
                                            alt={activePersona.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                                            <span className={cn("px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-white tracking-wide uppercase", activePersona.color)}>
                                                {activePersona.origin}
                                            </span>
                                            <span className="text-xs md:text-sm text-muted-foreground font-medium">{activePersona.age} Years Old</span>
                                        </div>
                                        <h3 className="text-2xl md:text-4xl font-serif text-foreground mb-3 md:mb-4">{activePersona.role}</h3>
                                        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg">
                                                <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4" /> {activePersona.income}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quote */}
                                <div className="mb-8 md:mb-10 relative">
                                    <Quote className="absolute -top-3 -left-1 md:-top-4 md:-left-2 w-6 h-6 md:w-8 md:h-8 text-primary/10 rotate-180" />
                                    <p className="text-lg md:text-2xl italic text-foreground/80 leading-relaxed relative z-10 pl-5 md:pl-6 border-l-4 border-primary/20">
                                        "{activePersona.quote}"
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                                    {/* Needs */}
                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 md:mb-4">
                                            <User className="w-3.5 h-3.5 md:w-4 md:h-4" /> Challenges & Needs
                                        </h4>
                                        <ul className="space-y-2 md:space-y-3">
                                            {activePersona.needs.map((need, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-foreground/80 leading-relaxed">
                                                    <span className="block w-1.5 h-1.5 mt-1.5 md:mt-2 rounded-full bg-red-400 shrink-0" />
                                                    {need}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Solutions */}
                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-3 md:mb-4">
                                            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" /> Why {brand.name}?
                                        </h4>
                                        <ul className="space-y-2 md:space-y-3">
                                            {activePersona.whyUs.map((solution, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-foreground font-medium leading-relaxed">
                                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                                                    {solution}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
