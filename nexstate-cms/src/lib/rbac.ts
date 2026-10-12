/**
 * Role-based Access Control (RBAC) Utilities
 * Provides type-safe role definitions and permission checks
 */

// Define available roles in the system
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Define permissions for each role
export const RolePermissions = {
  [UserRole.ADMIN]: [
    "properties:read",
    "properties:create",
    "properties:update",
    "properties:delete",
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "analytics:read",
    "settings:manage",
  ],
  [UserRole.USER]: [
    "properties:read", // Users can view properties
  ],
} as const;

/**
 * Type for all available permissions
 */
export type Permission = (typeof RolePermissions)[UserRole][number];

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const userRole = role as UserRole;
  if (!RolePermissions[userRole]) {
    return false;
  }
  return (RolePermissions[userRole] as readonly Permission[]).includes(
    permission
  );
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
  role: string,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
  role: string,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): readonly Permission[] {
  const userRole = role as UserRole;
  return RolePermissions[userRole] || [];
}

/**
 * Check if a user object has a specific permission
 */
export function userHasPermission(
  user: { role: string } | null,
  permission: Permission
): boolean {
  if (!user) return false;
  return hasPermission(user.role, permission);
}

/**
 * Higher-order function to protect actions based on permissions
 * Usage: const protectedAction = requirePermission(myAction, "properties:delete");
 */
export function requirePermission<T extends (...args: any[]) => any>(
  action: T,
  permission: Permission
): T {
  return (async (...args: Parameters<T>) => {
    // This would need session context in actual usage
    // For now, it's a structure for future enhancement
    return action(...args);
  }) as T;
}
