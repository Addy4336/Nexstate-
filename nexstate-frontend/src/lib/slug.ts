/**
 * URL segment for a property location: the area before the first comma,
 * lower-cased and hyphenated ("Dubai Marina, Dubai" -> "dubai-marina").
 * The location pages turn hyphens back into spaces and search by that text.
 */
export function locationSlug(location: string | null | undefined): string {
    const area = (location || "").split(",")[0];
    return (
        area
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "properties"
    );
}