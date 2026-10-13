import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { cityImages, fillProps } from "@/lib/site-images";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

/** Grid placement for each city on desktop: a tall lead tile, then a mix of widths. */
const SPAN: Record<string, string> = {
    bengaluru: "lg:col-span-5 lg:row-span-2",
    mumbai: "lg:col-span-4",
    goa: "lg:col-span-3",
    "delhi-ncr": "lg:col-span-3",
    hyderabad: "lg:col-span-2",
    pune: "lg:col-span-2",
};

function countFor(name: string, properties: Property[]) {
    const needle = name === "Delhi NCR" ? "delhi" : name.toLowerCase();
    return properties.filter((p) => p.location.toLowerCase().includes(needle)).length;
}

export function CityGrid({ properties }: { properties: Property[] }) {
    return (
        <Section tone="sand" id="cities">
            <SectionHeading
                eyebrow="Explore by city"
                title="Find your *neighbourhood*"
                lead="Six cities, each with its own rhythm. Start with the one you are moving to."
            />
            <RevealGroup className="mt-12 grid auto-rows-[260px] grid-cols-2 gap-3 md:auto-rows-[300px] md:grid-cols-3 md:gap-4 lg:mt-16 lg:grid-cols-12 lg:auto-rows-[260px]" stagger={0.08}>
                {cityImages.map((c, i) => {
                    const n = countFor(c.name, properties);
                    const q = c.name === "Delhi NCR" ? "Delhi" : c.name;
                    return (
                        <RevealItem key={c.slug} className={cn(SPAN[c.slug], i === 0 && "col-span-2 row-span-2 md:col-span-3 md:row-span-1 lg:row-span-2")}>
                            <Link
                                href={`/properties?location=${encodeURIComponent(q)}`}
                                className="group relative block size-full overflow-hidden rounded-2xl bg-forest"
                            >
                                <Image
                                    {...fillProps(c.image)}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 40vw, 50vw"
                                    className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.07]"
                                />
                                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent transition-opacity duration-500 group-hover:from-ink/90" />
                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-ivory md:p-6">
                                    <div>
                                        <p className="font-serif text-2xl leading-none tracking-tight md:text-3xl">{c.name}</p>
                                        <p className="mt-2 text-sm text-ivory/75">{c.blurb}</p>
                                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-brass">
                                            {n > 0 ? `${n} ${n === 1 ? "home" : "homes"}` : "Coming soon"}
                                        </p>
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ivory/15 backdrop-blur transition-all duration-500 group-hover:bg-brass group-hover:text-ink md:size-12"
                                    >
                                        <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-12" />
                                    </span>
                                </div>
                                <span className="sr-only">Browse homes in {c.name}</span>
                            </Link>
                        </RevealItem>
                    );
                })}
            </RevealGroup>
        </Section>
    );
}
