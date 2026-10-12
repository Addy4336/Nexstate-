'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    image?: string;
    category?: string;
}

export default function FAQSection() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_URL}/api/faqs`);
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setFaqs(result.data);
                    // Open the first FAQ by default if available
                    if (result.data.length > 0) {
                        setOpenId(result.data[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="py-20  bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground max-w-xl">
                        Frequently asked questions
                    </h2>
                    <p className="text-muted-foreground leading-relaxed max-w-lg lg:text-right">
                        Our experts guide you in making informed investment decisions based on market insights. We offer residential, commercial, and luxury properties tailored to different preferences and budgets.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading FAQs...</div>
                    ) : (
                        faqs.map((item) => (
                            <div
                                key={item.id}
                                className={`border transition-colors duration-300 rounded-[1.5rem] overflow-hidden ${openId === item.id
                                    ? 'border-border bg-background shadow-sm'
                                    : 'border-border/60 bg-card/50 hover:border-border'
                                    }`}
                            >
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="w-full flex items-center justify-between p-6  text-left outline-none"
                                >
                                    <span className="text-xl md:text-2xl font-medium text-foreground pr-8">
                                        {item.question}
                                    </span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openId === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 md:px-8 pb-3 pt-0 flex flex-col md:flex-row gap-8 items-start">
                                                <p className="text-muted-foreground leading-relaxed flex-1 text-base md:text-lg">
                                                    {item.answer}
                                                </p>
                                                {item.image && (
                                                    <div className="relative w-full md:w-[240px] h-[140px] flex-shrink-0 rounded-xl overflow-hidden hidden md:block border border-border/10">
                                                        <Image
                                                            src={item.image}
                                                            alt="FAQ Context"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )))}
                </div>

            </div>
        </section>
    );
}
