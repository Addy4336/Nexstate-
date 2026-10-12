
import { supabaseAdmin } from "@/lib/db";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-constants";

export interface Enquiry {
    id: string;
    type: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    property_id?: string;
    property_title?: string;
    status: string;
    assigned_to?: string;
    assigned_user_name?: string;
    created_at: string;
    updated_at: string;
}

export interface StaffUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Re-export for backward compatibility
export { ENQUIRY_STATUSES };

export async function getEnquiries() {
    const { data, error } = await supabaseAdmin
        .from("enquiry")
        .select(`
            *,
            user:assigned_to (
                name
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching enquiries:", error);
        return [];
    }

    // Transform the data to match expected format
    return (data || []).map((enquiry: any) => ({
        ...enquiry,
        assigned_user_name: enquiry.user?.name || null,
    })) as Enquiry[];
}

export async function getEnquiryById(id: string) {
    const { data, error } = await supabaseAdmin
        .from("enquiry")
        .select(`
            *,
            user:assigned_to (
                name
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching enquiry:", error);
        return null;
    }

    return {
        ...data,
        assigned_user_name: data.user?.name || null,
    } as Enquiry;
}

export async function getStaffUsers(): Promise<StaffUser[]> {
    const { data, error } = await supabaseAdmin
        .from("user")
        .select("id, name, email, role")
        .in("role", ["admin", "manager", "editor"])
        .or("banned.is.null,banned.eq.false")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching staff users:", error);
        return [];
    }

    return (data as StaffUser[]) || [];
}

export async function getEnquiryStats() {
    const { data, error } = await supabaseAdmin
        .from("enquiry")
        .select("status");

    if (error) {
        console.error("Error fetching enquiry stats:", error);
        return {
            new_count: 0,
            contacted_count: 0,
            in_progress_count: 0,
            converted_count: 0,
            closed_count: 0,
            total_count: 0,
        };
    }

    const stats = {
        new_count: data.filter(e => e.status === 'new').length,
        contacted_count: data.filter(e => e.status === 'contacted').length,
        in_progress_count: data.filter(e => e.status === 'in_progress').length,
        converted_count: data.filter(e => e.status === 'converted').length,
        closed_count: data.filter(e => e.status === 'closed').length,
        total_count: data.length,
    };

    return stats;
}
