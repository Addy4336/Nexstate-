import { supabaseAdmin } from "@/lib/db";

export interface DashboardStats {
    totalProperties: number;
    activeTenants: number;
    monthlyRevenue: number;
    occupancyRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    // Run queries in parallel for performance
    const [totalPropsRes, rentedPropsRes, revenueRes] = await Promise.all([
        supabaseAdmin.from("property").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("property").select("*", { count: "exact", head: true }).eq("status", "rented"),
        supabaseAdmin.from("property").select("price").eq("status", "rented"),
    ]);

    const totalProperties = totalPropsRes.count || 0;
    const activeTenants = rentedPropsRes.count || 0;
    
    // Calculate monthly revenue from rented properties
    const monthlyRevenue = revenueRes.data?.reduce((sum, prop) => sum + (prop.price || 0), 0) || 0;
    const occupancyRate = totalProperties > 0 ? (activeTenants / totalProperties) * 100 : 0;

    return {
        totalProperties,
        activeTenants,
        monthlyRevenue,
        occupancyRate: Math.round(occupancyRate),
    };
}

import { Property } from "@/types/property";

// ... (previous imports and interfaces)

export async function getRecentProperties(limit: number = 5): Promise<Property[]> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching recent properties:", error);
        return [];
    }

    return (data as Property[]) || [];
}
