import React from 'react';
import Image from 'next/image';

const OurVision = () => {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-foreground">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-20">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2600&auto=format&fit=crop"
                    alt="City Skyline"
                    fill
                    className="object-cover grayscale"
                />
            </div>

            <div className="container mx-auto px-5 md:px-10 max-w-[1000px] relative z-10 text-center">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                    <span className="text-primary-foreground/90 text-[11px] font-semibold uppercase tracking-[2px]">
                        Our Vision
                    </span>
                </div>

                <h2 className="text-[28px] md:text-[42px] lg:text-[52px] font-medium leading-[1.3] text-background tracking-tight">
                    &ldquo;To redefine urban renting by creating homes that are easy to live in and easy to manage — powered by technology, driven by trust.&rdquo;
                </h2>
            </div>
        </section>
    );
};

export default OurVision;
