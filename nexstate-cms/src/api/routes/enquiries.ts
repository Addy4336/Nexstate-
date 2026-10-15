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

        // An enquiry never books dates. This endpoint is public and unpaid, so letting it write
        // rental_periods would let anyone block any home's calendar. Dates the visitor mentions are
        // kept in property_details for the team; bookings are created only by a verified payment
        // (payments/settle -> book_property_period) or by staff in the admin.

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
