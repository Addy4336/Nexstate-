"use server";

import { supabaseAdmin } from "@/lib/db";
import type { PropertyFilters } from "@/components/properties/AdvancedFilters";

export interface SearchResult {
    properties: any[];
    total: number;
    page: number;
    pageSize: number;
}

export async function searchProperties(
    filters: Partial<PropertyFilters>,
    page: number = 1,
    pageSize: number = 12
): Promise<SearchResult> {
    try {
        let query = supabaseAdmin.from("property").select("*", { count: "exact" });

        // Location filter
        if (filters.location) {
            query = query.ilike("location", `%${filters.location}%`);
        }

        // Property type
        if (filters.propertyType && filters.propertyType !== "all") {
            query = query.eq("property_type", filters.propertyType);
        }

        // Budget range
        if (filters.budgetMin && filters.budgetMin > 0) {
            query = query.gte("price", filters.budgetMin);
        }

        if (filters.budgetMax && filters.budgetMax < 50000) {
            query = query.lte("price", filters.budgetMax);
        }

        // Sharing type
        if (filters.sharingType && filters.sharingType !== "all") {
            query = query.eq("sharing_type", filters.sharingType);
        }

        // Furnishing
        if (filters.furnishing && filters.furnishing !== "all") {
            query = query.eq("furnishing", filters.furnishing);
        }

        // Gender preference
        if (filters.genderPreference && filters.genderPreference !== "all") {
            query = query.eq("gender_preference", filters.genderPreference);
        }

        // Bedrooms
        if (filters.bedrooms && filters.bedrooms.length > 0) {
            query = query.in("bedrooms", filters.bedrooms);
        }

        // Bathrooms
        if (filters.bathrooms && filters.bathrooms.length > 0) {
            query = query.in("bathrooms", filters.bathrooms);
        }

        // Amenities (array contains)
        if (filters.amenities && filters.amenities.length > 0) {
            query = query.contains("amenities", filters.amenities);
        }

        // Available from
        if (filters.availableFrom) {
            query = query.lte("available_from", filters.availableFrom);
        }

        // Pagination
        const offset = (page - 1) * pageSize;
        query = query
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error("Error searching properties:", error);
            return { properties: [], total: 0, page, pageSize };
        }

        return {
            properties: data || [],
            total: count || 0,
            page,
            pageSize,
        };
    } catch (error: any) {
        console.error("Error searching properties:", error);
        return { properties: [], total: 0, page, pageSize };
    }
}

// Get similar properties based on location and price
export async function getSimilarProperties(
    propertyId: string,
    location: string,
    price: number,
    limit: number = 4
): Promise<any[]> {
    try {
        const minPrice = price * 0.8;
        const maxPrice = price * 1.2;

        const { data, error } = await supabaseAdmin
            .from("property")
            .select("*")
            .neq("id", propertyId)
            .ilike("location", `%${location}%`)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .eq("status", "available")
            .limit(limit);

        if (error) {
            console.error("Error fetching similar properties:", error);
            return [];
        }

        return data || [];
    } catch (error: any) {
        console.error("Error fetching similar properties:", error);
        return [];
    }
}

// Get upgrade options (higher price, better properties)
export async function getUpgradeProperties(
    propertyId: string,
    price: number,
    location: string,
    limit: number = 4
): Promise<any[]> {
    try {
        const minPrice = price * 1.1;
        const maxPrice = price * 1.4;

        const { data, error } = await supabaseAdmin
            .from("property")
            .select("*")
            .neq("id", propertyId)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .eq("status", "available")
            .order("price", { ascending: true })
            .limit(limit);

        if (error) {
            console.error("Error fetching upgrade properties:", error);
            return [];
        }

        return data || [];
    } catch (error: any) {
        console.error("Error fetching upgrade properties:", error);
        return [];
    }
}

// Get budget alternatives (lower price)
export async function getBudgetProperties(
    propertyId: string,
    price: number,
    location: string,
    limit: number = 4
): Promise<any[]> {
    try {
        const minPrice = price * 0.6;
        const maxPrice = price * 0.9;

        const { data, error } = await supabaseAdmin
            .from("property")
            .select("*")
            .neq("id", propertyId)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .eq("status", "available")
            .order("price", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching budget properties:", error);
            return [];
        }

        return data || [];
    } catch (error: any) {
        console.error("Error fetching budget properties:", error);
        return [];
    }
}

// Get popular properties in area
export async function getPopularInArea(
    location: string,
    excludeId?: string,
    limit: number = 4
): Promise<any[]> {
    try {
        let query = supabaseAdmin
            .from("property")
            .select("*")
            .ilike("location", `%${location}%`)
            .eq("status", "available")
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(limit);

        if (excludeId) {
            query = query.neq("id", excludeId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching popular properties:", error);
            return [];
        }

        return data || [];
    } catch (error: any) {
        console.error("Error fetching popular properties:", error);
        return [];
    }
}
