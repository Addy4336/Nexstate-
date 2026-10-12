import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";

export const enquiriesRoutes = new Elysia({ prefix: "/enquiries" })
    // Submit a new enquiry (public)
    .post("/", async ({ body }) => {
        const { type, name, email, phone, message, propertyId, propertyTitle, propertyDetails } = body;

        // Basic validation - only name and email are required
        if (!name || !email) {
            return { success: false, error: "Missing required fields: name and email are required" };
        }

        // Insert enquiry
        const { error: enquiryError } = await supabaseAdmin
            .from("enquiry")
            .insert({
                type: type || "general_contact",
                name,
                email,
                phone: phone || null,
                message: message || null,
                property_id: propertyId || null,
                property_title: propertyTitle || null,
                property_details: propertyDetails || null,
                status: "new",
            });

        if (enquiryError) {
            console.error("Error submitting enquiry:", enquiryError);
            return { success: false, error: "Failed to submit enquiry" };
        }

        // If booking data is included, update property table
        if (propertyId && propertyDetails?.bookingType === 'reservation' && propertyDetails.checkInDate && propertyDetails.checkOutDate) {
            try {
                // Get current property data
                const { data: property, error: fetchError } = await supabaseAdmin
                    .from("property")
                    .select("rental_periods")
                    .eq("id", propertyId)
                    .single();

                if (fetchError) {
                    console.error("Error fetching property:", fetchError);
                } else {
                    // Add new rental period to the array
                    const newRentalPeriod = {
                        start_date: propertyDetails.checkInDate,
                        end_date: propertyDetails.checkOutDate,
                        tenant_info: `${name} (${email})`,
                        amount: propertyDetails.totalAmount || 0,
                        status: "active",
                        guests: propertyDetails.guests || 1,
                        created_at: new Date().toISOString(),
                    };

                    const updatedRentalPeriods = [...(property?.rental_periods || []), newRentalPeriod];

                    // Update property with rental info
                    const { error: updateError } = await supabaseAdmin
                        .from("property")
                        .update({
                            status: "rented",
                            current_rental_start: propertyDetails.checkInDate,
                            current_rental_end: propertyDetails.checkOutDate,
                            rental_periods: updatedRentalPeriods,
                        })
                        .eq("id", propertyId);

                    if (updateError) {
                        console.error("Error updating property:", updateError);
                    }
                }
            } catch (err) {
                console.error("Error processing booking:", err);
            }
        }

        return { success: true, message: "Enquiry submitted successfully" };
    }, {
        body: t.Object({
            type: t.Optional(t.String()),
            name: t.String(),
            email: t.String(),
            phone: t.Optional(t.String()),
            message: t.Optional(t.String()),
            propertyId: t.Optional(t.String()),
            propertyTitle: t.Optional(t.String()),
            propertyDetails: t.Optional(t.Any()),
        }),
        detail: {
            tags: ["Enquiries"],
            summary: "Submit enquiry",
            description: "Submit a new enquiry or contact request",
        },
    })

    // Get enquiry types (public - for form dropdowns)
    .get("/types", async () => {
        const types = [
            { value: "tenant_enquiry", label: "Property Enquiry" },
            { value: "owner_enquiry", label: "Owner Services" },
            { value: "general_contact", label: "General Enquiry" },
            { value: "schedule_viewing", label: "Schedule Viewing" },
        ];

        return { success: true, data: types };
    }, {
        detail: {
            tags: ["Enquiries"],
            summary: "Get enquiry types",
            description: "Get available enquiry types for forms",
        },
    });
