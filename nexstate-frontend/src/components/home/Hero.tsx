import { brand } from "@nexstate/brand";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Clock, Star } from 'lucide-react';

export default function HomeHero() {
    return (
        <section className="relative px-4 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:px-8 lg:pt-28 lg:pb-32 overflow-hidden bg-background">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

                {/* Left Column - Content */}
                <div className="flex flex-col items-start max-w-xl z-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 border border-primary/20 rounded-full text-xs sm:text-sm font-medium text-primary mb-6 sm:mb-8">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.09 8.26L20.79 9.27L15.9 14.14L17.18 20.82L12 17.77L6.82 20.82L8.1 14.14L3.21 9.27L9.91 8.26L12 2Z" fill="currentColor" opacity="0.3" />
                            <path d="M12 2L14.09 8.26L20.79 9.27L15.9 14.14L17.18 20.82L12 17.77L6.82 20.82L8.1 14.14L3.21 9.27L9.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="hidden sm:inline">World's First AI-Powered Rental Platform</span>
                        <span className="sm:hidden">AI-Powered Rental Platform</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-serif font-bold tracking-tight text-foreground leading-[1.15] mb-4 sm:mb-6">
                        The World's First<br />
                        <span className="text-primary">Fully AI-Managed</span><br />
                        Rental Ecosystem.
                    </h1>

                    <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-10 leading-relaxed max-w-lg">
                        Experience the future of living with {brand.name}. Three dedicated AI Agents working 24/7 to handle Sales, Maintenance, and Management instantly.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto">
                        <Link href="/tenants" className="group inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-secondary-foreground transition-all duration-200 bg-secondary rounded-xl hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30">
                            Find Your AI-Powered Home
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/owner" className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-foreground transition-all duration-200 bg-transparent border-2 border-border rounded-xl hover:bg-muted hover:border-foreground/30">
                            For Property Owners
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 sm:gap-8 md:gap-12">
                        <div className="flex flex-col">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">24/7</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">AI Support</span>
                        </div>
                        <div className="w-px h-10 sm:h-12 bg-border"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">100%</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">Uptime</span>
                        </div>
                        <div className="w-px h-10 sm:h-12 bg-border"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">zero</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">Wait Time</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Visual */}
                <div className="relative z-10 mt-8 lg:mt-0">
                    {/* Background Card */}
                    <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/4] rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-2xl shadow-primary/20 bg-muted/30">

                        {/* Main Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/homo-image.jpg"
                                alt="Professional Real Estate Agent AI"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Subtle Light Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating Badge: Sales Agent - Hidden on very small screens */}
                        <div className="absolute top-4 sm:top-8 left-3 sm:left-6 z-20 bg-card/90 backdrop-blur-md px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-chart-2/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-chart-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-foreground">Sales Agent</p>
                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">Find your home instantly</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge: Maintenance Agent */}
                        <div className="absolute top-4 sm:top-8 right-3 sm:right-6 z-20 bg-card/90 backdrop-blur-md px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-border/60 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-secondary/30 flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-foreground">Maintenance</p>
                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">Zero wait repairs</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge: Management Agent - Hidden on mobile */}
                        <div className="hidden sm:block absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 z-20 bg-card/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-border/60 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">Management Agent</p>
                                    <p className="text-[10px] text-muted-foreground">100% operational uptime</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge: Instant Booking */}
                        <div className="absolute bottom-1/3 left-3 sm:left-6 z-20 bg-chart-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg shadow-chart-2/30 animate-in fade-in slide-in-from-left-4 duration-1000 delay-500">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
                                <span className="text-[10px] sm:text-xs font-bold text-white">Instant Booking</span>
                            </div>
                        </div>

                        {/* Floating Badge: 24/7 AI Support - Hidden on mobile */}
                        <div className="hidden sm:block absolute bottom-1/4 right-6 z-20 bg-card/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-border/60 animate-in fade-in slide-in-from-right-4 duration-1000 delay-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-foreground">24/7</p>
                                    <p className="text-[10px] text-muted-foreground">AI Support</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge: AI-Powered - Hidden on mobile */}
                        <div className="hidden md:block absolute top-1/2 right-4 z-20 animate-pulse">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xl">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                        <path d="M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
                                        <path d="M16.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
                                    </svg>
                                </div>
                                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full -z-10"></div>
                            </div>
                        </div>

                        {/* Bottom Stats Bar */}
                        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-20 bg-card/90 backdrop-blur-xl px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl border border-border/60 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-1000">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-2 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-foreground">3 AI Agents</span>
                                </div>
                                <div className="h-3 sm:h-4 w-px bg-border"></div>
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold text-foreground">100%</span>
                                    <p className="text-[8px] sm:text-[9px] text-muted-foreground">Uptime</p>
                                </div>
                                <div className="h-3 sm:h-4 w-px bg-border"></div>
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold text-foreground">0 sec</span>
                                    <p className="text-[8px] sm:text-[9px] text-muted-foreground">Wait</p>
                                </div>
                                <div className="h-3 sm:h-4 w-px bg-border"></div>
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary fill-secondary" />
                                    <span className="text-[10px] sm:text-xs font-bold text-foreground">4.9</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
