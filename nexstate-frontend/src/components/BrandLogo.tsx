import { brand } from "@nexstate/brand";

/**
 * Text logo generated from the brand config (monogram + two-tone wordmark),
 * so white-labelling never requires swapping image files.
 * `compact` renders the monogram only.
 */
export default function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground"
            >
                {brand.name.charAt(0)}
            </span>
            {!compact && (
                <span className="text-xl font-bold tracking-tight text-foreground">
                    {brand.wordmark.primary}
                    <span className="text-primary">{brand.wordmark.accent}</span>
                </span>
            )}
            <span className="sr-only">{brand.name}</span>
        </span>
    );
}
