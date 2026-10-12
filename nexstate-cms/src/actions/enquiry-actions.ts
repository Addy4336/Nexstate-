"use server";

import { requireStaff, requireManager } from "@/lib/auth-utils";

import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(formData: FormData) {
    const type = formData.get("type") as string || "general_contact";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const propertyId = formData.get("propertyId") as string;
    const propertyTitle = formData.get("propertyTitle") as string;

    // Basic validation
    if (!name || !email || !message) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const { error } = await supabaseAdmin
            .from("enquiry")
            .insert({
                type,
                name,
                email,
                phone,
                message,
                property_id: propertyId || null,
                property_title: propertyTitle || null,
                status: "new",
            });

        if (error) {
            console.error("Error submitting enquiry:", error);
            return { success: false, error: "Failed to submit enquiry. Please try again." };
        }

        // In a real app, we would send an email notification here
        revalidatePath("/admin/leads");

        return { success: true };
    } catch (error: any) {
        console.error("Error submitting enquiry:", error);
        return { success: false, error: "Failed to submit enquiry. Please try again." };
    }
}

export async function updateEnquiryStatus(id: string, status: string) {
    await requireStaff();
    const validStatuses = ['new', 'contacted', 'in_progress', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
        return { success: false, error: "Invalid status" };
    }

    try {
        const { error } = await supabaseAdmin
            .from("enquiry")
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);
        
        if (error) {
            console.error("Error updating enquiry status:", error);
            return { success: false, error: "Failed to update status" };
        }
        
        revalidatePath("/admin/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating enquiry status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function assignEnquiry(id: string, userId: string | null) {
    await requireStaff();
    try {
        const { error } = await supabaseAdmin
            .from("enquiry")
            .update({
                assigned_to: userId || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);
        
        if (error) {
            console.error("Error assigning enquiry:", error);
            return { success: false, error: "Failed to assign enquiry" };
        }
        
        revalidatePath("/admin/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error assigning enquiry:", error);
        return { success: false, error: "Failed to assign enquiry" };
    }
}

export async function deleteEnquiry(id: string) {
    await requireManager();
    try {
        const { error } = await supabaseAdmin
            .from("enquiry")
            .delete()
            .eq("id", id);
        
        if (error) {
            console.error("Error deleting enquiry:", error);
            return { success: false, error: "Failed to delete enquiry" };
        }
        
        revalidatePath("/admin/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting enquiry:", error);
        return { success: false, error: "Failed to delete enquiry" };
    }
}
