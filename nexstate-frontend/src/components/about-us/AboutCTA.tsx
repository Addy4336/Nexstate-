import { brand } from "@nexstate/brand";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building, Handshake } from 'lucide-react';

const AboutCTA = () => {
    return (
        <section className="bg-background py-10">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">

                <div className="bg-muted/30 rounded-[40px] md:rounded-[60px] p-8 md:p-16 lg:p-24 text-center border border-border/40 relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 max-w-[800px] mx-auto">
                        <h2 className="text-[32px] md:text-[48px] font-medium leading-[1.15] mb-6 text-foreground">
                            Built for Today’s Renters & Owners
                        </h2>
                        <p className="text-muted-foreground text-[16px] md:text-[18px] leading-[1.7] mb-12">
                            Whether you’re a young professional looking for a stress-free place to live, or a homeowner looking to maximize returns without daily involvement, {brand.name} is built for you.
                        </p>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12 opacity-50"></div>

                        <div className="flex flex-col items-center">
                            <h3 className="text-[24px] font-medium mb-3">Ready to Get Started?</h3>
                            <p className="text-muted-foreground mb-10 text-[15px]">Find your next home or partner with us to manage yours — seamlessly.</p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link href="/properties" className="group inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                    <Building size={18} className="mr-2" />
                                    Explore Homes
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/owner#owner-consultation-form" className="group inline-flex items-center justify-center h-14 px-8 rounded-full bg-background border border-border text-foreground font-medium hover:bg-muted/50 transition-all hover:border-primary/50">
                                    <Handshake size={18} className="mr-2" />
                                    Partner With Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutCTA;
