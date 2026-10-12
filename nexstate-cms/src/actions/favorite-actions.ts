"use server";

import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth-utils";
import { PUBLIC_PROPERTY_SELECT, toPublicProperty, type PublicProperty } from "@/lib/public-property";

const GUEST_COOKIE = "guest_user_id";

/** Signed-in user id, else the guest cookie id. With create=true a missing guest id is minted and stored. */
async function resolveUserId(create = false): Promise<string | null> {
    const session = await getSession();
    if (session?.user?.id) return session.user.id;

    const cookieStore = await cookies();
    const existing = cookieStore.get(GUEST_COOKIE)?.value;
    if (existing && /^guest_[0-9a-f-]{36}$/.test(existing)) return existing;
    if (!create) return null;

    const guestId = `guest_${crypto.randomUUID()}`;
    cookieStore.set(GUEST_COOKIE, guestId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    });
    return guestId;
}

export async function toggleFavorite(propertyId: string, _userId?: string) {
    // Identity comes from the session (or guest cookie), never from the caller
    const effectiveUserId = await resolveUserId(true);
    if (!effectiveUserId) return { success: false, error: "Failed to update favorite" };

    try {
        // Check if already favorited
        const { data: existing } = await supabaseAdmin
            .from("favorite")
            .select("id")
            .eq("user_id", effectiveUserId)
            .eq("property_id", propertyId)
            .single();

        if (existing) {
            // Remove favorite
            await supabaseAdmin
                .from("favorite")
                .delete()
                .eq("user_id", effectiveUserId)
                .eq("property_id", propertyId);
            
            revalidatePath("/properties");
            revalidatePath(`/properties/${propertyId}`);
            return { success: true, isFavorited: false };
        } else {
            // Add favorite
            await supabaseAdmin
                .from("favorite")
                .insert({ user_id: effectiveUserId, property_id: propertyId });
            
            revalidatePath("/properties");
            revalidatePath(`/properties/${propertyId}`);
            return { success: true, isFavorited: true };
        }
    } catch (error: any) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: "Failed to update favorite" };
    }
}

export async function getFavorites(_userId?: string): Promise<PublicProperty[]> {
    try {
        const userId = await resolveUserId();
        if (!userId) return [];

        const { data, error } = await supabaseAdmin
            .from("favorite")
            .select(`created_at, property:property_id (${PUBLIC_PROPERTY_SELECT})`)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting favorites:", error);
            return [];
        }

        // Only listings that are still public; strip booking/tenant/Drive fields
        return (data || [])
            .map((row: any) => row.property)
            .filter((p: any) => p && ["available", "rented"].includes(p.status))
            .map(toPublicProperty);
    } catch (error: any) {
        console.error("Error getting favorites:", error);
        return [];
    }
}

export async function getFavoritePropertyIds(_userId?: string): Promise<string[]> {
    try {
        const userId = await resolveUserId();
        if (!userId) return [];
        const { data, error } = await supabaseAdmin
            .from("favorite")
            .select("property_id")
            .eq("user_id", userId);
        
        if (error) {
            console.error("Error getting favorite IDs:", error);
            return [];
        }
        
        return (data || []).map(row => row.property_id);
    } catch (error: any) {
        console.error("Error getting favorite IDs:", error);
        return [];
    }
}

export async function isFavorited(propertyId: string, _userId?: string): Promise<boolean> {
    try {
        const userId = await resolveUserId();
        if (!userId) return false;
        const { data } = await supabaseAdmin
            .from("favorite")
            .select("id")
            .eq("user_id", userId)
            .eq("property_id", propertyId)
            .single();
        
        return !!data;
    } catch (error: any) {
        console.error("Error checking favorite:", error);
        return false;
    }
}

export async function getFavoriteCount(propertyId: string): Promise<number> {
    try {
        const { count, error } = await supabaseAdmin
            .from("favorite")
            .select("*", { count: "exact", head: true })
            .eq("property_id", propertyId);
        
        if (error) {
            console.error("Error getting favorite count:", error);
            return 0;
        }
        
        return count || 0;
    } catch (error: any) {
        console.error("Error getting favorite count:", error);
        return 0;
    }
}
