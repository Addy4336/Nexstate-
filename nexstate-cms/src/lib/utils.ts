import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";

/**
 * Get the Supabase project URL from environment
 */
function getSupabaseUrl(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

/**
 * Resolves an image reference to a displayable URL.
 * Accepts full URLs (Supabase Storage, Unsplash, ...) or a bucket-relative
 * path such as "property-images/images/foo/bar.jpg".
 */
export function getImageUrl(url: string | null | undefined): string {
    if (!url) return PLACEHOLDER_IMAGE;

    if (url.startsWith("property-images/")) {
        return `${getSupabaseUrl()}/storage/v1/object/public/${url}`;
    }

    return url;
}