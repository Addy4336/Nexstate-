import { API_BASE } from "./api";

/**
 * Server-side GET against the CMS API for pages that render at request/ISR time.
 * Never throws: if the API is down or returns an error the caller gets `fallback`,
 * so a page (or a production build) can't fail just because the CMS is unreachable.
 */
export async function apiGet<T>(path: string, fallback: T, revalidate = 60): Promise<T> {
    try {
        const res = await fetch(`${API_BASE}/api${path}`, {
            next: { revalidate },
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return fallback;
        const json = await res.json();
        return json?.success ? (json.data as T) : fallback;
    } catch {
        return fallback;
    }
}
