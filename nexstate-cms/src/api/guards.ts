import { auth } from "@/lib/auth";

const STAFF_ROLES = ["admin", "manager", "editor"];

type Ctx = { request: Request; set: { status?: number | string } };

export async function getApiSession(request: Request) {
    try {
        return await auth.api.getSession({ headers: request.headers });
    } catch {
        return null;
    }
}

/** beforeHandle guard: any signed-in user. Returns an error body to short-circuit. */
export async function requireSessionGuard({ request, set }: Ctx) {
    const session = await getApiSession(request);
    if (!session?.user) {
        set.status = 401;
        return { success: false, error: "Unauthorized" };
    }
}

/** beforeHandle guard: staff (admin, manager, editor). */
export async function requireStaffGuard({ request, set }: Ctx) {
    const session = await getApiSession(request);
    if (!session?.user) {
        set.status = 401;
        return { success: false, error: "Unauthorized" };
    }
    if (!STAFF_ROLES.includes(session.user.role as string)) {
        set.status = 403;
        return { success: false, error: "Forbidden" };
    }
}

/** Recursively drop keys that must never reach public clients. */
export function stripKeys<T>(value: T, keys: string[]): T {
    if (Array.isArray(value)) return value.map((v) => stripKeys(v, keys)) as unknown as T;
    if (value && typeof value === "object" && !(value instanceof Date)) {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (keys.includes(k)) continue;
            out[k] = stripKeys(v, keys);
        }
        return out as T;
    }
    return value;
}

/** Public view of a property payload: no booking history, tenant limited to the checkout date. */
export function redactTenantData<T>(value: T): T {
    if (Array.isArray(value)) return value.map(redactTenantData) as unknown as T;
    if (value && typeof value === "object" && !(value instanceof Date)) {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (k === "rental_periods") continue;
            if (k === "current_tenant") {
                const t = v as { check_out_date?: string } | null;
                out[k] = t ? { check_out_date: t.check_out_date } : null;
                continue;
            }
            out[k] = redactTenantData(v);
        }
        return out as T;
    }
    return value;
}

/** Simple in-memory per-IP rate limiter (per instance) for public, costly endpoints. */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(name: string, max: number, windowMs = 60_000) {
    return ({ request, set }: Ctx) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            || request.headers.get("x-real-ip")
            || "unknown";
        const key = name + ":" + ip;
        const now = Date.now();
        const entry = hits.get(key);
        if (!entry || entry.reset < now) {
            hits.set(key, { count: 1, reset: now + windowMs });
            if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
            return;
        }
        if (++entry.count > max) {
            set.status = 429;
            return { success: false, error: "Too many requests" };
        }
    };
}
