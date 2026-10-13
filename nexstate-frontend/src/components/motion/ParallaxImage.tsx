"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRichMotion } from "./hooks";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
    src: string;
    alt: string;
    /** Frame classes (size, aspect, radius). The frame clips the moving image. */
    className?: string;
    imageClassName?: string;
    sizes?: string;
    priority?: boolean;
    /** How far the image drifts, as % of the frame height. 8-15 reads as depth without feeling floaty. */
    strength?: number;
    children?: React.ReactNode;
}

/**
 * Image that drifts slower than the page while its frame scrolls past, giving depth.
 * Static on phones and for reduced-motion visitors.
 */
export function ParallaxImage({
    src,
    alt,
    className,
    imageClassName,
    sizes = "100vw",
    priority,
    strength = 12,
    children,
}: ParallaxImageProps) {
    const ref = useRef<HTMLDivElement>(null);
    const enabled = useRichMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

    return (
        <div ref={ref} className={cn("relative overflow-hidden", className)}>
            <motion.div
                className="absolute inset-x-0 will-change-transform"
                style={enabled ? { y, top: `-${strength}%`, bottom: `-${strength}%` } : { top: 0, bottom: 0 }}
            >
                <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imageClassName)} />
            </motion.div>
            {children}
        </div>
    );
}
