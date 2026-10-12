import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";
import { getApiSession, requireSessionGuard } from "../guards";
import { PUBLIC_PROPERTY_SELECT, toPublicProperty } from "@/lib/public-property";

export const favoritesRoutes = new Elysia({ prefix: "/favorites" })
    // All favorites endpoints act on the signed-in user only
    .onBeforeHandle(requireSessionGuard)
    // Toggle favorite (add/remove)
    .post("/toggle", async ({ body, request }) => {
        const { propertyId } = body;
        const userId = (await getApiSession(request))!.user.id;
        
        if (!propertyId || !userId) {
            return { success: false, error: "Missing required fields" };
        }
        
        // Check if already favorited
        const { data: existing } = await supabaseAdmin
            .from("favorite")
            .select("id")
            .eq("user_id", userId)
            .eq("property_id", propertyId)
            .single();
        
        if (existing) {
            // Remove favorite
            await supabaseAdmin
                .from("favorite")
                .delete()
                .eq("user_id", userId)
                .eq("property_id", propertyId);
            
            return { success: true, isFavorited: false };
        } else {
            // Add favorite
            await supabaseAdmin
                .from("favorite")
                .insert({ user_id: userId, property_id: propertyId });
            
            return { success: true, isFavorited: true };
        }
    }, {
        body: t.Object({
            propertyId: t.String(),
            userId: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Favorites"],
            summary: "Toggle favorite",
            description: "Add or remove a property from favorites",
        },
    })
    
    // Get user's favorites
    .get("/user/:userId", async ({ params, request }) => {
        const userId = (await getApiSession(request))!.user.id;
        const { data, error } = await supabaseAdmin
            .from("favorite")
            .select(`created_at, property:property_id (${PUBLIC_PROPERTY_SELECT})`)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        // Public property shape only; hide listings that are no longer public
        const favorites = (data || [])
            .filter((row: any) => row.property && ["available", "rented"].includes(row.property.status))
            .map((row: any) => ({ created_at: row.created_at, property: toPublicProperty(row.property) }));

        return { success: true, data: favorites };
    }, {
        params: t.Object({
            userId: t.String(),
        }),
        detail: {
            tags: ["Favorites"],
            summary: "Get user favorites",
            description: "Get all favorited properties for a user",
        },
    })
    
    // Get user's favorite property IDs (lightweight)
    .get("/user/:userId/ids", async ({ params, request }) => {
        const userId = (await getApiSession(request))!.user.id;
        const { data, error } = await supabaseAdmin
            .from("favorite")
            .select("property_id")
            .eq("user_id", userId);
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        const ids = (data || []).map(row => row.property_id);
        return { success: true, data: ids };
    }, {
        params: t.Object({
            userId: t.String(),
        }),
        detail: {
            tags: ["Favorites"],
            summary: "Get favorite IDs",
            description: "Get IDs of favorited properties for a user (lightweight)",
        },
    })
    
    // Check if property is favorited
    .get("/check/:propertyId/:userId", async ({ params, request }) => {
        const userId = (await getApiSession(request))!.user.id;
        const { data } = await supabaseAdmin
            .from("favorite")
            .select("id")
            .eq("user_id", userId)
            .eq("property_id", params.propertyId)
            .single();
        
        return { success: true, isFavorited: !!data };
    }, {
        params: t.Object({
            propertyId: t.String(),
            userId: t.String(),
        }),
        detail: {
            tags: ["Favorites"],
            summary: "Check favorite status",
            description: "Check if a property is favorited by a user",
        },
    });
