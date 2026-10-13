export interface Property {
    id: string;
    title: string;
    description: string | null;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number | null;
    status: string;
    images: string[] | null;
    cover_image: string[] | null;
    featured: boolean;
    amenities: string[] | null;
    /** Derived by the API from private rental data; dates only, never tenant details. */
    is_currently_rented?: boolean;
    rented_until?: string | null;
}

export interface ApiResponse {
    success: boolean;
    data: Property[];
    error?: string;
}
