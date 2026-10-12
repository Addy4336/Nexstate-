import { supabaseAdmin } from "@/lib/db";
import { Property } from "@/types/property";
import { PUBLIC_PROPERTY_SELECT, toPublicProperty, toPublicProperties, type PublicProperty } from "@/lib/public-property";

/**
 * Fetches all properties from the database
 */
export async function getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all properties:", error);
        return [];
    }

    return (data as Property[]) || [];
}

/**
 * Fetches featured properties that are available
 * Used for the homepage featured section
 */
export async function getFeaturedProperties(limit: number = 6): Promise<PublicProperty[]> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select(PUBLIC_PROPERTY_SELECT)
        .in("status", ["available", "rented"])
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching featured properties:", error);
        return [];
    }

    return toPublicProperties(data);
}

/**
 * Fetches available properties (for public listing)
 */
export async function getAvailableProperties(limit?: number): Promise<PublicProperty[]> {
    let query = supabaseAdmin
        .from("property")
        .select(PUBLIC_PROPERTY_SELECT)
        .in("status", ["available", "rented"])
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching available properties:", error);
        return [];
    }

    return toPublicProperties(data);
}

/**
 * Fetches a single property by ID
 */
export async function getPropertyById(id: string): Promise<PublicProperty | null> {
    const { data, error } = await supabaseAdmin
        .from("property")
        .select(PUBLIC_PROPERTY_SELECT)
        .eq("id", id)
        .in("status", ["available", "rented"])
        .single();

    if (error) {
        console.error("Error fetching property by ID:", error);
        return null;
    }

    return toPublicProperty(data);
}

/**
 * Fetches filtered properties based on search criteria
 */
export async function getFilteredProperties(searchParams: {
    query?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
}): Promise<PublicProperty[]> {
    let queryBuilder = supabaseAdmin
        .from("property")
        .select(PUBLIC_PROPERTY_SELECT)
        .in("status", ["available", "rented"]);

    const term = searchParams.query?.replace(/[,()*%\\]/g, " ").trim();
    if (term) {
        queryBuilder = queryBuilder.or(
            `title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`
        );
    }

    if (searchParams.location) {
        queryBuilder = queryBuilder.ilike("location", `%${searchParams.location}%`);
    }

    if (searchParams.minPrice) {
        queryBuilder = queryBuilder.gte("price", searchParams.minPrice);
    }

    if (searchParams.maxPrice) {
        queryBuilder = queryBuilder.lte("price", searchParams.maxPrice);
    }

    if (searchParams.bedrooms) {
        queryBuilder = queryBuilder.gte("bedrooms", searchParams.bedrooms);
    }

    queryBuilder = queryBuilder
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
        console.error("Error fetching filtered properties:", error);
        return [];
    }

    return toPublicProperties(data);
}
