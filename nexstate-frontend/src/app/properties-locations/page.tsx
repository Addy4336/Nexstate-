import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatMoney } from "@nexstate/brand";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/layout/Section";
import { RevealText } from "@/components/motion/RevealText";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CityGrid } from "@/components/home/CityGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { apiGet } from "@/lib/server-api";
import { groupAreas } from "@/lib/areas";
import { cityImageFor, fillProps } from "@/lib/site-images";
import type { Property } from "@/types/property";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Cities and neighbourhoods",
    description: "Furnished homes across Bengaluru, Mumbai, Goa, Delhi NCR, Hyderabad and Pune. Pick a city, then a neighbourhood.",
};

export default async function CitiesPage() {
    const properties = await apiGet<Property[]>("/properties?limit=100", []);
    const areas = groupAreas(properties);

    return (
        <main>
            <section className="bg-ivory pb-4 pt-32 md:pt-40">
                <Container>
                    <Eyebrow>Cities</Eyebrow>
                    <RevealText as="h1" immediate text="Where will you *live*?" className="text-display mt-4 max-w-3xl" />
                    <p className="text-lead mt-5 max-w-xl text-stone">
                        Six cities, each with its own rhythm. Choose one to see its homes, or jump straight to a neighbourhood below.
                    </p>
                </Container>
            </section>

            <CityGrid properties={properties} tone="ivory" heading={false} />

            {areas.length > 0 && (
                <Section tone="sand" id="neighbourhoods">
                    <SectionHeading
                        eyebrow="Neighbourhoods"
                        title="Streets we *know* well"
                        lead="Every neighbourhood below has furnished homes you can book today, with live availability."
                    />
                    <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3" stagger={0.08}>
                        {areas.map((a) => (
                            <RevealItem key={a.slug}>
                                <Link
                                    href={`/properties/${a.slug}`}
                                    className="group flex items-center gap-5 rounded-2xl border border-line bg-white p-4 transition-shadow duration-500 hover:shadow-lift"
                                >
                                    <span className="relative size-24 shrink-0 overflow-hidden rounded-xl">
                                        <Image
                                            {...fillProps(cityImageFor(a.city))}
                                            alt=""
                                            fill
                                            sizes="96px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-serif text-2xl leading-tight tracking-tight">{a.name}</span>
                                        <span className="mt-1 block text-sm text-stone">{a.city}</span>
                                        <span className="mt-2 block text-sm text-ink/80">
                                            {a.count} {a.count === 1 ? "home" : "homes"} · from{" "}
                                            <span className="font-medium text-brass-deep">{formatMoney(a.fromPrice)}</span>
                                        </span>
                                    </span>
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        className="size-5 shrink-0 text-stone transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                                    />
                                </Link>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </Section>
            )}

            <FinalCta />
        </main>
    );
}
