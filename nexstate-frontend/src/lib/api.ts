/**
 * Base URL of the CMS API. Set NEXT_PUBLIC_API_URL to the deployed CMS origin in
 * production; the localhost fallback is for development only.
 */
export const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_CMS_API_URL ||
    "http://localhost:3001"
).replace(/\/$/, "");
