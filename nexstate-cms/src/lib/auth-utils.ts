import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Define valid staff roles that can access the admin dashboard
export const STAFF_ROLES = ["admin", "manager", "editor"] as const;
export type StaffRole = typeof STAFF_ROLES[number];

/**
 * Server-side utility to get the current session
 * Cached to avoid multiple calls within the same request
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

/**
 * Get the current user from session
 * Returns null if no session exists
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components that require any authenticated user
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return session;
}

/**
 * Require staff role - redirects if not a staff member (admin, manager, or editor)
 * Use this for pages that any staff member can access
 */
export async function requireStaff() {
  const session = await requireAuth();

  if (!STAFF_ROLES.includes(session.user.role as StaffRole)) {
    redirect("/");
  }

  return session;
}

/**
 * Require admin role - redirects if not admin
 * Use this in server components that require admin-only privileges (e.g., user management)
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    redirect("/admin/dashboard?error=unauthorized");
  }

  return session;
}

/**
 * Require manager or admin role
 * Use for pages that managers can access but editors cannot
 */
export async function requireManager() {
  const session = await requireAuth();

  if (session.user.role !== "admin" && session.user.role !== "manager") {
    redirect("/admin/dashboard?error=unauthorized");
  }

  return session;
}

/**
 * Check if current user has admin role
 * Returns boolean without redirecting
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if current user is a staff member
 * Returns boolean without redirecting
 */
export async function isStaff(): Promise<boolean> {
  const user = await getCurrentUser();
  return STAFF_ROLES.includes(user?.role as StaffRole);
}

/**
 * Check if user is authenticated
 * Returns boolean without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Type guard for user role
 */
export function hasRole(user: { role: string } | null, role: string): boolean {
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: { role: string } | null, roles: string[]): boolean {
  return user ? roles.includes(user.role) : false;
}

