import { requireStaff } from "@/lib/auth-utils";
import { getDashboardStats, getRecentProperties } from "@/lib/dashboard";
import { DashboardStatsDisplay } from "@/components/admin/DashboardStatsDisplay";
import { RecentPropertiesList } from "@/components/admin/RecentPropertiesList";
import { QuickActions } from "@/components/admin/QuickActions";

export default async function DashboardPage() {
    // 1. Verify access
    await requireStaff();

    // 2. Fetch Data (Parallel for performance)
    const [stats, recentProperties] = await Promise.all([
        getDashboardStats(),
        getRecentProperties(5)
    ]);

    return (
        <div className="space-y-6">
            {/* Top Section: Stats (2x2) and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Stats Grid (Takes 2 columns) */}
                <div className="lg:col-span-2">
                    <DashboardStatsDisplay stats={stats} />
                </div>

                {/* Quick Actions (Takes 1 column) */}
                <div>
                    <QuickActions />
                </div>
            </div>

            {/* Recent Properties (Full Width) */}
            <RecentPropertiesList properties={recentProperties} />
        </div>
    );
}
