"use client";

import { brand } from "@nexstate/brand";
import { motion } from "framer-motion";
import {
    CircleDollarSign,
    Clock,
    Home,
    Brush,
    FileText,
    Zap,
    ShieldCheck,
    Lock,
    Smartphone,
    Palette
} from "lucide-react";
import Image from "next/image";

const features = [
    {
        title: "High Rental Returns",
        description: `We with our unique co-living concept can provide up to ${brand.claims.yieldUplift} more on rental yield.`,
        icon: CircleDollarSign,
    },
    {
        title: "On-Time Rent",
        description: "We are experienced to take care of rent payments every month with a yield",
        icon: Clock,
    },
    {
        title: "Property management",
        description: "We handle all tenants paperwork and agreements, check in- check outs, rent collections , monthly reports and much more",
        icon: Home,
    },
    {
        title: "Regular Maintainence",
        description: "We handle weekly cleaning and timely pest controls and everyday maintenance issues to maintain your property conditions",
        icon: Brush,
    },
    {
        title: "Long Term Contracts",
        description: `${brand.name} has up to ${brand.claims.maxLeaseYears} years contracts for lease so no more hassle for finding new tenants every year.`,
        icon: FileText,
    },
    {
        title: "Quick Lease Ups",
        description: "Through our technology enabled renting and marketing services. We guarantee the quick lease out of your property maintaining 90- 100 % occupancy",
        icon: Zap,
    },
    {
        title: "Verified Tenants",
        description: "All tenants are pre verified. So, be hassle free from managing your tenants",
        icon: ShieldCheck,
    },
    {
        title: "Safety & Security",
        description: "We handle safety and security of your house using smart home technology",
        icon: Lock,
    },
    {
        title: "Online Booking",
        description: "We handle all booking and transaction effortlessly with our tech enabled platform for users.",
        icon: Smartphone,
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function OwnerFeatures() {
    return (
        <section className="py-24 bg-gradient-to-b from-background via-secondary/10 to-background overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -left-20 top-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -right-20 bottom-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 space-y-6 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 shadow-sm">
                            Partner Benefits
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                            {brand.name} for <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Individual Owners</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Experience premium property management designed to maximize your returns, ensuring peace of mind and profitability.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-16"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="flex flex-col items-center text-center h-full"
                        >
                            <div className="relative group w-full max-w-[320px] h-full flex flex-col items-center justify-start p-8 rounded-[2rem] bg-card border border-border/60 shadow-lg hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500">

                                {/* Icon Container */}
                                <div className="mb-6 relative w-20 h-20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                    <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform"></div>
                                    <div className="absolute inset-0 bg-card rounded-2xl border border-primary/20 flex items-center justify-center -rotate-3 group-hover:-rotate-6 transition-transform shadow-sm">
                                        <feature.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Illustration Card (Spans across columns) */}
                    <div className="lg:col-span-3 mt-8">
                        <div className="flex flex-col lg:flex-row items-stretch rounded-[2.5rem] bg-card border border-border/60 shadow-2xl overflow-hidden group">

                            {/* Content Side */}
                            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                                        <Palette size={32} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                        Tailored Interior Design
                                    </h3>

                                    <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                                        Transform your property with bespoke furnishing & interiors crafted by our expert designers. We turn houses into highly desirable homes that attract premium tenants.
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 py-2 px-4 rounded-full border border-primary/10">
                                        <SparklesIcon className="w-4 h-4" />
                                        <span>Premium Furnishing Options Available</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 relative min-h-[300px] lg:min-h-full overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
                                    alt="Luxury Interior Design"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-transparent to-transparent lg:from-card/50"></div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}

// Simple Sparkles Icon Component for local helper
function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 3v4" />
            <path d="M7 5h4" />
            <path d="M3 7h4" />
        </svg>
    )
}
