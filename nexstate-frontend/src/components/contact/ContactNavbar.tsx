'use client';

import BrandLogo from "@/components/BrandLogo";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

// Define navigation items (same as main Navbar)
const navItems = [
    { href: '/', label: 'AI Powered' },
    { href: '/tenants', label: 'For Tenants' },
    { href: '/owner', label: 'For Owners' },
    { href: '/properties', label: 'Properties' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/blog', label: 'Blog' },
];

export default function ContactNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Check if a route is active
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-all duration-300">

                {/* Logo Section */}
                <div className="shrink-0 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <BrandLogo />
                    </Link>
                </div>

                {/* Desktop Menu - Centered */}
                <div className="hidden lg:flex items-center justify-center flex-1">
                    <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={
                                    isActive(item.href)
                                        ? "text-primary font-semibold"
                                        : "hover:text-primary transition-colors"
                                }
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Actions & Mobile Toggle */}
                <div className="flex items-center gap-3">

                    {/* Buttons - Desktop */}
                    <div className="hidden lg:flex items-center gap-3">

                        <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full font-medium text-sm transition-all">
                            Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-24 left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in slide-in-from-top-2 z-50">
                    <div className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={
                                    isActive(item.href)
                                        ? "block px-4 py-3 rounded-lg bg-primary/10 text-primary font-semibold text-base"
                                        : "block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-base transition-colors"
                                }
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-100 mt-2 flex flex-col gap-3">

                            <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-medium text-base transition-all">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
