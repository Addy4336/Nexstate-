'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
    return (
        // <div className='px-8'>
        <section className="relative py-10 px-6 lg:px-8 overflow-hidden  my-12 max-w-350 mx-auto">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&auto=format&fit=crop&q=80"
                    alt="Dream Property"
                    fill
                    className="object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-foreground/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-card leading-[1.1]">
                    Ready to Make Your Dream Property a Reality?
                </h2>

                <p className="text-lg md:text-xl text-card/90 max-w-2xl font-light">
                    Explore a curated selection of properties that align with your vision and goals.
                </p>
<Link href="/properties">
                <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 hover:bg-muted transition-colors mt-4 group">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                </Link>
            </div>
        </section>
        // </div>
    );
}
