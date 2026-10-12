'use client';

import { brand } from "@nexstate/brand";
import { ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FooterSection() {
    return (
        <div className='px-4 py-6 md:px-8 md:py-12'>
            <footer className="rounded-3xl md:rounded-[2.5rem] bg-foreground text-white py-8 md:py-20 relative overflow-hidden">

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 mb-8 md:mb-24">

                        {/* Brand & Newsletter (Col 5) */}
                        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-10">
                            <div className="flex flex-col gap-4">
                                <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                    {brand.name}
                                </div>
                                <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md font-light">
                                    {brand.description}
                                </p>
                                <div className="flex flex-col gap-1 text-zinc-400 text-sm md:text-base font-light">
                                    {brand.contact.address && <p>{brand.contact.address}</p>}
                                    {brand.contact.phone && <p className="mt-2">{brand.contact.phone}</p>}
                                    {brand.contact.email && <p>{brand.contact.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links (Col 7) */}
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 lg:gap-8">
                            {/* Column 1: For You */}
                            <div className="flex flex-col gap-5 md:gap-6">
                                <h4 className="font-medium text-white text-base md:text-lg">For You</h4>
                                <div className="flex flex-col gap-3 md:gap-4 text-zinc-400 font-light text-sm md:text-base">
                                    <Link href="/tenants" className="hover:text-white transition-colors duration-300">For Tenants</Link>
                                    <Link href="/owner" className="hover:text-white transition-colors duration-300">For Owners</Link>
                                    <Link href="/properties" className="hover:text-white transition-colors duration-300">Browse Properties</Link>
                                    <Link href="/properties-locations" className="hover:text-white transition-colors duration-300">Locations</Link>
                                </div>
                            </div>

                            {/* Column 2: Company */}
                            <div className="flex flex-col gap-5 md:gap-6">
                                <h4 className="font-medium text-white text-base md:text-lg">Company</h4>
                                <div className="flex flex-col gap-3 md:gap-4 text-zinc-400 font-light text-sm md:text-base">
                                    <Link href="/about-us" className="hover:text-white transition-colors duration-300">About Us</Link>
                                    <Link href="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
                                    <Link href="/contact" className="hover:text-white transition-colors duration-300">Contact Us</Link>
                                    <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
                                </div>
                            </div>


                            {/* Column 3: AI Features */}
                            <div className="flex flex-col gap-5 md:gap-6">
                                <h4 className="font-medium text-white text-base md:text-lg">AI Agents</h4>
                                <div className="flex flex-col gap-3 md:gap-4 text-zinc-400 font-light text-sm md:text-base">
                                    <div className="flex items-center gap-2 group">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        <span className="group-hover:text-white transition-colors">Sales Copilot</span>
                                    </div>
                                    <div className="flex items-center gap-2 group">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        <span className="group-hover:text-white transition-colors">Valuation Engine</span>
                                    </div>
                                    <div className="flex items-center gap-2 group">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        <span className="group-hover:text-white transition-colors">CMS Copilot</span>
                                    </div>
                                    <div className="flex items-center gap-2 group">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                                        <span className="group-hover:text-white transition-colors">24/7 AI Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-white/5 md:border-none pt-6 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">

                        <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} {brand.legalName}. All rights reserved.</p>

                        <div className="flex items-center gap-6 md:gap-8">
                            {brand.social.instagram && <Link href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-zinc-500 hover:text-white transition-colors duration-300"><Instagram className="w-5 h-5 stroke-1" /></Link>}
                            {brand.social.x && (
                                <Link href={brand.social.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="text-zinc-500 hover:text-white transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x w-4 h-4" viewBox="0 0 16 16">
                                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                                    </svg>
                                </Link>
                            )}
                            {brand.social.linkedin && <Link href={brand.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-zinc-500 hover:text-white transition-colors duration-300"><Linkedin className="w-5 h-5 stroke-1" /></Link>}
                            {brand.social.facebook && <Link href={brand.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-zinc-500 hover:text-white transition-colors duration-300"><Facebook className="w-5 h-5 stroke-1" /></Link>}
                        </div>                    </div>

                </div>
            </footer>
        </div>
    );
}
