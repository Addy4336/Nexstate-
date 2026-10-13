"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { brand } from "@nexstate/brand";
import { EASE_OUT } from "./hooks";

interface CountUpProps {
    value: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}

/**
 * Number that counts up once when it scrolls into view.
 * The server renders the final value, so the figure is correct without JavaScript
 * and for reduced-motion visitors; it never gets stuck mid-count.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.8, className }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
    const reduce = useReducedMotion();
    const fmt = (n: number) =>
        prefix +
        n.toLocaleString(brand.market.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
        suffix;

    // Before it is seen, park the number at zero (only if it starts off-screen, to avoid a visible jump).
    useEffect(() => {
        const el = ref.current;
        if (!el || reduce) return;
        if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = fmt(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el || !inView || reduce) return;
        const controls = animate(0, value, {
            duration,
            ease: EASE_OUT,
            onUpdate: (v) => (el.textContent = fmt(v)),
            onComplete: () => (el.textContent = fmt(value)),
        });
        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, reduce, value]);

    return (
        <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
            {fmt(value)}
        </span>
    );
}
