/**
 * Rental period information
 */
export interface RentalPeriod {
  start_date: string;
  end_date: string;
  tenant_id?: string;
  tenant_name: string;
  tenant_email: string;
  tenant_phone?: string;
  amount: number;
  guests?: number;
  status: "confirmed" | "active" | "completed" | "cancelled";
  created_at?: string;
  notes?: string;
}

/**
 * Current tenant information for rented properties
 */
export interface CurrentTenant {
  name: string;
  email: string;
  phone: string | null;
  check_in_date: string;
  check_out_date: string;
  guests: number | null;
  amount_paid: number;
}

/**
 * Property type matching the database schema
 */
export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  status: "available" | "rented" | "sold" | "maintenance" | "archived";
  images: string[] | null;
  cover_image: string[] | null;
  drive_folder_id: string | null;
  property_video: string | null; // Public URL of the uploaded video (Supabase Storage)
  featured: boolean;
  amenities: string[] | null;
  created_at: Date;
  updated_at: Date;
  // Rental tracking fields
  current_rental_start: string | null;
  current_rental_end: string | null;
  rental_periods: RentalPeriod[];
  // Runtime fields (populated dynamically)
  is_currently_rented?: boolean;
  current_tenant?: CurrentTenant | null;
}

/**
 * Available amenities for properties
 */
export const PROPERTY_AMENITIES = [
  "Fully Furnished",
  "High-Speed Wi-Fi",
  "Kitchen Appliances",
  "Swimming Pool",
  "Gym Access",
  "Parking",
  "Balcony",
  "Sea View",
  "City View",
  "24/7 Security",
  "Concierge",
  "Pet Friendly",
  "Laundry",
  "Smart Home",
  "Central AC",
  "Maid's Room",
  "Study Room",
  "Storage",
  "BBQ Area",
  "Kids Play Area",
] as const;

export type PropertyAmenity = typeof PROPERTY_AMENITIES[number];

/**
 * Property type for display purposes (formatted)
 */
export interface PropertyDisplay {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  featured: boolean;
  amenities: string[];
}
