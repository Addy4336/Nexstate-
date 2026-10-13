import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Section";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { siteImages } from "@/lib/site-images";

export function FinalCta() {
    const img = siteImages.cityGoaSunset;
    return (
        <section className="relative isolate overflow-hidden bg-ink py-28 text-center text-ivory md:py-40">
            <ParallaxImage
                src={img.src}
                alt=""
                blurDataURL={img.blurDataURL}
                sizes="100vw"
                strength={12}
                className="absolute inset-0 -z-10"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/55" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-transparent to-ink/70" />
            <Container>
                <Reveal direction="fade">
                    <p className="eyebrow eyebrow-light justify-center">Ready when you are</p>
                </Reveal>
                <RevealText
                    text="Your next *home* is waiting"
                    className="text-display mx-auto mt-5 max-w-3xl text-ivory"
                    emphasisClassName="italic text-brass"
                />
                <Reveal delay={0.3}>
                    <p className="text-lead mx-auto mt-6 max-w-xl text-ivory/80">
                        Browse furnished homes with live availability, or talk to us about letting yours.
                    </p>
                    <div className="mt-9 flex flex-wrap justify-center gap-3">
                        <Button asChild size="xl" variant="brass">
                            <Link href="/properties">
                                Browse homes <ArrowRight />
                            </Link>
                        </Button>
                        <Button asChild size="xl" variant="outline-light">
                            <Link href="/owner">List your property</Link>
                        </Button>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}
