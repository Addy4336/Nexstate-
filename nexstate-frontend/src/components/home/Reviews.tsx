import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { demoReviews } from "@/lib/demo-content";

function initials(name: string) {
    return name
        .split(/[\s&]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

/** Sample testimonials from lib/demo-content, labelled as such. Initials instead of stock faces. */
export function Reviews() {
    return (
        <Section tone="ivory">
            <SectionHeading
                eyebrow="In their words"
                title="Residents and owners, *happily* settled"
                lead="A few of the stories we hear most: quick move-ins, honest pricing, and homes that are looked after."
            />
            <RevealGroup className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3" stagger={0.12}>
                {demoReviews.map((r, i) => (
                    <RevealItem key={r.name}>
                        <figure className={`flex h-full flex-col justify-between rounded-3xl p-7 md:p-9 ${i === 1 ? "bg-forest text-ivory" : "border border-line bg-white text-ink"}`}>
                            <div>
                                <Quote className={`size-8 ${i === 1 ? "text-brass" : "text-brass-deep"}`} aria-hidden="true" />
                                <blockquote className="mt-5 font-serif text-xl leading-snug md:text-2xl">{r.quote}</blockquote>
                            </div>
                            <figcaption className="mt-8 flex items-center gap-4">
                                <span
                                    aria-hidden="true"
                                    className={`flex size-12 shrink-0 items-center justify-center rounded-full font-serif text-lg ${i === 1 ? "bg-ivory/10 text-brass" : "bg-sand text-forest"}`}
                                >
                                    {initials(r.name)}
                                </span>
                                <span>
                                    <span className="block font-medium">{r.name}</span>
                                    <span className={`block text-sm ${i === 1 ? "text-ivory/65" : "text-stone"}`}>
                                        {r.role}, {r.city}
                                    </span>
                                </span>
                            </figcaption>
                        </figure>
                    </RevealItem>
                ))}
            </RevealGroup>
            <p className="mt-6 text-xs text-stone">Sample testimonials for demonstration purposes.</p>
        </Section>
    );
}
