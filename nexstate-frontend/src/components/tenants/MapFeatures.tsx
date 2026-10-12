'use client';

import { ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function MapFeatures() {
    return (
        <section className="py-16  bg-background px-6 lg:px-8">
            <div className="max-w-337.5 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12  items-center">

                    {/* Left Column - Map Image & Overlays */}
                    <div className="relative order-2 lg:order-1">
                        {/* Main Map Embed */}
                        <div className="relative aspect-3/2 w-full rounded-[2.5rem] overflow-hidden shadow-xl border border-border/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14455.001523320769!2d55.12204997362603!3d25.07644829475327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6caa5f2bc1ff%3A0x7ba0b1be1feb3bb7!2sDubai%20Marina%20Mall!5e0!3m2!1sen!2sin!4v1768299908286!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            />

                            {/* Map Overlay Elements */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative top-4 flex flex-col items-center transform -translate-y-8">
                                    {/* Pin Section */}
                                    <div className="relative z-10 flex flex-col items-center drop-shadow-2xl">
                                        {/* Green Outer Circle */}
                                        <div className="w-18 h-18 bg-secondary rounded-full flex items-center justify-center relative shadow-md">
                                            {/* White Inner Circle */}
                                            <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center shadow-sm">
                                                {/* Home Icon */}
                                               <span className="text-3xl">🏠</span>
                                            </div>
                                            {/* Pin Pointer Triangle */}
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-secondary"></div>
                                        </div>

                                        {/* Pulse Animation Behind */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-secondary/30 rounded-full animate-ping -z-10"></div>
                                    </div>

                                    {/* Dream Home Bubble */}
                                    <div className="mt-6 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 relative z-10 tracking-wide">
                                        Dream Home <span className="text-sm">😊</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Text Content */}
                    <div className="flex flex-col gap-4 order-1 lg:order-2 lg:pl-10">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1]">
                            Discover Properties with the Best Value
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                            From minimalist interiors to compact solutions, small spaces inspire big ideas, proving that you don't need much room.
                        </p>

                        <div className="pt-2">
                            <Link href="/properties-locations">
                            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm sm:text-base font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-lg hover:shadow-xl group w-fit">
                                Find Nearest Properties
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
