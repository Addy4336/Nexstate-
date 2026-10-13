"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFinePointer } from "./hooks";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Maximum tilt in degrees. Keep small (3-6) so it reads as tactile, not gimmicky. */
    max?: number;
}

/** Card that leans toward the cursor. Only on mouse/trackpad devices; a plain div elsewhere. */
export function TiltCard({ max = 4, className, children, ...rest }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const enabled = useFinePointer();
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const spring = { stiffness: 200, damping: 20, mass: 0.4 };
    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

    if (!enabled) {
        return (
            <div className={className} {...rest}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={cn("[transform-style:preserve-3d]", className)}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            onPointerMove={(e) => {
                const r = ref.current?.getBoundingClientRect();
                if (!r) return;
                px.set((e.clientX - r.left) / r.width);
                py.set((e.clientY - r.top) / r.height);
            }}
            onPointerLeave={() => {
                px.set(0.5);
                py.set(0.5);
            }}
            {...(rest as object)}
        >
            {children}
        </motion.div>
    );
}
