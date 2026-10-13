"use client";

import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "./hooks";
import { cn } from "@/lib/utils";

type Direction = "up" | "fade" | "left" | "right" | "scale";

const from: Record<Direction, Record<string, number>> = {
    up: { opacity: 0, y: 32 },
    fade: { opacity: 0 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
    scale: { opacity: 0, scale: 0.96 },
};

/** Trigger slightly before the element is fully on screen, and only once. */
const VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: Direction;
    delay?: number;
    duration?: number;
}

/** Fades/slides a block in the first time it scrolls into view. */
export function Reveal({ direction = "up", delay = 0, duration = 0.9, className, children, ...rest }: RevealProps) {
    return (
        <motion.div
            className={className}
            initial={from[direction]}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration, delay, ease: EASE_OUT }}
            {...(rest as object)}
        >
            {children}
        </motion.div>
    );
}

const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

interface RevealGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    stagger?: number;
    delay?: number;
}

/** Container whose <RevealItem> children appear one after another. */
export function RevealGroup({ stagger = 0.08, delay = 0, className, children, ...rest }: RevealGroupProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
            {...(rest as object)}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <motion.div className={cn(className)} variants={item} {...(rest as object)}>
            {children}
        </motion.div>
    );
}
