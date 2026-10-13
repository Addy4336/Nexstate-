import { brand } from "@nexstate/brand";
import { cn } from "@/lib/utils";

/**
 * Text logo generated from the brand config (monogram + two-tone wordmark),
 * so white-labelling never requires swapping image files.
 * `compact` renders the monogram only; `tone="light"` is for dark or photo backgrounds.
 */
export default function BrandLogo({
    compact = false,
    tone = "dark",
    className = "",
}: {
    compact?: boolean;
    tone?: "dark" | "light";
    className?: string;
}) {
    const light = tone === "light";
    return (
        <span className={cn("inline-flex items-center gap-2.5", className)}>
            <span
                aria-hidden="true"
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-serif text-lg font-semibold transition-colors duration-300",
                    light ? "bg-ivory text-forest" : "bg-forest text-ivory"
                )}
            >
                {brand.name.charAt(0)}
            </span>
            {!compact && (
                <span
                    className={cn(
                        "font-serif text-[1.35rem] tracking-tight transition-colors duration-300",
                        light ? "text-ivory" : "text-ink"
                    )}
                >
                    {brand.wordmark.primary}
                    <span className={cn("italic", light ? "text-brass" : "text-brass-deep")}>{brand.wordmark.accent}</span>
                </span>
            )}
            <span className="sr-only">{brand.name}</span>
        </span>
    );
}
