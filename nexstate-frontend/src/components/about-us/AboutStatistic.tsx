import { brand } from "@nexstate/brand";
import React from 'react';
import Image from 'next/image';

const AboutStatistics = () => {
    return (
        <section className="bg-background py-16 md:py-[120px] overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">
                {/* Header Section - Stacked Layout */}
                <div className="flex flex-col mb-10 md:mb-16">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                            About Us
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-4 tracking-[-0.02em]">
                        A Tech-First Approach to Real Estate
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.7] max-w-[800px]">
                        At {brand.name}, we believe the future of renting is instant. Traditional real estate is slow, but our fully AI-integrated ecosystem moves at the speed of life.<br /><br />
                        For Residents: We offer 24/7 instant support for everything from booking a home to fixing a leaky tap.<br />
                        For Owners: We provide live, data-driven ROI tracking and automated management that never sleeps.<br />
                        Our Promise: Zero delays. 100% transparency.
                    </p>
                </div>

                {/* Statistics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 border-t border-border pt-6">
                    <div className="flex flex-col">
                        <span className="text-[40px] md:text-[56px] font-medium leading-[1.1] text-foreground mb-2 tracking-[-0.02em]">300+</span>
                        <span className="text-muted-foreground text-[14px] md:text-[15px]">Families served</span>
                    </div>
                    <div className="flex flex-col md:items-center">
                        <span className="text-[40px] md:text-[56px] font-medium leading-[1.1] text-foreground mb-2 tracking-[-0.02em]">100M+</span>
                        <span className="text-muted-foreground text-[14px] md:text-[15px]">Closed sales</span>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <span className="text-[40px] md:text-[56px] font-medium leading-[1.1] text-foreground mb-2 tracking-[-0.02em]">600+</span>
                        <span className="text-muted-foreground text-[14px] md:text-[15px]">Homes Sold</span>
                    </div>
                </div>

                {/* Visual Images Split */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Left Large Image */}
                    <div className="w-full md:w-[75%]">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                            <Image
                                src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2000&auto=format&fit=crop"
                                alt="Modern smart home interior"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 65vw"
                            />
                        </div>
                    </div>
                    {/* Right Small Image - Positioned at top with space below */}
                    <div className="w-full md:w-[25%]">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                            <Image
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                                alt="Real estate data analytics"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 35vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutStatistics;