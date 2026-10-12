import { api } from "@/api";

// Handle all HTTP methods for Elysia
const handler = api.handle;

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
