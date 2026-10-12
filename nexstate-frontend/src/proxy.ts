import { brand } from "@nexstate/brand";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only run on API routes
    if (pathname.startsWith("/api")) {
        const origin = request.headers.get("origin") || "";

        // Allowed origins: the brand's public site plus deployment env vars.
        // Localhost origins are trusted in development only.
        const allowedOrigins = [
            brand.siteUrl,
            process.env.NEXT_PUBLIC_API_URL,
            process.env.NEXT_PUBLIC_CMS_URL,
            ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000", "http://localhost:3001"] : []),
        ].filter(Boolean).map(url => url?.toLowerCase().replace(/\/$/, ""));

        // Check if the origin is allowed (normalized)
        const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
        const isAllowed = allowedOrigins.includes(normalizedOrigin);

        // Handle Preflight OPTIONS request
        if (request.method === "OPTIONS") {
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

        // Handle standard requests
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

    // Default behavior
    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
