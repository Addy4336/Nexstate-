import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function ContactCTA() {
    return (
        <section className="bg-background pb-12 md:pb-24">
            <div className="container mx-auto px-4 md:px-12">
                <div className="bg-primary relative rounded-[2rem] px-6 py-8 md:px-12 md:py-16 overflow-hidden shadow-xl shadow-primary/20">

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">

                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[10px] md:text-xs font-medium uppercase tracking-wider w-auto mx-auto lg:mx-0">
                                <Mail className="w-3 h-3" />
                                <span>Newsletter</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                Get ROI Updates & Market News
                            </h2>
                            <p className="text-white/70 text-base max-w-lg mx-auto lg:mx-0">
                                Subscribe to our newsletter to receive the latest news, exclusive offers, and real estate insights directly to your inbox.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="w-full lg:w-5/12">
                            <form className="flex flex-col sm:flex-row gap-2 w-full bg-white/10 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none placeholder:text-white/50 text-white text-sm w-full"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-white text-[#23527C] text-sm font-bold rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-all shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
                                >
                                    SUBSCRIBE
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                            <p className="text-white/40 text-[10px] mt-3 text-center lg:text-left pl-2">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
