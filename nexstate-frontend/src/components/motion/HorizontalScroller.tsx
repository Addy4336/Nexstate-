"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface HorizontalScrollerProps {
    /** Shown above the track and pinned together with it. */
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    trackClassName?: string;
}

/**
 * Desktop: the section pins to the viewport and vertical scrolling moves the row sideways.
 * Tablet/phone or reduced motion: an ordinary swipeable row with snap points.
 * Children should be fixed-width items (e.g. "w-[min(80vw,420px)] shrink-0 snap-start") whose
 * height fits the viewport on desktop (header + items must fit in one screen: size images with vh).
 */
export function HorizontalScroller({ header, children, className, trackClassName }: HorizontalScrollerProps) {
    const section = useRef<HTMLElement>(null);
    const track = useRef<HTMLDivElement>(null);

    // Keep ScrollTrigger in step with Lenis's smoothed position.
    useLenis(() => ScrollTrigger.update());

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
                const el = track.current;
                if (!el) return;
                const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
                gsap.set(el, { overflow: "visible" });
                gsap.to(el, {
                    x: () => -distance(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: section.current,
                        start: "top top",
                        end: () => `+=${distance()}`,
                        pin: true,
                        scrub: 0.8,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });
            });
            return () => mm.revert();
        },
        { scope: section }
    );

    return (
        <section ref={section} className={cn("relative overflow-hidden lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-20", className)}>
            {header}
            <div
                ref={track}
                className={cn(
                    "flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 pb-4 md:gap-6 md:px-6 md:scroll-px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    trackClassName
                )}
                data-lenis-prevent-horizontal
            >
                {children}
            </div>
        </section>
    );
}
