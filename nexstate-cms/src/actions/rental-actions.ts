"use server";

import { requireStaff } from "@/lib/auth-utils";


import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RentalPeriod } from "@/types/property";
import {
  areDatesAvailable,
  validateMinimumStay,
  calculateRentalCost,
} from "@/lib/rental-utils";

export interface BookingData {
  start_date: string;
  end_date: string;
  tenant_name: string;
  tenant_email: string;
  tenant_phone?: string;
  guests?: number;
  notes?: string;
}

/**
 * Check if property is available for specific dates
 */
export async function checkPropertyAvailability(
  propertyId: string,
  startDate: string,
  endDate: string
) {
  try {
    const { data: property, error } = await supabaseAdmin
      .from("property")
      .select("current_rental_end, rental_periods, price")
      .eq("id", propertyId)
      .single();

    if (error || !property) {
      return {
        success: false,
        error: "Property not found",
        available: false,
      };
    }

    // No minimum stay validation - removed per requirement

    // Check date availability
    const availabilityCheck = areDatesAvailable(
      startDate,
      endDate,
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
    const cost = calculateRentalCost(startDate, endDate, property.price);

    return {
      success: true,
      available: true,
      cost,
    };
  } catch (error: any) {
    console.error("Error checking availability:", error);
    return {
      success: false,
      error: "Failed to check availability",
      available: false,
    };
  }
}

/**
 * Create a new booking for a property
 */
export async function createBooking(propertyId: string, bookingData: BookingData) {
    await requireStaff();
  try {
    // First, check availability again
    const availabilityCheck = await checkPropertyAvailability(
      propertyId,
      bookingData.start_date,
      bookingData.end_date
    );

    if (!availabilityCheck.success || !availabilityCheck.available) {
      return {
        success: false,
        error: availabilityCheck.error || "Dates not available",
      };
    }

    // Get current property data
    const { data: property, error: fetchError } = await supabaseAdmin
      .from("property")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (fetchError || !property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    // Create new rental period
    const newRental: RentalPeriod = {
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      tenant_name: bookingData.tenant_name,
      tenant_email: bookingData.tenant_email,
      tenant_phone: bookingData.tenant_phone,
      amount: availabilityCheck.cost?.total || 0,
      guests: bookingData.guests || 1,
      status: "confirmed",
      created_at: new Date().toISOString(),
      notes: bookingData.notes,
    };

    // Update rental_periods array
    const updatedRentalPeriods = [...(property.rental_periods || []), newRental];

    // Check if this booking starts today or in the past (immediate rental)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingStart = new Date(bookingData.start_date);
    const isImmediateRental = bookingStart <= today;

    const updateData: any = {
      rental_periods: updatedRentalPeriods,
      updated_at: new Date().toISOString(),
    };

    // If immediate rental, update current rental fields and status
    if (isImmediateRental) {
      updateData.current_rental_start = bookingData.start_date;
      updateData.current_rental_end = bookingData.end_date;
      updateData.status = "rented";
    }

    // Update property
    const { error: updateError } = await supabaseAdmin
      .from("property")
      .update(updateData)
      .eq("id", propertyId);

    if (updateError) {
      console.error("Error updating property:", updateError);
      return {
        success: false,
        error: "Failed to create booking",
      };
    }

    // Revalidate pages
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.location}/${propertyId}`);
    revalidatePath("/admin/properties");

    return {
      success: true,
      bookingId: newRental.created_at,
      booking: newRental,
      message: "Booking confirmed successfully!",
    };
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: "An error occurred while creating the booking",
    };
  }
}

/**
 * Get all bookings for a property
 */
export async function getPropertyBookings(propertyId: string) {
  try {
    const { data: property, error } = await supabaseAdmin
      .from("property")
      .select("rental_periods, current_rental_start, current_rental_end")
      .eq("id", propertyId)
      .single();

    if (error || !property) {
      return {
        success: false,
        error: "Property not found",
        bookings: [],
      };
    }

    return {
      success: true,
      bookings: property.rental_periods || [],
      currentRental: {
        start: property.current_rental_start,
        end: property.current_rental_end,
      },
    };
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      error: "Failed to fetch bookings",
      bookings: [],
    };
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(propertyId: string, bookingDate: string) {
    await requireStaff();
  try {
    const { data: property, error: fetchError } = await supabaseAdmin
      .from("property")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (fetchError || !property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    // Find and update the booking status
    const updatedRentalPeriods = (property.rental_periods || []).map(
      (rental: RentalPeriod) => {
        if (rental.created_at === bookingDate) {
          return { ...rental, status: "cancelled" as const };
        }
        return rental;
      }
    );

    const { error: updateError } = await supabaseAdmin
      .from("property")
      .update({
        rental_periods: updatedRentalPeriods,
        updated_at: new Date().toISOString(),
      })
      .eq("id", propertyId);

    if (updateError) {
      return {
        success: false,
        error: "Failed to cancel booking",
      };
    }

    revalidatePath("/properties");
    revalidatePath(`/properties/${property.location}/${propertyId}`);
    revalidatePath("/admin/properties");

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: "An error occurred while cancelling the booking",
    };
  }
}

/**
 * Update property rental status (automated task)
 * This should be called periodically (e.g., daily cron job)
 */
export async function updatePropertyRentalStatuses() {
    await requireStaff();
  try {
    const today = new Date().toISOString().split("T")[0];

    // Find properties with expired rentals
    const { data: expiredRentals, error: fetchError } = await supabaseAdmin
      .from("property")
      .select("*")
      .eq("status", "rented")
      .lt("current_rental_end", today);

    if (fetchError) {
      console.error("Error fetching expired rentals:", fetchError);
      return { success: false, error: "Failed to fetch expired rentals" };
    }

    // Update each expired rental
    if (expiredRentals && expiredRentals.length > 0) {
      for (const property of expiredRentals) {
        await supabaseAdmin
          .from("property")
          .update({
            status: "available",
            current_rental_start: null,
            current_rental_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", property.id);
      }
    }

    revalidatePath("/properties");
    revalidatePath("/admin/properties");

    return {
      success: true,
      updated: expiredRentals?.length || 0,
    };
  } catch (error: any) {
    console.error("Error updating rental statuses:", error);
    return {
      success: false,
      error: "Failed to update rental statuses",
    };
  }
}
