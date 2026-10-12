import { brand } from "@nexstate/brand";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

// Staff roles that can access the admin dashboard
const STAFF_ROLES = ["admin", "manager", "editor"];

/**
 * Next.js 16 Proxy Function (replaces middleware.ts)
 * Protects admin routes and handles authentication
 * Runs on every request to /admin/* except login and setup pages
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes specifically for CORS
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") || "";

    // Allowed origins: the brand's public site plus deployment env vars.
    // Localhost origins are trusted in development only.
    const allowedOrigins = [
      brand.siteUrl,
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000", "http://localhost:3001"] : []),
    ].filter(Boolean).map(url => url?.toLowerCase().replace(/\/$/, ""));

    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
    const isAllowed = allowedOrigins.includes(normalizedOrigin);

    // Handle Preflight OPTIONS request
    if (request.method === "OPTIONS") {
      // For OPTIONS, if allowed return headers, otherwise just return valid OPTIONS response (some browsers expect 200/204 always)
      const response = new NextResponse(null, { status: 204 });

      if (isAllowed) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Max-Age", "86400");
        response.headers.set("Vary", "Origin");
      }
      return response;
    }

    // Handle standard API requests
    const response = NextResponse.next();

    if (isAllowed && origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Vary", "Origin");
    }

    return response;
  }

  // Allow access to login, setup pages, and API routes without authentication/redirection
  // (API routes already handled above, but double check doesn't hurt)
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/setup" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Redirect root and non-admin paths (or exactly /admin) to /admin/dashboard
  if (!pathname.startsWith("/admin") || pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Check if user has a valid session
  const { data: session, error } = await betterFetch<{
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;  // Updated to match what might be coming from auth
    } | null;
  }>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  }).catch(() => ({ data: null, error: true }));

  // If no session, redirect to login
  if (!session?.user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has a staff role (admin, manager, or editor)
  if (!STAFF_ROLES.includes(session.user.role)) {
    // Non-staff users trying to access admin area
    const unauthorizedUrl = new URL("/admin/login", request.url); // Redirect to login instead of root
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Additional check: Users page should be admin-only
  if (pathname.startsWith("/admin/users") && session.user.role !== "admin") {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(dashboardUrl);
  }

  // User is authenticated and has staff role
  return NextResponse.next();
}

/**
 * Configure which routes this proxy should run on
 * Next.js 16 uses the same matcher config as middleware
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};
