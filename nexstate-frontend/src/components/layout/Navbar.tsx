"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { brand, telHref } from "@nexstate/brand";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/components/motion/hooks";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/properties", label: "Homes" },
    { href: "/properties-locations", label: "Cities" },
    { href: "/owner", label: "For owners" },
    { href: "/about-us", label: "About" },
    { href: "/blog", label: "Journal" },
];

/** Routes that open on a dark full-bleed hero: the bar starts transparent with light text there. */
const HERO_ROUTES = ["/"];

export default function Navbar() {
    const pathname = usePathname();
    const lenis = useLenis();
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [open, setOpen] = useState(false);
    const lastY = useRef(0);
    const toggleRef = useRef<HTMLButtonElement>(null);

    // Light-on-dark styling: over the photo hero, or on top of the dark full-screen menu.
    const overHero = (HERO_ROUTES.includes(pathname) && !scrolled) || open;

    // Solid after a short scroll; slides away when scrolling down, returns on scroll up.
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 24);
            if (y > 480 && y > lastY.current + 6) setHidden(true);
            else if (y < lastY.current - 6 || y <= 480) setHidden(false);
            lastY.current = y;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close the menu on navigation.
    useEffect(() => setOpen(false), [pathname]);

    // Lock page scroll while the full-screen menu is open; Escape closes it.
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        lenis?.stop();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            lenis?.start();
            window.removeEventListener("keydown", onKey);
        };
    }, [open, lenis]);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
    const phone = telHref();

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo",
                    hidden && !open ? "-translate-y-full" : "translate-y-0"
                )}
            >
                <div className="container-site pt-3 md:pt-4">
                    <nav
                        aria-label="Primary"
                        className={cn(
                            "flex h-16 items-center justify-between rounded-full px-3 pl-4 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500 md:px-4 md:pl-5",
                            overHero
                                ? "border border-transparent bg-transparent"
                                : "glass border border-line/80 shadow-soft"
                        )}
                    >
                        <Link href="/" aria-label={`${brand.name} home`} className="rounded-full focus-visible:outline-offset-4">
                            <BrandLogo tone={overHero ? "light" : "dark"} />
                        </Link>

                        <ul className="hidden items-center gap-1 lg:flex">
                            {NAV.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            aria-current={active ? "page" : undefined}
                                            className={cn(
                                                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                                                overHero ? "text-ivory/85 hover:text-ivory" : "text-ink/75 hover:text-ink",
                                                active && (overHero ? "text-ivory" : "text-ink")
                                            )}
                                        >
                                            {item.label}
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    "absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-brass transition-transform duration-500 ease-out-expo",
                                                    active && "scale-x-100"
                                                )}
                                            />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                size="pill"
                                variant={overHero ? "light" : "default"}
                                className="hidden sm:inline-flex"
                            >
                                <Link href="/contact">
                                    Get in touch <ArrowUpRight />
                                </Link>
                            </Button>
                            <button
                                ref={toggleRef}
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                aria-expanded={open}
                                aria-controls="mobile-menu"
                                aria-label={open ? "Close menu" : "Open menu"}
                                className={cn(
                                    "inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden",
                                    overHero ? "text-ivory hover:bg-ivory/10" : "text-ink hover:bg-sand"
                                )}
                            >
                                {open ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                        data-lenis-prevent
                        className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-8 pt-28 text-ivory lg:hidden"
                        initial={{ clipPath: "inset(0 0 100% 0)" }}
                        animate={{ clipPath: "inset(0 0 0% 0)" }}
                        exit={{ clipPath: "inset(0 0 100% 0)" }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                    >
                        <ul className="flex flex-1 flex-col justify-center gap-1">
                            {[{ href: "/", label: "Home" }, ...NAV].map((item, i) => (
                                <motion.li
                                    key={item.href}
                                    initial={{ opacity: 0, y: 28 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.06, duration: 0.7, ease: EASE_OUT } }}
                                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                >
                                    <Link
                                        href={item.href}
                                        aria-current={isActive(item.href) ? "page" : undefined}
                                        className={cn(
                                            "flex min-h-14 items-baseline gap-4 border-b border-ivory/10 py-3 font-serif text-4xl tracking-tight transition-colors sm:text-5xl",
                                            isActive(item.href) ? "text-brass" : "text-ivory hover:text-brass"
                                        )}
                                    >
                                        <span className="w-6 font-sans text-xs tabular-nums text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                                        {item.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.div
                            className="mt-8 space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.55, duration: 0.6 } }}
                            exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        >
                            <Button asChild size="xl" variant="brass" className="w-full">
                                <Link href="/contact">
                                    Get in touch <ArrowUpRight />
                                </Link>
                            </Button>
                            <p className="text-sm text-ivory/55">
                                {phone && (
                                    <a href={phone} className="mr-4 hover:text-ivory">
                                        {brand.contact.phone}
                                    </a>
                                )}
                                {brand.contact.email && (
                                    <a href={`mailto:${brand.contact.email}`} className="hover:text-ivory">
                                        {brand.contact.email}
                                    </a>
                                )}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
