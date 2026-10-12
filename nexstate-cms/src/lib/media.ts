/**
 * Shared media-upload rules (imported by both the server action and the browser uploader).
 * Files go straight from the browser to Supabase Storage via a one-time signed URL,
 * so they never pass through a serverless function body (Vercel caps those at ~4.5 MB).
 */

export const MEDIA_BUCKET = "property-images";

export type MediaKind = "image" | "video";

export const MEDIA_RULES: Record<MediaKind, { mimeTypes: Record<string, string>; maxBytes: number }> = {
    image: {
        mimeTypes: {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
            "image/avif": "avif",
        },
        maxBytes: 10 * 1024 * 1024,
    },
    video: {
        mimeTypes: {
            "video/mp4": "mp4",
            "video/webm": "webm",
            "video/quicktime": "mov",
        },
        // Supabase free plan caps any single object at 50 MB
        maxBytes: 50 * 1024 * 1024,
    },
};

/** Returns an error message, or null when the file is acceptable. */
export function validateMedia(kind: MediaKind, contentType: string, size: number): string | null {
    const rules = MEDIA_RULES[kind];
    if (!rules.mimeTypes[contentType]) {
        return `Unsupported ${kind} type. Allowed: ${Object.keys(rules.mimeTypes).join(", ")}`;
    }
    if (!Number.isFinite(size) || size <= 0) return "Empty file";
    if (size > rules.maxBytes) {
        return `${kind === "image" ? "Image" : "Video"} must be under ${Math.round(rules.maxBytes / 1024 / 1024)}MB`;
    }
    return null;
}

/** URL-safe folder segment derived from a title; never trusts raw input as a path. */
export function safeFolder(name: string | undefined, fallback = "misc"): string {
    const cleaned = (name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
    return cleaned || fallback;
}
