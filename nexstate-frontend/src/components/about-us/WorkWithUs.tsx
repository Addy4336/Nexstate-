import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WorkWithUs = () => {
    return (
        <section className="bg-background py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row lg:items-stretch">
                    {/* Left - Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full rounded-3xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1000&auto=format&fit=crop"
                                alt="Property owner analyzing ROI on tablet"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right - Content Card */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary/20 rounded-3xl px-5 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
                        <div className="max-w-[480px] text-center">
                            {/* Tag */}
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                <span className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                    Work With Us
                                </span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-[24px] md:text-[32px] lg:text-[40px] font-medium leading-[1.2] text-foreground mb-4 md:mb-6 tracking-[-0.02em]">
                                Smart Management, <span className="font-serif italic">Higher Returns</span>
                            </h2>

                            {/* Description */}
                            <p className="text-muted-foreground text-[13px] md:text-[15px] leading-[1.6] mb-4">
                                Forget &quot;old data&quot; and quarterly reports. Our AI Calculator gives property owners live market insights and real-time ROI tracking.
                            </p>

                            {/* Feature List */}
                            <ul className="text-muted-foreground text-[13px] md:text-[14px] leading-[1.6] mb-6 space-y-2 text-left">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                    <span><strong>Live Accuracy:</strong> See exactly how your property performs right now.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                    <span><strong>24/7 Management:</strong> Our AI never takes a sick day, ensuring your asset is always working for you.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                    <span><strong>Maximized Yields:</strong> AI-driven pricing ensures you never lose money on an empty unit.</span>
                                </li>
                            </ul>

                            {/* CTA Button */}
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary text-secondary-foreground text-[13px] md:text-[14px] font-medium rounded-full hover:opacity-90 transition-opacity duration-300"
                            >
                                Let&apos;s talk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkWithUs;

