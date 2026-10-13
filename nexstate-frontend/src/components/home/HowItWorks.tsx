"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EASE_OUT } from "@/components/motion/hooks";
import { howSteps } from "@/lib/demo-content";
import { fillProps } from "@/lib/site-images";
import { cn } from "@/lib/utils";

/**
 * Desktop: a photo stays pinned on the left and cross-fades as each step passes the middle of the screen.
 * Phones/tablets: each step carries its own photo inline (no sticky behaviour, no hidden content).
 */
export function HowItWorks() {
    const [active, setActive] = useState(0);
    const refs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
                }
            },
            // A thin band around the vertical centre decides which step is "current".
            { rootMargin: "-45% 0px -45% 0px" }
        );
        refs.current.forEach((el) => el && obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <Section tone="sand" id="how-it-works">
            <SectionHeading eyebrow="How it works" title="From search to *keys* in three steps" layout="stacked" />

            <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-20">
                {/* Pinned photo (desktop only) */}
                <div className="relative hidden lg:block">
                    <div className="sticky top-28 h-[min(70vh,640px)] overflow-hidden rounded-3xl bg-forest">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={active}
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 1.08 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.9, ease: EASE_OUT }}
                            >
                                <Image
                                    {...fillProps(howSteps[active].image)}
                                    fill
                                    sizes="45vw"
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                        <p className="absolute bottom-6 left-6 font-serif text-7xl leading-none text-ivory/90">
                            {String(active + 1).padStart(2, "0")}
                        </p>
                    </div>
                </div>

                <ol className="space-y-14 lg:space-y-0">
                    {howSteps.map((s, i) => (
                        <li
                            key={s.title}
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            data-index={i}
                            className="lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center"
                        >
                            <Reveal>
                                {/* Inline photo for smaller screens */}
                                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl lg:hidden">
                                    <Image {...fillProps(s.image)} alt={s.image.alt} fill sizes="90vw" className="object-cover" />
                                </div>
                                <p className="font-serif text-6xl leading-none text-brass-deep/40 lg:text-8xl">{String(i + 1).padStart(2, "0")}</p>
                                <h3
                                    className={cn(
                                        "text-title mt-4 transition-colors duration-500 md:text-3xl",
                                        i === active ? "lg:text-ink" : "lg:text-ink/45"
                                    )}
                                >
                                    {s.title}
                                </h3>
                                <p className="text-lead mt-4 max-w-md text-stone">{s.body}</p>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
