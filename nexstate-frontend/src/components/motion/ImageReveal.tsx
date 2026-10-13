"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EASE_OUT } from "./hooks";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
    src: string;
    alt: string;
    /** Sizing/aspect classes for the frame, e.g. "aspect-[4/5] rounded-2xl". */
    className?: string;
    imageClassName?: string;
    sizes?: string;
    priority?: boolean;
    delay?: number;
    /** Direction the image is uncovered from. */
    from?: "bottom" | "top" | "left" | "right";
}

const hidden = {
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
};

/** Photo uncovered by a moving mask while it settles from a slight zoom. Feels like a page being turned. */
export function ImageReveal({
    src,
    alt,
    className,
    imageClassName,
    sizes = "(min-width: 1024px) 50vw, 100vw",
    priority,
    delay = 0,
    from = "bottom",
}: ImageRevealProps) {
    // The frame (unclipped) is what we watch: a fully clipped element reports 0% visible,
    // so observing the masked layer itself would never fire.
    return (
        <motion.div
            className={cn("relative overflow-hidden", className)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <motion.div
                className="absolute inset-0 bg-sand"
                variants={{
                    hidden: { clipPath: hidden[from] },
                    show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, delay, ease: EASE_OUT } },
                }}
            >
                <motion.div
                    className="absolute inset-0"
                    variants={{
                        hidden: { scale: 1.18 },
                        show: { scale: 1, transition: { duration: 1.6, delay, ease: EASE_OUT } },
                    }}
                >
                    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imageClassName)} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
