/**
 * Client-side authentication context and hooks
 * Provides React context for authentication state
 */

"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { UserRole, hasPermission, type Permission } from "./rbac";

interface AuthContextValue {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  isLoading: boolean;
  isAdmin: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provider component for authentication context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const value: AuthContextValue = {
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role || "user",
        }
      : null,
    isLoading: isPending,
    isAdmin: session?.user?.role === UserRole.ADMIN,
    hasPermission: (permission: Permission) =>
      session?.user?.role
        ? hasPermission(session.user.role, permission)
        : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const { isAdmin } = useAuth();
  return isAdmin;
}
