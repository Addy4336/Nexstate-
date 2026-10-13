import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/layout/Section";
import { siteImages } from "@/lib/site-images";
import { HeroSearch } from "./HeroSearch";

/** Full-viewport opening: the photo does the talking, the headline is short, and search is one tap away. */
export function HomeHero() {
    const img = siteImages.heroVilla;
    return (
        <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-ivory">
            <ParallaxImage
                src={img.src}
                alt={img.alt}
                blurDataURL={img.blurDataURL}
                priority
                sizes="100vw"
                strength={10}
                className="absolute inset-0 -z-10"
            />
            {/* Legibility: dark at the top (nav) and bottom (copy + search), clear in the middle so the villa shows. */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/20 to-ink/88" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/65 via-ink/10 to-transparent" />

            <Container className="pb-10 pt-36 md:pb-14 lg:pb-16">
                <Reveal direction="fade" delay={0.2}>
                    <p className="eyebrow eyebrow-ivory">Furnished homes across India</p>
                </Reveal>
                <RevealText
                    as="h1"
                    immediate
                    delay={0.3}
                    text="Homes that feel *yours*"
                    className="text-display mt-5 max-w-3xl text-ivory"
                    emphasisClassName="italic text-brass"
                />
                <Reveal delay={0.7} className="mt-6 max-w-xl">
                    <p className="text-lead text-ivory/80">
                        Move-in-ready rentals, flexible stays and hands-off management in Bengaluru, Mumbai, Goa and beyond. One honest
                        price, no surprises.
                    </p>
                </Reveal>
                <Reveal delay={0.9} className="mt-9 md:mt-12">
                    <HeroSearch />
                </Reveal>
            </Container>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 right-8 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/60 lg:flex"
            >
                <span className="[writing-mode:vertical-rl]">Scroll</span>
                <span className="relative h-14 w-px overflow-hidden bg-ivory/25">
                    <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-brass" />
                </span>
            </div>
        </section>
    );
}
