"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface HorizontalScrollerProps {
    /** Shown above the track and pinned together with it. */
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    trackClassName?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * A row of fixed-width items that can be moved four ways.
 *
 * Desktop (lg and up, motion allowed): the section pins to the screen and scrolling down slides the
 * row sideways. On top of that the visitor can take control: drag with the mouse, use a trackpad's
 * sideways swipe or shift+wheel, or press the arrow buttons. All of these move the page's own scroll
 * position, so there is a single source of truth and the row stays in step with the page.
 *
 * Tablet, phone and reduced motion: an ordinary swipeable row with snap points (arrow buttons on tablet).
 *
 * Children should be fixed-width items (e.g. "w-[min(78vw,380px)] shrink-0 snap-start") and, on desktop,
 * short enough that header + items + controls fit in one screen (size photos with vh).
 */
export function HorizontalScroller({ header, children, className, trackClassName }: HorizontalScrollerProps) {
    const section = useRef<HTMLElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLSpanElement>(null);
    const trigger = useRef<ScrollTrigger | null>(null);
    const progress = useRef(0);
    const drag = useRef({ active: false, moved: false, startX: 0, startY: 0 });
    const [edge, setEdge] = useState({ start: true, end: false });
    const lenis = useLenis(() => ScrollTrigger.update());

    const paint = useCallback((p: number) => {
        progress.current = p;
        if (bar.current) bar.current.style.transform = `scaleX(${clamp(p, 0.02, 1)})`;
        const next = { start: p <= 0.01, end: p >= 0.99 };
        setEdge((e) => (e.start === next.start && e.end === next.end ? e : next));
    }, []);

    /** Scroll the page so the row sits at progress p (0..1). Only meaningful while pinned. */
    const toProgress = useCallback(
        (p: number, immediate = false) => {
            const st = trigger.current;
            if (!st) return;
            const y = st.start + clamp(p, 0, 1) * (st.end - st.start);
            if (lenis) lenis.scrollTo(y, immediate ? { immediate: true } : { duration: 0.9 });
            else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
        },
        [lenis]
    );

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
                const el = track.current;
                if (!el) return;
                const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
                gsap.set(el, { overflow: "visible" });
                const tween = gsap.to(el, {
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
                        onUpdate: (self) => paint(self.progress),
                    },
                });
                trigger.current = tween.scrollTrigger ?? null;
                return () => {
                    trigger.current = null;
                };
            });
            return () => mm.revert();
        },
        { scope: section }
    );

    // Non-pinned layouts: the track scrolls natively, so mirror its position in the progress bar.
    useEffect(() => {
        const el = track.current;
        if (!el) return;
        const onScroll = () => {
            if (trigger.current) return;
            const max = el.scrollWidth - el.clientWidth;
            paint(max > 0 ? el.scrollLeft / max : 0);
        };
        onScroll();
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [paint]);

    // Trackpad sideways swipe / shift+wheel while the row is pinned.
    useEffect(() => {
        const el = section.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            const st = trigger.current;
            if (!st || !st.isActive) return;
            const dx = e.shiftKey ? e.deltaY : e.deltaX;
            if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY) * 1.2 || dx === 0) return;
            e.preventDefault();
            const y = clamp(window.scrollY + dx, st.start, st.end);
            if (lenis) lenis.scrollTo(y, { immediate: true });
            else window.scrollTo(0, y);
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [lenis]);

    const step = () => {
        const el = track.current;
        const first = el?.firstElementChild as HTMLElement | null;
        if (!el || !first) return 320;
        const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
        return first.getBoundingClientRect().width + gap;
    };

    const go = (dir: 1 | -1) => {
        const el = track.current;
        if (!el) return;
        if (trigger.current) {
            const distance = Math.max(1, el.scrollWidth - el.clientWidth);
            // The tween's x is the true position; progress * distance is where the row is now.
            toProgress((progress.current * distance + dir * step()) / distance);
        } else {
            el.scrollBy({ left: dir * step(), behavior: "smooth" });
        }
    };

    // Mouse drag (touch already has native swipe).
    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        drag.current = { active: true, moved: false, startX: e.clientX, startY: window.scrollY };
        if (!trigger.current) drag.current.startY = track.current?.scrollLeft ?? 0;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d.active) return;
        const dx = e.clientX - d.startX;
        if (Math.abs(dx) > 5) d.moved = true;
        if (!d.moved) return;
        const st = trigger.current;
        if (st) {
            const y = clamp(d.startY - dx, st.start, st.end);
            if (lenis) lenis.scrollTo(y, { immediate: true });
            else window.scrollTo(0, y);
        } else if (track.current) {
            track.current.style.scrollSnapType = "none"; // snapping fights a 1:1 drag
            track.current.scrollLeft = d.startY - dx;
        }
    };
    const endDrag = (e: React.PointerEvent) => {
        if (!drag.current.active) return;
        drag.current.active = false;
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        if (track.current) track.current.style.scrollSnapType = "";
    };

    return (
        <section
            ref={section}
            className={cn("relative overflow-hidden lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-24", className)}
            aria-roledescription="carousel"
        >
            {header}
            <div
                ref={track}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                // A drag must not also count as a click on the card underneath.
                onClickCapture={(e) => {
                    if (drag.current.moved) {
                        e.preventDefault();
                        e.stopPropagation();
                        drag.current.moved = false;
                    }
                }}
                onDragStart={(e) => e.preventDefault()}
                className={cn(
                    "flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 pb-4 md:gap-6 md:px-6 md:scroll-px-6 lg:cursor-grab lg:px-8 lg:active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    trackClassName
                )}
                data-lenis-prevent-horizontal
            >
                {children}
            </div>

            {/* Progress + arrows (tablet and up; phones just swipe) */}
            <div className="container-site mt-4 hidden items-center gap-6 md:flex lg:mt-5">
                <span aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-line">
                    <span ref={bar} className="absolute inset-0 origin-left bg-brass transition-transform duration-300 ease-out" style={{ transform: "scaleX(0.02)" }} />
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        disabled={edge.start}
                        aria-label="Previous homes"
                        className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink/40 disabled:opacity-35 disabled:hover:border-line"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        disabled={edge.end}
                        aria-label="Next homes"
                        className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink/40 disabled:opacity-35 disabled:hover:border-line"
                    >
                        <ArrowRight className="size-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
