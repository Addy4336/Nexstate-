import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { requireStaff } from "@/lib/auth-utils";

/**
 * Admin Dashboard Layout
 * Requires authentication and staff role (admin, manager, or editor) to access
 */
export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Verify staff access - redirects if not authenticated or not a staff member
    await requireStaff();

    return <AdminDashboardShell>{children}</AdminDashboardShell>;
}

