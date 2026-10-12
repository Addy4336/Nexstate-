"use server";

import { requireStaff, requireManager } from "@/lib/auth-utils";

import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const FAQ_CATEGORIES = [
    "general",
    "properties",
    "investment",
    "buying",
    "selling",
    "renting",
    "legal",
    "finance",
];

export async function getFaqs() {
    try {
        const { data, error } = await supabaseAdmin
            .from("faq")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });
        
        if (error) {
            console.error("Error fetching FAQs:", error);
            return [];
        }
        
        return (data as FAQ[]) || [];
    } catch (error: any) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
}

export async function getFaqById(id: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from("faq")
            .select("*")
            .eq("id", id)
            .single();
        
        if (error) {
            console.error("Error fetching FAQ:", error);
            return null;
        }
        
        return data as FAQ | null;
    } catch (error: any) {
        console.error("Error fetching FAQ:", error);
        return null;
    }
}

export async function createFaq(formData: FormData) {
    await requireStaff();
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string || "general";
    const sortOrder = parseInt(formData.get("sort_order") as string || "0", 10);
    const isActive = formData.get("is_active") === "true";

    if (!question || !answer) {
        return { error: "Question and answer are required" };
    }

    try {
        const { error } = await supabaseAdmin
            .from("faq")
            .insert({
                question,
                answer,
                category,
                sort_order: sortOrder,
                is_active: isActive,
            });

        if (error) {
            console.error("Error creating FAQ:", error);
            return { error: error.message || "Failed to create FAQ" };
        }

        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating FAQ:", error);
        return { error: error.message || "Failed to create FAQ" };
    }
}

export async function updateFaq(id: string, formData: FormData) {
    await requireStaff();
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string || "general";
    const sortOrder = parseInt(formData.get("sort_order") as string || "0", 10);
    const isActive = formData.get("is_active") === "true";

    if (!question || !answer) {
        return { error: "Question and answer are required" };
    }

    try {
        const { error } = await supabaseAdmin
            .from("faq")
            .update({
                question,
                answer,
                category,
                sort_order: sortOrder,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error("Error updating FAQ:", error);
            return { error: error.message || "Failed to update FAQ" };
        }

        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating FAQ:", error);
        return { error: error.message || "Failed to update FAQ" };
    }
}

export async function deleteFaq(id: string) {
    await requireManager();
    try {
        const { error } = await supabaseAdmin
            .from("faq")
            .delete()
            .eq("id", id);
        
        if (error) {
            console.error("Error deleting FAQ:", error);
            return { error: error.message || "Failed to delete FAQ" };
        }
        
        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting FAQ:", error);
        return { error: error.message || "Failed to delete FAQ" };
    }
}

export async function toggleFaqActive(id: string, isActive: boolean) {
    await requireStaff();
    try {
        const { error } = await supabaseAdmin
            .from("faq")
            .update({
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);
        
        if (error) {
            console.error("Error toggling FAQ:", error);
            return { error: error.message || "Failed to toggle FAQ" };
        }
        
        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error toggling FAQ:", error);
        return { error: error.message || "Failed to toggle FAQ" };
    }
}

export async function reorderFaqs(faqIds: string[]) {
    await requireStaff();
    try {
        // Update sort_order for each FAQ based on its position in the array
        for (let i = 0; i < faqIds.length; i++) {
            const { error } = await supabaseAdmin
                .from("faq")
                .update({
                    sort_order: i,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", faqIds[i]);
            
            if (error) {
                console.error("Error reordering FAQ:", error);
                return { error: error.message || "Failed to reorder FAQs" };
            }
        }
        revalidatePath("/admin/faqs");
        return { success: true };
    } catch (error: any) {
        console.error("Error reordering FAQs:", error);
        return { error: error.message || "Failed to reorder FAQs" };
    }
}
