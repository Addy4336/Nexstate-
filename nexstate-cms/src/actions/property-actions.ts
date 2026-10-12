"use server";

import { requireStaff, requireManager } from "@/lib/auth-utils";

import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProperty(formData: FormData) {
    await requireStaff();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const area_sqft = parseInt(formData.get("area_sqft") as string) || 0;
    const status = formData.get("status") as string || "available";
    const featured = formData.get("featured") === "on";

    // Extract Fee Fields
    const vat = parseFloat(formData.get("vat") as string) || 5;
    const booking_fee = parseFloat(formData.get("booking_fee") as string) || 0;
    const exit_cleaning_fee = parseFloat(formData.get("exit_cleaning_fee") as string) || 0;
    const tourism_fee = parseFloat(formData.get("tourism_fee") as string) || 0;
    const security_deposit = parseFloat(formData.get("security_deposit") as string) || 0;

    // Images are passed as comma-separated string from client component
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];

    // Amenities are passed as comma-separated string
    const amenitiesString = formData.get("amenities") as string;
    const amenities = amenitiesString ? amenitiesString.split(",").filter(Boolean) : [];

    // Extract property video URL
    const property_video = (formData.get("property_video") as string) || null;

    // Extract cover image (first image in the list)
    // IMPORTANT: The schema says cover_image is text[] (ARRAY), so we wrap it in an array
    const cover_image = images.length > 0 ? [images[0]] : [];

    try {
        const { error } = await supabaseAdmin
            .from("property")
            .insert({
                title,
                description,
                price,
                location,
                bedrooms,
                bathrooms,
                area_sqft,
                status,
                images,
                featured,
                cover_image,
                property_video,
                amenities,
                vat,
                booking_fee,
                exit_cleaning_fee,
                tourism_fee,
                security_deposit,
                // Initialize rental tracking columns with defaults
                rental_periods: [],
                current_rental_start: null,
                current_rental_end: null,
            });

        if (error) {
            console.error("Error creating property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        console.error("Error creating property:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/properties");
    revalidatePath("/"); // Revalidate homepage to show updated properties
    return { success: true };
}

export async function updateProperty(id: string, formData: FormData) {
    await requireStaff();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const area_sqft = parseInt(formData.get("area_sqft") as string) || 0;
    const status = formData.get("status") as string || "available";
    const featured = formData.get("featured") === "on";

    // Extract Fee Fields
    const vat = parseFloat(formData.get("vat") as string) || 5;
    const booking_fee = parseFloat(formData.get("booking_fee") as string) || 0;
    const exit_cleaning_fee = parseFloat(formData.get("exit_cleaning_fee") as string) || 0;
    const tourism_fee = parseFloat(formData.get("tourism_fee") as string) || 0;
    const security_deposit = parseFloat(formData.get("security_deposit") as string) || 0;

    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").filter(Boolean) : [];
    const cover_image = images.length > 0 ? [images[0]] : [];

    const amenitiesString = formData.get("amenities") as string;
    const amenities = amenitiesString ? amenitiesString.split(",").filter(Boolean) : [];

    // Extract property video URL
    const property_video = (formData.get("property_video") as string) || null;

    try {
        const updateData: any = {
            title,
            description,
            price,
            location,
            bedrooms,
            bathrooms,
            area_sqft,
            status,
            images,
            featured,
            cover_image,
            property_video,
            amenities,
            vat,
            booking_fee,
            exit_cleaning_fee,
            tourism_fee,
            security_deposit,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabaseAdmin
            .from("property")
            .update(updateData)
            .eq("id", id);

        if (error) {
            console.error("Error updating property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        console.error("Error updating property:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${id}`);
    revalidatePath("/"); // Revalidate homepage
    return { success: true };
}

export async function deleteProperty(id: string) {
    await requireManager();
    try {
        const { error } = await supabaseAdmin
            .from("property")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        return { error: error.message };
    }
    revalidatePath("/admin/properties");
    revalidatePath("/"); // Revalidate homepage
    return { success: true };
}

export async function archiveProperty(id: string) {
    await requireStaff();
    try {
        const { error } = await supabaseAdmin
            .from("property")
            .update({
                status: "archived",
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error("Error archiving property:", error);
            return { error: error.message };
        }
    } catch (error: any) {
        return { error: error.message };
    }
    revalidatePath("/admin/properties");
    revalidatePath("/");
    return { success: true };
}
