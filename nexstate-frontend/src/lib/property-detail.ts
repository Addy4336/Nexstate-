import { addDays, isAfter, isBefore, max as maxDate, parseISO, startOfDay } from "date-fns";
import { processImageUrls } from "@/lib/image-utils";
import { areaOf } from "@/lib/areas";
import { cityOf } from "@/lib/property-filters";

/** A booked date range as the public API exposes it: dates only, inclusive at both ends, no tenant data. */
export interface BookedRange {
    start_date: string;
    end_date: string;
    status?: string;
}

/** Everything the property page needs, normalised from the API (no invented defaults). */
export interface PropertyDetail {
    id: string;
    title: string;
    description: string;
    location: string;
    area: string;
    city: string;
    images: string[];
    price: number;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number | null;
    propertyType: string | null;
    furnishing: string | null;
    amenities: string[];
    fees: {
        taxRate: number;
        bookingFee: number;
        exitCleaningFee: number;
        tourismFee: number;
        securityDeposit: number;
    };
    bookedRanges: BookedRange[];
    availableFrom: string | null;
}

const num = (v: unknown, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPropertyDetail(p: any): PropertyDetail {
    const images = processImageUrls([...(p.cover_image || []), ...(p.images || [])]);
    const location: string = p.location || "";
    return {
        id: p.id,
        title: p.title || "Furnished home",
        description: p.description || "",
        location,
        area: areaOf(location),
        city: location.includes(",") ? cityOf(location) : "",
        images,
        price: num(p.price),
        bedrooms: num(p.bedrooms),
        bathrooms: num(p.bathrooms),
        areaSqft: p.area_sqft ? num(p.area_sqft) : null,
        propertyType: p.property_type || null,
        furnishing: p.furnishing || null,
        amenities: Array.isArray(p.amenities) ? p.amenities.filter(Boolean) : [],
        fees: {
            // Same default the server's quote uses when a property has no rate set.
            taxRate: p.vat === null || p.vat === undefined ? 5 : num(p.vat),
            bookingFee: num(p.booking_fee),
            exitCleaningFee: num(p.exit_cleaning_fee),
            tourismFee: num(p.tourism_fee),
            securityDeposit: num(p.security_deposit),
        },
        bookedRanges: (Array.isArray(p.booked_ranges) ? p.booked_ranges : []).filter(
            (r: BookedRange) => !r.status || r.status === "active" || r.status === "confirmed"
        ),
        availableFrom: p.available_from || null,
    };
}

/* ---------- date rules (mirror the server's areDatesAvailable / book_property_period) ---------- */

const day = (iso: string) => startOfDay(parseISO(iso));

/** True if the day falls inside any booked range (both ends inclusive, as on the server). */
export function isBookedDay(date: Date, ranges: BookedRange[]): boolean {
    const d = startOfDay(date);
    return ranges.some((r) => !isBefore(d, day(r.start_date)) && !isAfter(d, day(r.end_date)));
}

/** True if a stay from..to overlaps a booking. Inclusive at both ends, exactly like the server check. */
export function rangeConflicts(from: Date, to: Date, ranges: BookedRange[]): boolean {
    const a = startOfDay(from);
    const b = startOfDay(to);
    return ranges.some((r) => !isAfter(a, day(r.end_date)) && !isBefore(b, day(r.start_date)));
}

/** Earliest check-in that has room for a minimum stay: today, or after the bookings that block it. */
export function firstOpenStart(ranges: BookedRange[], minNights: number, availableFrom?: string | null): Date {
    let start = startOfDay(new Date());
    if (availableFrom) start = maxDate([start, day(availableFrom)]);
    const sorted = [...ranges].sort((x, y) => x.start_date.localeCompare(y.start_date));
    // Walk forward past any booking the stay would collide with.
    for (let guard = 0; guard < sorted.length + 1; guard++) {
        const end = addDays(start, minNights);
        const hit = sorted.find((r) => !isAfter(start, day(r.end_date)) && !isBefore(end, day(r.start_date)));
        if (!hit) return start;
        start = addDays(day(hit.end_date), 1);
    }
    return start;
}
