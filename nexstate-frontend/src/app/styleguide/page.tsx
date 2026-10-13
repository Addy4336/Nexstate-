import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cityImages, imageProps, siteImages } from "@/lib/site-images";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/layout/Section";
import {
    CountUp,
    HorizontalScroller,
    ImageReveal,
    Marquee,
    ParallaxImage,
    Reveal,
    RevealGroup,
    RevealItem,
    RevealText,
    TiltCard,
} from "@/components/motion";

/**
 * Internal style guide: every design-system building block on one page, for review.
 * Development only; production builds return 404.
 */
export const metadata: Metadata = { title: "Style guide", robots: { index: false, follow: false } };

const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const IMG = {
    villa: u("1613490493576-7fde63acd811"),
    living: u("1600210492486-724fe5c67fb0"),
    kitchen: u("1600607687939-ce8a6c25118c"),
    bedroom: u("1505693416388-ac5ce068fe85"),
    city: u("1570168007204-dfb528c6958f", 2400),
    pool: u("1600596542815-ffad4c1539a9"),
    exterior: u("1600585154340-be6161a56a0c"),
    loft: u("1512917774080-9991f1c4c750"),
};

const swatches = [
    ["ink", "#0E1A16", "bg-ink text-ivory"],
    ["forest", "#1F3A32", "bg-forest text-ivory"],
    ["brass", "#B8925A", "bg-brass text-ink"],
    ["brass-deep", "#8C6A3A", "bg-brass-deep text-ivory"],
    ["sand", "#EFE7DA", "bg-sand text-ink"],
    ["ivory", "#FAF7F2", "bg-ivory text-ink border border-line"],
    ["stone", "#5E6660", "bg-stone text-ivory"],
    ["line", "#E2D9CB", "bg-line text-ink"],
] as const;

