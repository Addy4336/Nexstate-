import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { brand, socialLinks, telHref } from "@nexstate/brand";
import BrandLogo from "@/components/BrandLogo";
import { Container } from "@/components/layout/Section";

const COLUMNS = [
    {
        title: "Find a home",
        links: [
            { href: "/properties", label: "Browse homes" },
            { href: "/properties-locations", label: "Cities" },
            { href: "/contact", label: "Talk to us" },
        ],
    },
    {
        title: "Property owners",
        links: [
            { href: "/owner", label: "List your property" },
            { href: "/owner#consultation-form", label: "Book a consultation" },
            { href: "/owner", label: "Returns calculator" },
        ],
    },
    {
        title: "Company",
        links: [
            { href: "/about-us", label: "About" },
            { href: "/blog", label: "Journal" },
            { href: "/contact", label: "Contact" },
        ],
    },
];

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
        </svg>
    );
}

const socialIcon = {
    instagram: <Instagram className="size-[18px]" />,
    x: <XIcon />,
    linkedin: <Linkedin className="size-[18px]" />,
    facebook: <Facebook className="size-[18px]" />,
} as const;

export default function Footer() {
    const phone = telHref();
    const socials = socialLinks();

    return (
        <footer className="relative overflow-hidden bg-ink text-ivory">
            {/* Oversized wordmark as a quiet backdrop */}
            <p
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[clamp(6rem,24vw,22rem)] leading-none tracking-tighter text-ivory/[0.035]"
            >
                {brand.name}
            </p>

            <Container className="relative pb-8 pt-20 md:pt-28">
                <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <BrandLogo tone="light" />
                        <p className="mt-6 max-w-sm text-lead text-ivory/70">{brand.tagline}.</p>
                        <Link
                            href="/contact"
                            className="group mt-8 inline-flex items-center gap-2 border-b border-brass pb-1 font-serif text-2xl text-ivory transition-colors hover:text-brass"
                        >
                            Start a conversation
                            <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
                        {COLUMNS.map((col) => (
                            <div key={col.title}>
                                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brass">{col.title}</h2>
                                <ul className="mt-5 space-y-3.5">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="inline-block text-[15px] text-ivory/70 transition-colors hover:text-ivory">
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-16 grid gap-8 border-t border-ivory/10 pt-8 text-sm text-ivory/60 md:mt-24 md:grid-cols-12 md:items-center">
                    <address className="not-italic md:col-span-7">
                        <span className="flex flex-wrap gap-x-6 gap-y-1">
                            {brand.contact.email && (
                                <a href={`mailto:${brand.contact.email}`} className="hover:text-ivory">
                                    {brand.contact.email}
                                </a>
                            )}
                            {phone && (
                                <a href={phone} className="hover:text-ivory">
                                    {brand.contact.phone}
                                </a>
                            )}
                            {brand.contact.address && <span>{brand.contact.address}</span>}
                            <span>
                                {brand.market.city}, {brand.market.country}
                            </span>
                        </span>
                    </address>
                    {socials.length > 0 && (
                        <ul className="flex items-center gap-2 md:col-span-5 md:justify-end">
                            {socials.map((s) => (
                                <li key={s.key}>
                                    <a
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.key}
                                        className="flex size-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-brass hover:text-brass"
                                    >
                                        {socialIcon[s.key]}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <p className="mt-8 text-xs text-ivory/40">
                    © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
                    {brand.licenseBadge && <span className="ml-3">{brand.licenseBadge}</span>}
                </p>
            </Container>
        </footer>
    );
}
