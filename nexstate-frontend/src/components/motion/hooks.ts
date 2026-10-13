"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Shared easing for every reveal on the site: fast start, long soft landing. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function useMediaQuery(query: string, initial = false): boolean {
    const [matches, setMatches] = useState(initial);
    useEffect(() => {
        const mql = window.matchMedia(query);
        const update = () => setMatches(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, [query]);
    return matches;
}

/**
 * True when scroll-linked effects (parallax, pinning) should run:
 * tablet width and up, and the visitor hasn't asked for reduced motion.
 * Phones get static layouts, which are faster and easier to read.
 */
export function useRichMotion(): boolean {
    const reduce = useReducedMotion();
    const wide = useMediaQuery("(min-width: 768px)");
    return wide && !reduce;
}

/** True on devices with a precise hovering pointer (mouse, trackpad). Used for tilt/magnetic effects. */
export function useFinePointer(): boolean {
    const reduce = useReducedMotion();
    const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
    return fine && !reduce;
}
