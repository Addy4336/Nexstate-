/**
 * Public (anonymous) view of a property row.
 *
 * Columns never sent to public clients: drive_folder_id, current_rental_start,
 * current_rental_end, rental_periods (booking history and tenant PII).
 * Public clients get derived, PII-free fields instead:
 *   - is_currently_rented / rented_until
 *   - booked_ranges (dates only, for availability calendars)
 */

export const PUBLIC_PROPERTY_COLUMNS = [
    "id", "title", "slug", "description", "price", "location",
    "bedrooms", "bathrooms", "area_sqft", "property_type", "status",
    "amenities", "images", "cover_image", "featured",
    "created_at", "updated_at",
    "furnishing", "gender_preference", "sharing_type", "available_from",
    "property_video",
    "vat", "booking_fee", "exit_cleaning_fee", "tourism_fee", "security_deposit",
] as const;

/**
 * Columns to SELECT on public routes: the public columns plus the two private
 * ones needed to derive rental info (stripped by toPublicProperty).
 */
export const PUBLIC_PROPERTY_SELECT = [
    ...PUBLIC_PROPERTY_COLUMNS,
    "current_rental_end",
    "rental_periods",
].join(", ");

export interface PublicBookedRange {
    start_date: string;
    end_date: string;
    status: string;
}

import type { Property } from "@/types/property";

type Row = Record<string, any>;

/** What anonymous clients receive: no booking history, tenant data, or Drive ids. */
export type PublicProperty = Omit<
    Property,
    "drive_folder_id" | "current_rental_start" | "current_rental_end" | "rental_periods" | "current_tenant" | "is_currently_rented"
> & {
    is_currently_rented: boolean;
    rented_until: string | null;
    booked_ranges: PublicBookedRange[];
};

// Rental dates are plain calendar dates (YYYY-MM-DD); compare against today's UTC date.
function todayISO(): string {
    return new Date().toISOString().split("T")[0];
}

export function toPublicProperty(row: Row): PublicProperty {
    const out: Row = {};
    for (const col of PUBLIC_PROPERTY_COLUMNS) {
        if (col in row) out[col] = row[col];
    }

    const today = todayISO();
    const rentedUntil: string | null = row.current_rental_end ?? null;
    const isRented = !!rentedUntil && rentedUntil >= today;

    const periods: Row[] = Array.isArray(row.rental_periods) ? row.rental_periods : [];
    const booked_ranges: PublicBookedRange[] = periods
        .filter((p) => (p.status === "confirmed" || p.status === "active") && p.end_date >= today)
        .map((p) => ({ start_date: p.start_date, end_date: p.end_date, status: p.status }));

    out.is_currently_rented = isRented;
    out.rented_until = isRented ? rentedUntil : null;
    out.booked_ranges = booked_ranges;
    return out as PublicProperty;
}

export function toPublicProperties(rows: Row[] | null | undefined): PublicProperty[] {
    return (rows || []).map(toPublicProperty);
}
