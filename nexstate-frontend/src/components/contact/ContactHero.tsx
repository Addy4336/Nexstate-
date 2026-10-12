import React from 'react';
import Image from 'next/image';

export default function ContactHero() {
    return (
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-32 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop"
                    alt="Customer Service Agent"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 -z-10 bg-foreground/10" />

            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-20 text-center md:text-left">

                    {/* Left Side - Headings */}
                    <div className="w-full md:w-1/2 space-y-3 md:space-y-4">
                        <span className="text-background text-sm font-medium tracking-wide uppercase">
                            We Will Be Happy To Assist
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal text-primary leading-tight tracking-tight mt-1 md:mt-2">
                            CONTACT US FOR <br />
                            INSTANT ANSWERS
                        </h1>
                    </div>

                    {/* Right Side - Description */}
                    <div className="w-full md:w-1/2 md:pt-14">
                        <p className="text-background text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
                            Why wait? Chat with our AI agents for immediate help, or reach out to our team below.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
