"use client";

import { MotionConfig } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide motion setup:
 * - MotionConfig reducedMotion="user": motion skips transform animations for visitors who ask for reduced motion.
 * - Lenis smooth scrolling on the real window (so native features, sticky and ScrollTrigger keep working).
 *   Touch devices keep native scrolling (syncTouch off); Lenis disables itself under reduced motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
    return (
        <MotionConfig reducedMotion="user">
            <ReactLenis
                root
                options={{
                    autoRaf: true,
                    lerp: 0.1,
                    smoothWheel: true,
                    // Clicking an internal link should stop any scroll drift instead of carrying it onto the next page.
                    stopInertiaOnNavigate: true,
                    anchors: { offset: -96 },
                    // Let dialogs, sheets, dropdowns and inner scroll areas scroll natively.
                    prevent: (node: HTMLElement) =>
                        !!node.closest?.('[data-lenis-prevent],[role="dialog"],[role="listbox"],[data-radix-scroll-area-viewport]'),
                }}
            >
                <LenisBridge />
                {children}
            </ReactLenis>
        </MotionConfig>
    );
}

function LenisBridge() {
    const lenis = useLenis();
    const pathname = usePathname();

    // Pause smoothing while a Radix dialog/sheet locks page scroll.
    useEffect(() => {
        if (!lenis) return;
        const body = document.body;
        const sync = () => (body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start());
        const observer = new MutationObserver(sync);
        observer.observe(body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
        sync();
        return () => observer.disconnect();
    }, [lenis]);

    // Page height changes on client navigation; let Lenis re-measure.
    useEffect(() => {
        lenis?.resize();
    }, [pathname, lenis]);

    return null;
}
