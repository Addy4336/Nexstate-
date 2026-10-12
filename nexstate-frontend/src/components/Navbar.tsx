'use client';

import BrandLogo from "@/components/BrandLogo";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';

// Define navigation items
const navItems = [
    // { href: '/', label: 'AI Powered' },
    { href: '/', label: 'For Tenants' },
    { href: '/owner', label: 'For Owners' },
    // { href: '/properties', label: 'Properties' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/blog', label: 'Blog' },
];

export default function Navbar() {
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
        <nav className="fixed top-0 left-0 right-0 z-50 w-full py-4  ">
            <div className="max-w-6xl mx-auto backdrop-blur-xl bg-background/10 border border-border rounded-[2rem]  transition-all duration-300 px-4  sm:px-6 ">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <BrandLogo />
                        </Link>
                    </div>

                    {/* Desktop Menu - Right Aligned */}
                    <div className="hidden lg:flex items-center justify-end flex-1">
                        <div className="flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        isActive(item.href)
                                            ? "px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm transition-all shadow-md"
                                            : "font-medium text-sm text-foreground hover:text-primary transition-colors"
                                    }
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Actions & Mobile Toggle */}
                    <div className="flex items-center gap-4">

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
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-in slide-in-from-top-2">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={
                                    isActive(item.href)
                                        ? "block px-4 py-3 rounded-lg bg-primary/10 text-primary font-semibold text-base"
                                        : "block px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium text-base transition-colors"
                                }
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
