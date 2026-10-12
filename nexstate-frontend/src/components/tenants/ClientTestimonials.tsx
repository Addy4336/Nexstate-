'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Sajibur Rahman",
        role: "UI UX Designer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60",
        quote: "Working with this team was a pleasure. They understood our vision and helped us find a property that exceeded our expectations. We couldn't have done it without them!"
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Product Manager",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60",
        quote: "The level of professionalism and dedication shown by the agents was outstanding. They guided us through every step of the buying process, making it smooth and stress-free."
    },
    {
        id: 3,
        name: "Michael Ross",
        role: "Architect",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60",
        quote: "As an architect, I have high standards for properties. This agency not only met them but surprised me with their deep market knowledge and attention to structural details."
    }
];

export default function ClientTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    return (
        <section className="py-20  bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground max-w-lg">
                        What our clients say about us
                    </h2>

                    {/* Review Stats */}
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden relative">
                                    <Image
                                        src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`}
                                        alt="Client"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">More than 500+</span>
                            <span className="text-sm text-muted-foreground">Client Reviews</span>
                        </div>
                    </div>
                </div>

                {/* Slider Content */}
                <div className="relative flex items-center justify-between gap-4 lg:gap-12">

                    {/* Prev Button */}
                    <button
                        onClick={handlePrev}
                        className="hidden md:flex shrink-0 w-12 h-12 rounded-full border border-border items-center justify-center hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Main Card Area */}
                    <div className="flex-1 w-full max-w-5xl mx-auto">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col md:flex-row gap-6 items-center"
                            >
                                {/* Left Image - 40% */}
                                <div className="relative w-full aspect-square md:w-[35%] md:aspect-auto h-[300px] rounded-[2.5rem] overflow-hidden shadow-sm">
                                    <Image
                                        src={TESTIMONIALS[currentIndex].image}
                                        alt={TESTIMONIALS[currentIndex].name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Right Content - 60% */}
                                <div className="flex-1 flex flex-col h-[300px] justify-center p-6 bg-secondary/10 dark:bg-card/40 rounded-[2.5rem]">
                                    <Quote className="w-10 h-10 text-primary mb-6 fill-primary/20" />

                                    <blockquote className="text-xl md:text-2xl font-medium text-foreground  mb-8">
                                        "{TESTIMONIALS[currentIndex].quote}"
                                    </blockquote>

                                    <div>
                                        <h4 className="text-lg font-bold text-foreground">{TESTIMONIALS[currentIndex].name}</h4>
                                        <p className="text-sm text-muted-foreground">{TESTIMONIALS[currentIndex].role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        className="hidden md:flex shrink-0 w-12 h-12 rounded-full border border-border items-center justify-center hover:bg-muted transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 text-foreground" />
                    </button>

                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8 md:mt-12">
                    {TESTIMONIALS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'w-6 bg-primary'
                                : 'w-1.5 bg-border hover:bg-muted-foreground'
                                }`}
                        />
                    ))}
                </div>

                {/* Mobile Navigation (Visible only on small screens) */}
                <div className="flex md:hidden justify-center gap-4 mt-6">
                    <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={handleNext} className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </section>
    );
}
