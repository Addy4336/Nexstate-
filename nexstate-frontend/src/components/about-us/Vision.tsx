import { brand } from "@nexstate/brand";
import React from 'react';
import Image from 'next/image';

const Vision = () => {
    return (
        <section className="bg-background px-4 py-12 md:py-24 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] -z-10"></div>
            </div>

            <div className="container mx-auto max-w-7xl">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-6 md:p-12 lg:p-16 shadow-2xl shadow-black/5">

                    <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center">

                        {/* Left Column - Content */}
                        <div className="w-full lg:flex-1 space-y-10">

                            {/* Main Vision Statement */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-8 h-[2px] bg-primary"></span>
                                    <span className="text-3xl font-bold uppercase tracking-widest text-primary">
                                        Our Vision
                                    </span>
                                </div>

                                <h3 className="text-foreground text-2xl md:text-3xl lg:text-4xl leading-[1.2] font-serif font-medium tracking-tight">
                                    To <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">redefine urban renting</span> by creating homes that are easy to live in and easy to manage but hard to leave.
                                </h3>

                                <div className="space-y-4 pt-2">
                                    <h4 className="text-xl font-sans font-medium text-foreground">
                                        Powered by technology, driven by trust.
                                    </h4>
                                    <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl font-sans">
                                        Whether you’re a young professional looking for a stress-free place to live, or a homeowner looking to maximise returns without daily involvement, {brand.name} is built for you.
                                    </p>
                                </div>
                            </div>



                        </div>

                        {/* Right Column - Image */}
                        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 relative">
                            <div className="relative group">
                                {/* Abstract decorations */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse delay-700"></div>

                                <div className="relative w-full aspect-square overflow-hidden rounded-[2rem] bg-background border-[6px] border-background shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out z-10">
                                    <Image
                                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
                                        alt="Modern building perspective"
                                        fill
                                        className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 450px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

                                    {/* Image Overlay Text */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-white/90 text-sm font-medium backdrop-blur-md bg-white/10 p-3 rounded-xl border border-white/20 inline-block">
                                            Building the future of living
                                        </p>
                                    </div>
                                </div>

                                {/* Background Card Effect */}
                                <div className="absolute inset-0 bg-foreground/5 rounded-[2rem] rotate-6 group-hover:rotate-3 transition-all duration-500 -z-10"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Vision;
