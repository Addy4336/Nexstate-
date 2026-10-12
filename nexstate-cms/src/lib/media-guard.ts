const ALLOWED_MEDIA_TYPES = new Set([
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
    "video/mp4", "video/webm", "video/quicktime", "video/ogg",
]);

export function isAllowedMediaType(mime: string | null | undefined): mime is string {
    return !!mime && ALLOWED_MEDIA_TYPES.has(mime);
}

export const SAFE_FILE_ID = /^[A-Za-z0-9_-]{10,100}$/;
