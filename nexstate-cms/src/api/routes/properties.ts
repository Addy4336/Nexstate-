import { Elysia, t } from "elysia";
import { redactTenantData, getApiSession, requireStaffGuard } from "../guards";
import { supabaseAdmin } from "@/lib/db";
import { areDatesAvailable, calculateRentalCost, validateMinimumStay } from "@/lib/rental-utils";
import { PUBLIC_PROPERTY_SELECT, toPublicProperty, toPublicProperties } from "@/lib/public-property";

// "/:id" must not expose drafts/archived/sold listings to anonymous clients
const PUBLIC_STATUSES = ["available", "rented"];

// PostgREST .or() takes a comma/paren-delimited expression; strip the delimiters from user input
const sanitizeFilterTerm = (s: string) => s.replace(/[,()*%\\]/g, " ").trim();
import { RentalPeriod } from "@/types/property";

export const propertiesRoutes = new Elysia({ prefix: "/properties" })
    // Never expose tenant/booking data to non-staff clients
    .onAfterHandle(async ({ request, response }) => {
        if (!response || typeof response !== "object" || !/rental_periods|current_tenant/.test(JSON.stringify(response))) return;
        const session = await getApiSession(request);
        const role = session?.user?.role as string | undefined;
        if (role && ["admin", "manager", "editor"].includes(role)) return;
        return redactTenantData(response);
    })
    // Get all properties (public) - shows all with rental status
    .get("/", async ({ query }) => {
        const { limit, featured } = query;
        
        let queryBuilder = supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .in("status", ["available", "rented"]);
        
        if (featured === "true") {
            queryBuilder = queryBuilder.eq("featured", true);
        }
        
        queryBuilder = queryBuilder
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false });
        
        if (limit) {
            queryBuilder = queryBuilder.limit(parseInt(limit));
        }
        
        const { data, error } = await queryBuilder;
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: toPublicProperties(data) };
    }, {
        query: t.Object({
            limit: t.Optional(t.String()),
            featured: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get available properties",
            description: "Fetches all available properties with optional filtering",
        },
    })
    
    // Get featured properties (shows all, including rented)
    .get("/featured", async ({ query }) => {
        const limit = query.limit ? parseInt(query.limit) : 6;
        
        const { data, error } = await supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .in("status", ["available", "rented"])
            .eq("featured", true)
            .order("created_at", { ascending: false })
            .limit(limit);
        
        if (error) {
            console.error("Error fetching featured properties:", error);
            return { success: false, error: error.message, data: [] };
        }
        
        // If no featured properties, fall back to the latest public listings
        if (!data || data.length === 0) {
            const { data: fallbackData, error: fallbackError } = await supabaseAdmin
                .from("property")
                .select(PUBLIC_PROPERTY_SELECT)
                .in("status", PUBLIC_STATUSES)
                .order("created_at", { ascending: false })
                .limit(limit);

            if (fallbackError) {
                console.error("Error fetching available properties:", fallbackError);
                return { success: false, error: fallbackError.message, data: [] };
            }

            return { success: true, data: toPublicProperties(fallbackData) };
        }

        return { success: true, data: toPublicProperties(data) };
    }, {
        query: t.Object({
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get featured properties",
            description: "Fetches featured properties for homepage display",
        },
    })
    
    // Search/filter properties (shows all including rented)
    .get("/search", async ({ query }) => {
        const { q, location, minPrice, maxPrice, bedrooms } = query;
        
        let queryBuilder = supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .in("status", ["available", "rented"]);
        
        const term = q ? sanitizeFilterTerm(q) : "";
        if (term) {
            queryBuilder = queryBuilder.or(
                `title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`
            );
        }

        if (location) {
            queryBuilder = queryBuilder.ilike("location", `%${location}%`);
        }
        
        if (minPrice) {
            queryBuilder = queryBuilder.gte("price", parseInt(minPrice));
        }
        
        if (maxPrice) {
            queryBuilder = queryBuilder.lte("price", parseInt(maxPrice));
        }
        
        if (bedrooms) {
            queryBuilder = queryBuilder.gte("bedrooms", parseInt(bedrooms));
        }
        
        queryBuilder = queryBuilder
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false });
        
        const { data, error } = await queryBuilder;
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: toPublicProperties(data) };
    }, {
        query: t.Object({
            q: t.Optional(t.String()),
            location: t.Optional(t.String()),
            minPrice: t.Optional(t.String()),
            maxPrice: t.Optional(t.String()),
            bedrooms: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Search properties",
            description: "Search and filter properties by various criteria",
        },
    })
    
    // Get single property by ID
    .get("/:id", async ({ params, request }) => {
        const session = await getApiSession(request);
        const isStaff = ["admin", "manager", "editor"].includes(session?.user?.role as string);

        let builder = supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .eq("id", params.id);
        if (!isStaff) builder = builder.in("status", PUBLIC_STATUSES);

        const { data, error } = await builder.single();

        if (error || !data) {
            return { success: false, error: "Property not found", data: null };
        }

        return { success: true, data: toPublicProperty(data) };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get property by ID",
            description: "Fetches a single property by its ID",
        },
    })
    
    // Get property locations (for location filter)
    .get("/meta/locations", async () => {
        const { data, error } = await supabaseAdmin
            .from("property")
            .select("location")
            .in("status", ["available", "rented"]);
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        // Get unique locations
        const locations = [...new Set(data?.map(p => p.location).filter(Boolean))];
        
        return { success: true, data: locations };
    }, {
        detail: {
            tags: ["Properties"],
            summary: "Get property locations",
            description: "Get list of unique property locations for filtering",
        },
    })
    
    // Advanced search with filters and pagination (shows all including rented)
    .post("/search/advanced", async ({ body }) => {
        const { 
            filters = {}, 
            page = 1, 
            pageSize = 12 
        } = body;
        
        let query = supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .in("status", ["available", "rented"]);
        
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
        
        query = query
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
            return { 
                success: false, 
                error: error.message, 
                data: { properties: [], total: 0, page, pageSize } 
            };
        }
        
        const enrichedProperties = toPublicProperties(data);

        const total = enrichedProperties.length;
        const offset = (page - 1) * pageSize;
        const paginatedProperties = enrichedProperties.slice(offset, offset + pageSize);
        
        return { 
            success: true, 
            data: {
                properties: paginatedProperties,
                total,
                page,
                pageSize,
            }
        };
    }, {
        body: t.Object({
            filters: t.Optional(t.Object({
                location: t.Optional(t.String()),
                propertyType: t.Optional(t.String()),
                budgetMin: t.Optional(t.Number()),
                budgetMax: t.Optional(t.Number()),
                sharingType: t.Optional(t.String()),
                furnishing: t.Optional(t.String()),
                genderPreference: t.Optional(t.String()),
                bedrooms: t.Optional(t.Array(t.Number())),
                bathrooms: t.Optional(t.Array(t.Number())),
                amenities: t.Optional(t.Array(t.String())),
                availableFrom: t.Optional(t.String()),
            })),
            page: t.Optional(t.Number()),
            pageSize: t.Optional(t.Number()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Advanced property search",
            description: "Search properties with advanced filters including property type, furnishing, amenities, and pagination",
        },
    })
    
    // Get similar properties
    .get("/:id/similar", async ({ params, query }) => {
        const limit = query.limit ? parseInt(query.limit) : 4;
        
        // First get the current property
        const { data: property, error: propError } = await supabaseAdmin
            .from("property")
            .select("location, price")
            .eq("id", params.id)
            .single();
        
        if (propError || !property) {
            return { success: false, error: "Property not found", data: [] };
        }
        
        const minPrice = property.price * 0.8;
        const maxPrice = property.price * 1.2;
        
        const { data, error } = await supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .neq("id", params.id)
            .ilike("location", `%${property.location}%`)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .eq("status", "available")
            .limit(limit);
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: toPublicProperties(data) };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        query: t.Object({
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get similar properties",
            description: "Get properties similar to the specified one based on location and price",
        },
    })
    
    // Get upgrade properties (higher price range)
    .get("/:id/upgrades", async ({ params, query }) => {
        const limit = query.limit ? parseInt(query.limit) : 4;
        
        // First get the current property
        const { data: property, error: propError } = await supabaseAdmin
            .from("property")
            .select("price")
            .eq("id", params.id)
            .single();
        
        if (propError || !property) {
            return { success: false, error: "Property not found", data: [] };
        }
        
        const minPrice = property.price * 1.1;
        const maxPrice = property.price * 1.4;
        
        const { data, error } = await supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .neq("id", params.id)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .eq("status", "available")
            .order("price", { ascending: true })
            .limit(limit);
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: toPublicProperties(data) };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        query: t.Object({
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get upgrade properties",
            description: "Get higher-priced alternatives to the specified property",
        },
    })
    
    // Get budget-friendly alternatives (lower price range)
    .get("/:id/budget", async ({ params, query }) => {
        const limit = query.limit ? parseInt(query.limit) : 4;
        
        // First get the current property
        const { data: property, error: propError } = await supabaseAdmin
            .from("property")
            .select("price")
            .eq("id", params.id)
            .single();
        
        if (propError || !property) {
            return { success: false, error: "Property not found", data: [] };
        }
        
        const minPrice = property.price * 0.6;
        const maxPrice = property.price * 0.9;
        
        const { data, error } = await supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .neq("id", params.id)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .eq("status", "available")
            .order("price", { ascending: false })
            .limit(limit);
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: toPublicProperties(data) };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        query: t.Object({
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get budget-friendly properties",
            description: "Get lower-priced alternatives to the specified property",
        },
    })
    
    // Get popular properties in an area
    .get("/area/:location/popular", async ({ params, query }) => {
        const limit = query.limit ? parseInt(query.limit) : 4;
        const excludeId = query.excludeId;
        
        let queryBuilder = supabaseAdmin
            .from("property")
            .select(PUBLIC_PROPERTY_SELECT)
            .ilike("location", `%${params.location}%`)
            .eq("status", "available")
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(limit);
        
        if (excludeId) {
            queryBuilder = queryBuilder.neq("id", excludeId);
        }
        
        const { data, error } = await queryBuilder;
        
        if (error) {
            return { success: false, error: error.message, data: [] };
        }
        
        return { success: true, data: toPublicProperties(data) };
    }, {
        params: t.Object({
            location: t.String(),
        }),
        query: t.Object({
            limit: t.Optional(t.String()),
            excludeId: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get popular properties in area",
            description: "Get popular/featured properties in a specific location",
        },
    })
    
    // Get property types (for filter dropdowns)
    .get("/meta/types", async () => {
        const types = [
            { value: "apartment", label: "Apartment" },
            { value: "villa", label: "Villa" },
            { value: "townhouse", label: "Townhouse" },
            { value: "penthouse", label: "Penthouse" },
            { value: "studio", label: "Studio" },
            { value: "duplex", label: "Duplex" },
        ];
        
        return { success: true, data: types };
    }, {
        detail: {
            tags: ["Properties"],
            summary: "Get property types",
            description: "Get list of available property types for filtering",
        },
    })
    
    // Get amenities list (for filter dropdowns)
    .get("/meta/amenities", async () => {
        const amenities = [
            "Swimming Pool",
            "Gym",
            "Parking",
            "Balcony",
            "Garden",
            "Security",
            "CCTV",
            "Elevator",
            "Central AC",
            "Built-in Wardrobes",
            "Maid's Room",
            "Study Room",
            "Private Pool",
            "Beach Access",
            "Golf Course View",
            "Sea View",
            "City View",
            "Concierge",
            "Children's Play Area",
            "BBQ Area",
        ];
        
        return { success: true, data: amenities };
    }, {
        detail: {
            tags: ["Properties"],
            summary: "Get amenities list",
            description: "Get list of available amenities for filtering",
        },
    })
    
    // Get furnishing options
    .get("/meta/furnishing", async () => {
        const options = [
            { value: "furnished", label: "Furnished" },
            { value: "unfurnished", label: "Unfurnished" },
            { value: "semi-furnished", label: "Semi-Furnished" },
        ];
        
        return { success: true, data: options };
    }, {
        detail: {
            tags: ["Properties"],
            summary: "Get furnishing options",
            description: "Get list of furnishing options for filtering",
        },
    })
    
    // Check property availability for specific dates
    .get("/:id/availability", async ({ params, query }) => {
        const { start_date, end_date } = query;
        
        if (!start_date || !end_date) {
            return {
                success: false,
                error: "start_date and end_date are required",
                available: false,
            };
        }
        
        const { data: property, error } = await supabaseAdmin
            .from("property")
            .select("price, current_rental_end, rental_periods")
            .eq("id", params.id)
            .single();
        
        if (error || !property) {
            return {
                success: false,
                error: "Property not found",
                available: false,
            };
        }
        
        // No minimum stay validation - removed per requirement
        
        // Check availability
        const availabilityCheck = areDatesAvailable(
            start_date,
            end_date,
            property.current_rental_end,
            property.rental_periods || []
        );
        
        if (!availabilityCheck.available) {
            return {
                success: false,
                error: availabilityCheck.reason,
                available: false,
            };
        }
        
        // Calculate cost
        const cost = calculateRentalCost(start_date, end_date, property.price);
        
        return {
            success: true,
            available: true,
            cost,
            nextAvailableDate: property.current_rental_end,
        };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        query: t.Object({
            start_date: t.String(),
            end_date: t.String(),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Check property availability",
            description: "Check if property is available for specific date range",
        },
    })
    
    // Create a booking
    .post("/:id/book", async ({ params, body }) => {
        const { start_date, end_date, tenant_name, tenant_email, tenant_phone, guests, notes } = body;
        
        // First check availability
        const { data: property, error: fetchError } = await supabaseAdmin
            .from("property")
            .select("*")
            .eq("id", params.id)
            .single();
        
        if (fetchError || !property) {
            return {
                success: false,
                error: "Property not found",
            };
        }
        
        // No minimum stay validation - removed per requirement
        
        // Check availability
        const availabilityCheck = areDatesAvailable(
            start_date,
            end_date,
            property.current_rental_end,
            property.rental_periods || []
        );
        
        if (!availabilityCheck.available) {
            return {
                success: false,
                error: availabilityCheck.reason,
            };
        }
        
        // Calculate cost
        const cost = calculateRentalCost(start_date, end_date, property.price);
        
        // Create new rental period
        const newRental: RentalPeriod = {
            start_date,
            end_date,
            tenant_name,
            tenant_email,
            tenant_phone,
            amount: cost.total,
            guests: guests || 1,
            status: "confirmed",
            created_at: new Date().toISOString(),
            notes,
        };
        
        // Update rental_periods array
        const updatedRentalPeriods = [...(property.rental_periods || []), newRental];
        
        // Check if immediate rental
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingStart = new Date(start_date);
        const isImmediateRental = bookingStart <= today;
        
        const updateData: any = {
            rental_periods: updatedRentalPeriods,
            updated_at: new Date().toISOString(),
        };
        
        if (isImmediateRental) {
            updateData.current_rental_start = start_date;
            updateData.current_rental_end = end_date;
            updateData.status = "rented";
        }
        
        const { error: updateError } = await supabaseAdmin
            .from("property")
            .update(updateData)
            .eq("id", params.id);
        
        if (updateError) {
            console.error("Error creating booking:", updateError);
            return {
                success: false,
                error: "Failed to create booking",
            };
        }
        
        return {
            success: true,
            booking: newRental,
            cost,
            message: "Booking confirmed successfully!",
        };
    }, {
        beforeHandle: requireStaffGuard,
        params: t.Object({
            id: t.String(),
        }),
        body: t.Object({
            start_date: t.String(),
            end_date: t.String(),
            tenant_name: t.String(),
            tenant_email: t.String(),
            tenant_phone: t.Optional(t.String()),
            guests: t.Optional(t.Number()),
            notes: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Book a property",
            description: "Create a new booking for a property",
        },
    })
    
    // Get property bookings/rental history
    .get("/:id/bookings", async ({ params }) => {
        const { data: property, error } = await supabaseAdmin
            .from("property")
            .select("rental_periods, current_rental_start, current_rental_end")
            .eq("id", params.id)
            .single();
        
        if (error || !property) {
            return {
                success: false,
                error: "Property not found",
                data: [],
            };
        }
        
        return {
            success: true,
            data: {
                bookings: property.rental_periods || [],
                currentRental: {
                    start: property.current_rental_start,
                    end: property.current_rental_end,
                },
            },
        };
    }, {
        beforeHandle: requireStaffGuard,
        params: t.Object({
            id: t.String(),
        }),
        detail: {
            tags: ["Properties"],
            summary: "Get property bookings",
            description: "Get all bookings and rental history for a property",
        },
    })
    
    // Update rental statuses (check expired rentals)
    .post("/update-rental-statuses", async () => {
        try {
            const { error } = await supabaseAdmin.rpc("update_property_rental_status");
            
            if (error) {
                console.error("Error updating rental statuses:", error);
                return {
                    success: false,
                    error: "Failed to update rental statuses",
                };
            }
            
            return {
                success: true,
                message: "Rental statuses updated successfully",
            };
        } catch (error) {
            console.error("Error updating rental statuses:", error);
            return {
                success: false,
                error: "Failed to update rental statuses",
            };
        }
    }, {
        beforeHandle: requireStaffGuard,
        detail: {
            tags: ["Properties"],
            summary: "Update rental statuses",
            description: "Manually trigger update of rental statuses (mark expired rentals as available)",
        },
    });