export default function StyleguidePage() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <main className="pt-24">
            {/* Type + colour */}
            <Section spacing="sm">
                <Eyebrow>Design system</Eyebrow>
                <RevealText as="h1" immediate text="Homes that feel *yours* from day one" className="text-display mt-5 max-w-4xl" />
                <p className="text-lead mt-6 max-w-2xl text-stone">
                    Fraunces for headlines, Inter for reading. Body copy stays at 16 to 18px with a comfortable line length, and
                    accents are used sparingly so photography carries the page.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button size="xl">
                        Browse homes <ArrowRight />
                    </Button>
                    <Button size="xl" variant="brass">
                        List your property <ArrowRight />
                    </Button>
                    <Button size="xl" variant="outline-dark">
                        Talk to us
                    </Button>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                    {swatches.map(([name, hex, cls]) => (
                        <div key={name} className={`rounded-xl p-4 ${cls}`}>
                            <p className="text-sm font-medium">{name}</p>
                            <p className="text-xs opacity-75">{hex}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12 space-y-3">
                    <p className="text-display">Display</p>
                    <p className="text-headline">Headline</p>
                    <p className="text-title">Title</p>
                    <p className="text-lead text-stone">Lead paragraph for introductions.</p>
                </div>
            </Section>

            {/* Split heading + image reveal */}
            <Section tone="sand">
                <SectionHeading
                    eyebrow="Why NexState"
                    title="Fully furnished, *properly* managed"
                    lead="Split headings put the statement on the left and the supporting line on the right, instead of centring everything."
                    actions={
                        <Button size="pill" variant="outline-dark">
                            How it works <ArrowRight />
                        </Button>
                    }
                />
                <div className="mt-14 grid gap-5 md:grid-cols-12">
                    <ImageReveal src={IMG.living} alt="Sunlit living room" className="aspect-[4/5] rounded-2xl md:col-span-7 md:aspect-auto md:h-[560px]" />
                    <div className="grid gap-5 md:col-span-5">
                        <ImageReveal src={IMG.kitchen} alt="Modern kitchen" from="left" delay={0.1} className="aspect-[4/3] rounded-2xl" />
                        <ImageReveal src={IMG.bedroom} alt="Calm bedroom" from="right" delay={0.2} className="aspect-[4/3] rounded-2xl" />
                    </div>
                </div>
            </Section>

            {/* Full-bleed parallax break */}
            <ParallaxImage src={IMG.city} alt="City skyline at dusk" className="h-[70vh] min-h-[420px]" sizes="100vw" strength={14}>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
                <Container className="absolute inset-x-0 bottom-0 pb-14 text-ivory md:pb-20">
                    <Eyebrow light>Parallax break</Eyebrow>
                    <RevealText text="Six cities. *One* standard of living." className="text-headline mt-4 max-w-3xl" emphasisClassName="italic text-brass" />
                </Container>
            </ParallaxImage>

            {/* Marquee */}
            <section className="border-y border-line bg-ivory py-6">
                <Marquee duration={35}>
                    {["Bengaluru", "Mumbai", "Goa", "Delhi NCR", "Pune", "Hyderabad"].map((c) => (
                        <span key={c} className="mx-8 flex items-center gap-8 font-serif text-3xl text-ink md:text-4xl">
                            {c}
                            <span className="size-1.5 rounded-full bg-brass" />
                        </span>
                    ))}
                </Marquee>
            </section>

            {/* Stats on dark */}
            <Section tone="ink">
                <SectionHeading tone="ink" eyebrow="For owners" title="Numbers that *hold up*" lead="Counters render their final value on the server and only animate once, so they are never shown stuck mid-count." />
                <RevealGroup className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ivory/10 lg:grid-cols-4">
                    {[
                        { v: 98, s: "%", l: "Average occupancy" },
                        { v: 30, s: "%", l: "Higher yield vs long lease" },
                        { v: 4.8, d: 1, s: "/5", l: "Resident rating" },
                        { v: 72, s: "h", l: "Maintenance turnaround" },
                    ].map((x) => (
                        <RevealItem key={x.l} className="bg-ink p-6 md:p-8">
                            <CountUp value={x.v} decimals={x.d} suffix={x.s} className="font-serif text-5xl text-ivory md:text-6xl" />
                            <p className="mt-3 text-sm text-ivory/65">{x.l}</p>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </Section>

            {/* Pinned horizontal row */}
            <HorizontalScroller
                className="bg-ivory py-20 lg:pb-0"
                header={
                    <Container className="mb-10">
                        <SectionHeading eyebrow="Featured homes" title="Scroll *sideways* through the collection" lead="On desktop this section pins and vertical scroll moves the row. On tablets and phones it is a swipeable row." />
                    </Container>
                }
            >
                {[IMG.villa, IMG.pool, IMG.exterior, IMG.loft, IMG.living, IMG.bedroom].map((src, i) => (
                    <TiltCard key={i} className="w-[min(78vw,400px)] shrink-0 snap-start lg:w-[34vh]">
                        <div className="group overflow-hidden rounded-2xl bg-white shadow-soft">
                            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[50vh]">
                                <ParallaxImage src={src} alt="" className="h-full" sizes="400px" strength={6} imageClassName="transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="flex items-baseline justify-between p-5">
                                <p className="font-serif text-xl">Home {i + 1}</p>
                                <p className="text-sm font-medium text-brass-deep">₹1,85,000/mo</p>
                            </div>
                        </div>
                    </TiltCard>
                ))}
            </HorizontalScroller>

            {/* Photography library */}
            <Section tone="ivory" spacing="sm">
                <SectionHeading eyebrow="Photography" title="The *photo* library" lead="Free-licence Unsplash photos, resized to WebP with blur placeholders. Credits live in public/images/CREDITS.md." />
                <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Object.entries(siteImages)
                        .filter(([k]) => !k.startsWith("city"))
                        .map(([k, img]) => (
                            <figure key={k} className="overflow-hidden rounded-xl bg-sand">
                                <Image {...imageProps(img)} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/3] w-full object-cover" />
                                <figcaption className="px-3 py-2 text-xs text-stone">{k} · {img.credit.name}</figcaption>
                            </figure>
                        ))}
                </div>
                <h3 className="text-title mt-14">City cards</h3>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {cityImages.map((c) => (
                        <a key={c.slug} href="#" className="group relative block aspect-[3/4] overflow-hidden rounded-2xl">
                            <Image {...imageProps(c.image)} sizes="(min-width: 1024px) 16vw, 50vw" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                                <p className="font-serif text-xl">{c.name}</p>
                                <p className="text-xs text-ivory/70">{c.blurb}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </Section>

            {/* Reveal directions */}
            <Section tone="white" spacing="sm">
                <SectionHeading layout="center" eyebrow="Reveals" title="One motion vocabulary" lead="Every reveal uses the same easing and only animates opacity and transform." />
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(["up", "left", "right", "scale"] as const).map((d, i) => (
                        <Reveal key={d} direction={d} delay={i * 0.08} className="rounded-2xl border border-line bg-ivory p-8">
                            <p className="font-serif text-2xl capitalize">{d}</p>
                            <p className="mt-2 text-sm text-stone">Reveal direction=&quot;{d}&quot;</p>
                        </Reveal>
                    ))}
                </div>
            </Section>

            <Section tone="forest" spacing="sm">
                <SectionHeading layout="center" tone="forest" eyebrow="Call to action" title="Ready when *you* are" actions={<><Button size="xl" variant="brass">Find a home <ArrowRight /></Button><Button size="xl" variant="outline-light">List a property</Button></>} />
            </Section>
        </main>
    );
}
