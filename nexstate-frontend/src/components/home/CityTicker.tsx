import { Marquee } from "@/components/motion/Marquee";
import { cityImages } from "@/lib/site-images";

/** Slow ticker of the cities served; speeds up while the visitor scrolls. */
export function CityTicker() {
    return (
        <section aria-label="Cities we serve" className="border-y border-line bg-ivory py-5 md:py-7">
            <Marquee duration={45}>
                {cityImages.map((c) => (
                    <span key={c.slug} className="mx-6 flex items-center gap-6 font-serif text-3xl tracking-tight text-ink md:mx-8 md:gap-8 md:text-5xl">
                        {c.name}
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-brass md:size-2" />
                    </span>
                ))}
            </Marquee>
        </section>
    );
}
