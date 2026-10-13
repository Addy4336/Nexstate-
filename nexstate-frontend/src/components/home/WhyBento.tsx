import Image from "next/image";
import { CalendarCheck, Receipt, Sofa, Timer, Wrench } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { fillProps, siteImages } from "@/lib/site-images";
import { whyTiles } from "@/lib/demo-content";
import { cn } from "@/lib/utils";

function Tile({
    icon: Icon,
    title,
    body,
    className,
    dark,
}: {
    icon: typeof Sofa;
    title: string;
    body: string;
    className?: string;
    dark?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex h-full flex-col justify-between rounded-2xl p-6 md:p-8",
                dark ? "bg-forest text-ivory" : "border border-line bg-white text-ink",
                className
            )}
        >
            <span
                className={cn(
                    "flex size-11 items-center justify-center rounded-full",
                    dark ? "bg-ivory/10 text-brass" : "bg-sand text-forest"
                )}
            >
                <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="mt-10">
                <h3 className="font-serif text-2xl leading-tight tracking-tight">{title}</h3>
                <p className={cn("mt-3 text-[15px] leading-relaxed", dark ? "text-ivory/75" : "text-stone")}>{body}</p>
            </div>
        </div>
    );
}

export function WhyBento() {
    const t = whyTiles;
    return (
        <Section tone="ivory">
            <SectionHeading
                eyebrow="Why NexState"
                title="A rental that *just works*"
                lead="We handle the parts of renting that usually go wrong, so living in the home is the easy part."
            />
            <RevealGroup className="mt-12 grid gap-4 md:grid-cols-6 lg:mt-16 lg:grid-cols-12" stagger={0.08}>
                {/* Large photo tile */}
                <RevealItem className="md:col-span-6 lg:col-span-7 lg:row-span-2">
                    <div className="relative h-[420px] overflow-hidden rounded-2xl lg:h-full lg:min-h-[560px]">
                        <ImageReveal
                            src={siteImages.livingGreen.src}
                            alt={siteImages.livingGreen.alt}
                            blurDataURL={siteImages.livingGreen.blurDataURL}
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            className="absolute inset-0"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-8">
                            <h3 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">{t.furnished.title}</h3>
                            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ivory/80">{t.furnished.body}</p>
                        </div>
                    </div>
                </RevealItem>

                <RevealItem className="md:col-span-3 lg:col-span-5">
                    <Tile icon={CalendarCheck} title={t.flexible.title} body={t.flexible.body} dark />
                </RevealItem>
                <RevealItem className="md:col-span-3 lg:col-span-5">
                    <Tile icon={Receipt} title={t.pricing.title} body={t.pricing.body} />
                </RevealItem>

                <RevealItem className="md:col-span-3 lg:col-span-4">
                    <Tile icon={Wrench} title={t.managed.title} body={t.managed.body} />
                </RevealItem>
                <RevealItem className="md:col-span-3 lg:col-span-4">
                    <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl">
                        <Image
                            {...fillProps(siteImages.bedroomTufted)}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 33vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </RevealItem>
                <RevealItem className="md:col-span-6 lg:col-span-4">
                    <Tile icon={Timer} title={t.booking.title} body={t.booking.body} className="border-transparent bg-sand" />
                </RevealItem>
            </RevealGroup>
        </Section>
    );
}
