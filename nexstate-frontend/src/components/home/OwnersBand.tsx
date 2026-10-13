import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { siteImages } from "@/lib/site-images";

/** "30%" -> { value: 30, suffix: "%" }. Returns null when a claim is not numeric, so that stat is skipped. */
function parseClaim(text: string): { value: number; suffix: string } | null {
    const m = text.match(/^\s*(\d+(?:\.\d+)?)\s*(.*)$/);
    return m ? { value: parseFloat(m[1]), suffix: m[2] } : null;
}

export function OwnersBand() {
    const yieldClaim = parseClaim(brand.claims.yieldUplift);
    const occupancy = parseClaim(brand.claims.occupancy);
    const stats = [
        yieldClaim && { ...yieldClaim, label: "Higher yield than a traditional lease" },
        occupancy && { ...occupancy, label: "Typical occupancy across managed homes" },
        { value: brand.claims.maxLeaseYears, suffix: " yrs", label: "Longest lease we structure for owners" },
    ].filter(Boolean) as { value: number; suffix: string; label: string }[];

    return (
        <Section tone="ink" spacing="lg" id="owners">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-6">
                    <SectionHeading
                        tone="ink"
                        layout="stacked"
                        eyebrow="For property owners"
                        title="Own a home? Let it *earn*"
                        lead="We furnish, list, rent and look after your property, then send a clear monthly statement. You keep the asset; we handle the work."
                        actions={
                            <>
                                <Button asChild size="xl" variant="brass">
                                    <Link href="/owner">
                                        List your property <ArrowRight />
                                    </Link>
                                </Button>
                                <Button asChild size="xl" variant="outline-light">
                                    <Link href="/owner#consultation-form">Book a consultation</Link>
                                </Button>
                            </>
                        }
                    />
                    <RevealGroup className="mt-14 grid grid-cols-3 gap-4 border-t border-ivory/10 pt-8" stagger={0.1}>
                        {stats.map((s) => (
                            <RevealItem key={s.label}>
                                <CountUp value={s.value} suffix={s.suffix} className="font-serif text-4xl text-ivory md:text-6xl" />
                                <p className="mt-3 text-xs leading-snug text-ivory/60 md:text-sm">{s.label}</p>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                    <Reveal delay={0.2}>
                        <p className="mt-6 text-xs text-ivory/40">
                            Illustrative figures for demonstration; actual results vary by property and city.
                        </p>
                    </Reveal>
                </div>

                <div className="lg:col-span-6">
                    <ImageReveal
                        src={siteImages.livingChandelier.src}
                        alt={siteImages.livingChandelier.alt}
                        blurDataURL={siteImages.livingChandelier.blurDataURL}
                        sizes="(min-width: 1024px) 48vw, 100vw"
                        from="right"
                        className="aspect-[4/5] rounded-3xl md:aspect-[5/4] lg:aspect-[4/5]"
                    />
                </div>
            </div>
        </Section>
    );
}
