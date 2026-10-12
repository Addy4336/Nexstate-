import { randomBytes, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const COOKIE_PREFIX = "oauth_state_";

/** Returns the admin session, or null if the request is not from a signed-in admin. */
export async function getAdminSession(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });
    return session?.user?.role === "admin" ? session : null;
}

export function newOAuthState(): string {
    return randomBytes(24).toString("hex");
}

/** Bind the state to the browser via a short-lived httpOnly cookie on the redirect response. */
export function setOAuthStateCookie(provider: string, state: string, response: NextResponse) {
    response.cookies.set(COOKIE_PREFIX + provider, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
        maxAge: 600,
    });
}

/** Verify the state returned by the provider against the cookie, then clear the cookie. */
export function verifyOAuthState(provider: string, request: NextRequest, response?: NextResponse): boolean {
    const expected = request.cookies.get(COOKIE_PREFIX + provider)?.value;
    const received = request.nextUrl.searchParams.get("state");
    response?.cookies.delete(COOKIE_PREFIX + provider);
    if (!expected || !received) return false;
    const a = Buffer.from(expected);
    const b = Buffer.from(received);
    return a.length === b.length && timingSafeEqual(a, b);
}
