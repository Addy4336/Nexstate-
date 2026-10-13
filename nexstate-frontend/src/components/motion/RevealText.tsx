"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "./hooks";
import { cn } from "@/lib/utils";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span } as const;

interface RevealTextProps {
    /** The text. Wrap words in *asterisks* to set them in italic accent, e.g. "Homes that feel *yours*". */
    text: string;
    as?: keyof typeof tags;
    className?: string;
    /** Class for *emphasised* words. */
    emphasisClassName?: string;
    delay?: number;
    stagger?: number;
    /** Animate on mount instead of on scroll (for above-the-fold heroes). */
    immediate?: boolean;
}

/**
 * Editorial headline reveal: each word rises out of its own clipping mask.
 * Screen readers get the plain sentence once; the animated words are hidden from them.
 */
export function RevealText({
    text,
    as = "h2",
    className,
    emphasisClassName = "italic text-brass-deep",
    delay = 0,
    stagger = 0.06,
    immediate = false,
}: RevealTextProps) {
    const Tag = tags[as];
    const words = text.split(/\s+/).filter(Boolean);
    const plain = text.replace(/\*/g, "");

    const trigger = immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, amount: 0.6, margin: "0px 0px -6% 0px" } };

    return (
        <Tag
            className={className}
            initial="hidden"
            {...trigger}
            variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        >
            <span className="sr-only">{plain}</span>
            <span aria-hidden="true">
                {words.map((raw, i) => {
                    const emphasised = raw.startsWith("*") || raw.endsWith("*") || raw.includes("*");
                    const word = raw.replace(/\*/g, "");
                    return (
                        <span
                            key={i}
                            // Padding/negative margin keeps descenders (g, y, p) from being clipped.
                            className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
                        >
                            <motion.span
                                className={cn("inline-block will-change-transform", emphasised && emphasisClassName)}
                                variants={{
                                    hidden: { y: "110%" },
                                    show: { y: "0%", transition: { duration: 1, ease: EASE_OUT } },
                                }}
                            >
                                {word}
                            </motion.span>
                            {i < words.length - 1 && " "}
                        </span>
                    );
                })}
            </span>
        </Tag>
    );
}
