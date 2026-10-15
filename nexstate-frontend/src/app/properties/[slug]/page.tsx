import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { formatMoney } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/layout/Section";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { TiltCard } from "@/components/motion/TiltCard";
import { FinalCta } from "@/components/home/FinalCta";
import { PropertyCard } from "@/components/property/PropertyCard";
import { apiGet } from "@/lib/server-api";
import { areaOf, groupAreas, nameFromSlug } from "@/lib/areas";
import { cityOf } from "@/lib/property-filters";
import { cityImageFor, siteImages } from "@/lib/site-images";
import type { Property } from "@/types/property";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getAreaProperties(slug: string) {
    const term = nameFromSlug(slug);
    return apiGet<Property[]>(`/properties/search?location=${encodeURIComponent(term)}`, [], 60);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const properties = await getAreaProperties(slug);
    const name = properties[0] ? areaOf(properties[0].location) : nameFromSlug(slug);
    return {
        title: `Furnished homes in ${name}`,
        description: `Browse furnished homes for rent in ${name}${properties[0] ? `, ${cityOf(properties[0].location)}` : ""}, with live availability and transparent pricing.`,
    };
}

export default async function AreaPage({ params }: PageProps) {
    const { slug } = await params;
    const [properties, everything] = await Promise.all([
        getAreaProperties(slug),
        apiGet<Property[]>("/properties?limit=100", []),
    ]);

    const first = properties[0];
    const name = first ? areaOf(first.location) : nameFromSlug(slug);
    const city = first ? cityOf(first.location) : "";
    const photo = city ? cityImageFor(city) : siteImages.heroVilla;
    const others = groupAreas(everything).filter((a) => a.slug !== slug);

    const prices = properties.map((p) => p.price);
    const beds = properties.map((p) => p.bedrooms);
    const stats = [
        { label: properties.length === 1 ? "Home available" : "Homes available", value: String(properties.length) },
        { label: "Starting from / month", value: prices.length ? formatMoney(Math.min(...prices)) : "—" },
        {
            label: "Bedrooms",
            value: beds.length ? (Math.min(...beds) === Math.max(...beds) ? String(beds[0]) : `${Math.min(...beds)} to ${Math.max(...beds)}`) : "—",
        },
    ];

    return (
        <main>
            {/* Hero: the city's photo, the area's name */}
            <section className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden bg-ink text-ivory md:min-h-[70svh]">
                <ParallaxImage
                    src={photo.src}
                    alt=""
                    blurDataURL={photo.blurDataURL}
                    priority
                    sizes="100vw"
                    strength={10}
                    className="absolute inset-0 -z-10"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/25 to-ink/85" />
                <Container className="pb-10 pt-36 md:pb-14">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ivory/70">
                        <Link href="/properties-locations" className="hover:text-ivory">
                            Cities
                        </Link>
                        {city && (
                            <>
                                <ChevronRight className="size-3.5" aria-hidden="true" />
                                <Link href={`/properties?location=${encodeURIComponent(city)}`} className="hover:text-ivory">
                                    {city}
                                </Link>
                            </>
                        )}
                    </nav>
                    <RevealText
                        as="h1"
                        immediate
                        delay={0.3}
                        text={`Homes in *${name}*`}
                        className="text-display mt-6 max-w-4xl"
                        emphasisClassName="italic text-brass"
                    />
                    <Reveal delay={0.6} className="mt-5 max-w-xl">
                        <p className="text-lead text-ivory/80">
                            Ready to move in, priced upfront, with live availability for your dates.
                        </p>
                    </Reveal>
                </Container>
            </section>

            {/* Stats strip */}
            <section className="border-b border-line bg-ivory">
                <Container>
                    <dl className="grid grid-cols-3 divide-x divide-line">
                        {stats.map((s) => (
                            <div key={s.label} className="px-3 py-6 first:pl-0 md:px-8 md:py-8">
                                <dd className="font-serif text-2xl leading-none tracking-tight md:text-4xl">{s.value}</dd>
                                <dt className="mt-2 text-xs text-stone md:text-sm">{s.label}</dt>
                            </div>
                        ))}
                    </dl>
                </Container>
            </section>

            {/* Homes */}
            {properties.length > 0 ? (
                <Section tone="ivory">
                    <SectionHeading
                        eyebrow="Available now"
                        title={`Stay in *${name}*`}
                        lead="Every home is fully furnished. Open one to check your dates and see the full price breakdown."
                        actions={
                            <Button asChild size="pill" variant="outline-dark">
                                <Link href="/properties">
                                    All homes <ArrowRight />
                                </Link>
                            </Button>
                        }
                    />
                    <RevealGroup className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" stagger={0.1}>
                        {properties.map((p, i) => (
                            <RevealItem key={p.id}>
                                <TiltCard max={3}>
                                    <PropertyCard property={p} priority={i === 0} />
                                </TiltCard>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </Section>
            ) : (
                <Section tone="ivory">
                    <div className="mx-auto max-w-xl py-10 text-center">
                        <Eyebrow className="justify-center">Coming soon</Eyebrow>
                        <h2 className="text-headline mt-4">No homes in {name} just yet</h2>
                        <p className="text-lead mt-5 text-stone">
                            We are adding new homes all the time. Browse what is available now, or tell us what you are looking for.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Button asChild size="xl">
                                <Link href="/properties">
                                    Browse all homes <ArrowRight />
                                </Link>
                            </Button>
                            <Button asChild size="xl" variant="outline-dark">
                                <Link href="/contact">Tell us what you need</Link>
                            </Button>
                        </div>
                    </div>
                </Section>
            )}

            {/* Other neighbourhoods */}
            {others.length > 0 && (
                <Section tone="sand" spacing="sm">
                    <p className="eyebrow">Keep exploring</p>
                    <ul className="mt-6 flex flex-wrap gap-3">
                        {others.map((a) => (
                            <li key={a.slug}>
                                <Link
                                    href={`/properties/${a.slug}`}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[15px] transition-colors hover:border-ink/40"
                                >
                                    <span className="font-medium">{a.name}</span>
                                    <span className="text-stone">{a.city}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            <FinalCta />
        </main>
    );
}
