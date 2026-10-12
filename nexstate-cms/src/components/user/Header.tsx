"use client";

import { brand } from "@nexstate/brand";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Home", href: "/" },
    {
        label: "For Tenants",
        href: "#tenants",
        submenu: [
            { label: "Browse Properties", href: "/properties" },
            { label: "Saved Properties", href: "/favorites" },
            { label: "Cost Calculator", href: "/tools/cost-calculator" },
            { label: "How It Works", href: "/#how-it-works" },
        ]
    },
    {
        label: "For Owners",
        href: "#owners",
        submenu: [
            { label: "Owner Portal", href: "/owners" },
            { label: "List Your Property", href: "/list-property" },
            { label: "ROI Calculator", href: "/tools/roi-calculator" },
        ]
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <nav className="bg-background border border-border rounded-2xl px-6 py-4 shadow-md">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                <span className="text-accent-foreground font-bold text-xl">{brand.name.charAt(0)}</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">{brand.wordmark.primary}<span className="text-secondary">{brand.wordmark.accent}</span></span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
                                    onMouseLeave={() => setActiveSubmenu(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                        {item.submenu && <ChevronDown className="w-4 h-4" />}
                                    </Link>

                                    <AnimatePresence>
                                        {item.submenu && activeSubmenu === item.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-xl p-2 shadow-lg"
                                            >
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.label}
                                                        href={subItem.href}
                                                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link href="/favorites" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                                <Link href="/admin/login">Sign In</Link>
                            </Button>
                            <Button className="btn-primary text-sm px-5 py-2" asChild>
                                <Link href="/properties">Book Now</Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-foreground"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="lg:hidden mt-4 pt-4 border-t border-border overflow-hidden"
                            >
                                <div className="flex flex-col gap-4">
                                    {navItems.map((item) => (
                                        <div key={item.label}>
                                            <Link
                                                href={item.href}
                                                className="text-foreground font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                            {item.submenu && (
                                                <div className="mt-2 ml-4 flex flex-col gap-2">
                                                    {item.submenu.map((subItem) => (
                                                        <Link
                                                            key={subItem.label}
                                                            href={subItem.href}
                                                            className="text-sm text-muted-foreground"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <Link
                                        href="/favorites"
                                        className="flex items-center gap-2 text-foreground font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Heart className="w-4 h-4" /> Saved Properties
                                    </Link>
                                    <div className="flex flex-col gap-2 pt-4 border-t border-border">
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/admin/login">Sign In</Link>
                                        </Button>
                                        <Button className="btn-primary w-full" asChild>
                                            <Link href="/properties">Book Now</Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </div>
        </header>
    );
}
