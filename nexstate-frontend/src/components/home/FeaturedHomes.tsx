import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { HorizontalScroller } from "@/components/motion/HorizontalScroller";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/types/property";

const TITLE = "Homes we *love* right now";
const LEAD = "Hand-picked, fully furnished and ready to move in. Every home shows live availability and a full price breakdown.";

function AllHomesButton() {
    return (
        <Button asChild size="pill" variant="outline-dark">
            <Link href="/properties">
                View all homes <ArrowRight />
            </Link>
        </Button>
    );
}

/**
 * With enough homes the row pins and scrolls sideways on desktop (swipeable on touch).
 * With only a few, a pinned scroller would just be dead scroll, so they sit in a grid instead.
 */
export function FeaturedHomes({ properties }: { properties: Property[] }) {
    const homes = properties.slice(0, 8);
    if (homes.length === 0) return null;

    if (homes.length < 5) {
        return (
            <Section tone="ivory" id="homes">
                <SectionHeading eyebrow="Featured homes" title={TITLE} lead={LEAD} actions={<AllHomesButton />} />
                <RevealGroup className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" stagger={0.12}>
                    {homes.map((p, i) => (
                        <RevealItem key={p.id}>
                            <TiltCard max={3}>
                                <PropertyCard property={p} priority={i === 0} />
                            </TiltCard>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </Section>
        );
    }

    return (
        <HorizontalScroller
            className="bg-ivory py-20 md:py-28 lg:pb-0 lg:pt-24"
            header={
                <Container className="mb-10 lg:mb-8">
                    <SectionHeading eyebrow="Featured homes" title={TITLE} lead={LEAD} actions={<AllHomesButton />} />
                </Container>
            }
        >
            {homes.map((p) => (
                <PropertyCard
                    key={p.id}
                    property={p}
                    className="w-[min(78vw,380px)] shrink-0 snap-start lg:w-[32vh] lg:min-w-[260px]"
                    imageClassName="lg:aspect-auto lg:h-[44vh]"
                    sizes="(min-width: 1024px) 24vw, 80vw"
                />
            ))}
        </HorizontalScroller>
    );
}
