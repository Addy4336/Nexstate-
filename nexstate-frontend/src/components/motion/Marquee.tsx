import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    /** Seconds per loop. Higher is slower. */
    duration?: number;
    reverse?: boolean;
}

/**
 * Endless horizontal ticker (CSS only, no JS). Content is rendered twice and shifted by half,
 * so the loop is seamless. Pauses on hover; stops for reduced-motion visitors.
 */
export function Marquee({ children, className, duration = 40, reverse }: MarqueeProps) {
    return (
        <div
            className={cn(
                "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
                className
            )}
        >
            <div
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
