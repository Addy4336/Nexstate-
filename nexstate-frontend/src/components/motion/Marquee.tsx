"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    /** Seconds per loop. Higher is slower. */
    duration?: number;
    reverse?: boolean;
    /** Speed the ticker up while the page is being scrolled (default on). */
    reactToScroll?: boolean;
}

/**
 * Endless horizontal ticker. Content is rendered twice and shifted by half, so the loop is seamless.
 * Pauses on hover; stays still for reduced-motion visitors. While the visitor scrolls, the ticker
 * speeds up in proportion to scroll velocity (via Lenis) and eases back, which makes the page feel
 * connected to the scroll without any extra layout work.
 */
export function Marquee({ children, className, duration = 40, reverse, reactToScroll = true }: MarqueeProps) {
    const track = useRef<HTMLDivElement>(null);
    const rate = useRef(1);
    const target = useRef(1);
    const raf = useRef(0);
    const reduce = useReducedMotion();

    // Ease the playback rate toward the target each frame; stops itself once settled, so it costs nothing at rest.
    const settle = useCallback(() => {
        const anim = track.current?.getAnimations()[0];
        if (!anim) return;
        rate.current += (target.current - rate.current) * 0.12;
        if (Math.abs(rate.current - target.current) < 0.02) rate.current = target.current;
        anim.updatePlaybackRate(rate.current);
        raf.current = rate.current === target.current ? 0 : requestAnimationFrame(settle);
    }, []);

    useLenis((lenis) => {
        if (!reactToScroll || reduce) return;
        // velocity is roughly px per frame; clamp so a hard flick never makes the text unreadable.
        target.current = 1 + Math.min(Math.abs(lenis.velocity) * 0.25, 3);
        if (!raf.current) raf.current = requestAnimationFrame(settle);
    });

    // Scrolling ends without a final event at zero velocity, so always relax back toward normal speed.
    useEffect(() => {
        if (!reactToScroll || reduce) return;
        const id = window.setInterval(() => {
            if (target.current !== 1) {
                target.current = 1 + (target.current - 1) * 0.8;
                if (target.current < 1.02) target.current = 1;
                if (!raf.current) raf.current = requestAnimationFrame(settle);
            }
        }, 100);
        return () => {
            window.clearInterval(id);
            cancelAnimationFrame(raf.current);
        };
    }, [reactToScroll, reduce, settle]);

    return (
        <div
            className={cn(
                "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
                className
            )}
        >
            <div
                ref={track}
                className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
                style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
            >
                <div className="flex shrink-0 items-center">{children}</div>
                <div className="flex shrink-0 items-center" aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
}
