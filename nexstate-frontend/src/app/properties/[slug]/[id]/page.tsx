import React from 'react';
import TripExperienceClient from './trip-experience-client';
import { notFound } from 'next/navigation';
import { processImageUrls, getFallbackImageUrl } from '@/lib/image-utils';

interface TripExperiencePageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Fetch property data from API
async function getPropertyData(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch property:', response.status);
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.error('Property not found or error:', result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Transform API data to component format
function transformPropertyData(property: any) {
  // Get images - cover_image is text[], images is text[]
  const images: string[] = [];

  // Add cover images first (cover_image is an array)
  if (property.cover_image && Array.isArray(property.cover_image)) {
    images.push(...property.cover_image);
  }

  // Add additional images
  if (property.images && Array.isArray(property.images)) {
    images.push(...property.images);
  }

  // Process images: filter empty values, convert Google Drive URLs, remove duplicates
  const uniqueImages = processImageUrls(images);

  // Ensure we have at least 5 images for the gallery
  const fallbackImage = getFallbackImageUrl();
  while (uniqueImages.length < 5) {
    uniqueImages.push(uniqueImages[0] || fallbackImage);
  }

  // Format location name
  const formattedLocation = property.location
    ? property.location.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    : 'Dubai';

  // Convert bedrooms number to text
  const bedroomText = (() => {
    const num = property.bedrooms;
    if (num === 0) return 'Studio';
    if (num === 1) return 'One';
    if (num === 2) return 'Two';
    if (num === 3) return 'Three';
    if (num === 4) return 'Four';
    if (num === 5) return 'Five';
    return `${num}`;
  })();

  // Convert bathrooms number to text
  const bathroomText = (() => {
    const num = property.bathrooms;
    if (num === 1) return 'One';
    if (num === 2) return 'Two';
    if (num === 3) return 'Three';
    if (num === 4) return 'Four';
    return `${num}`;
  })();

  // Parse amenities
  const amenitiesList = property.amenities || [];
  const insideAmenities = amenitiesList
    .filter((a: string) => ['Central AC', 'Built-in Wardrobes', 'Study Room', 'Elevator'].some(i => a.includes(i)) ||
      ['WiFi', 'TV', 'Kitchen', 'Bathroom', 'Bedroom', 'AC', 'Laundry'].some(i => a.toLowerCase().includes(i.toLowerCase())))
    .map((a: string) => ({ icon: '✓', text: a }));

  const outsideAmenities = amenitiesList
    .filter((a: string) => ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'CCTV', 'BBQ', 'Beach', 'Golf', 'Play Area', 'Concierge'].some(i => a.includes(i)))
    .map((a: string) => ({ icon: '✓', text: a }));

  // If amenities are not categorized, distribute them
  if (insideAmenities.length === 0 && outsideAmenities.length === 0) {
    amenitiesList.forEach((a: string, index: number) => {
      if (index % 2 === 0) {
        insideAmenities.push({ icon: '✓', text: a });
      } else {
        outsideAmenities.push({ icon: '✓', text: a });
      }
    });
  }

  // Default amenities if none provided
  const defaultInsideAmenities = [
    { icon: '❄️', text: 'Air conditioning in all rooms' },
    { icon: '📺', text: 'Smart TV with streaming services' },
    { icon: '📶', text: 'High-speed WiFi internet' },
    { icon: '🛁', text: 'Modern bathroom facilities' },
  ];

  const defaultOutsideAmenities = [
    { icon: '🏊‍♂️', text: 'Swimming pool access' },
    { icon: '🚗', text: 'Parking available' },
    { icon: '🛡️', text: '24/7 Security' },
  ];

  return {
    title: property.title || `Property in ${formattedLocation}`,
    images: uniqueImages.slice(0, 5),
    summary: {
      location: formattedLocation,
      propertyType: property.property_type
        ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)
        : 'Villa',
      bedrooms: bedroomText,
      bathrooms: bathroomText,
      area: property.area_sqft ? `${property.area_sqft.toLocaleString()} sqft` : '1,024 ft',
      parking: property.parking || 'Available'
    },
    highlights: [
      { icon: '🏠', text: `${property.property_type || 'Villa'} in ${formattedLocation}` },
      { icon: '🛏️', text: `${property.bedrooms || 4} Bedrooms, ${property.bathrooms || 3} Bathrooms` },
      { icon: '📐', text: property.area_sqft ? `${property.area_sqft.toLocaleString()} sqft of living space` : 'Spacious living area' },
      { icon: '✨', text: property.furnishing === 'furnished' ? 'Fully furnished and ready to move in' : 'Ready for move in' },
      { icon: '📍', text: `Prime location in ${formattedLocation}` },
      { icon: '🔑', text: property.available_from ? `Available from ${new Date(property.available_from).toLocaleDateString()}` : 'Available now' }
    ],
    description: property.description || `Experience comfort in this beautiful ${property.property_type || 'property'} located in ${formattedLocation}. Perfect for those seeking quality living with modern amenities.`,
    propertyRooms: [
      {
        room: 'Living Room',
        description: 'Spacious living area',
        images: uniqueImages.slice(1, 3),
        amenities: ['Comfortable seating', 'Smart TV', 'Air conditioning']
      },
      {
        room: 'Kitchen',
        description: 'Fully equipped kitchen',
        images: uniqueImages.slice(2, 4),
        amenities: ['Full-size refrigerator', 'Cooking stove', 'Microwave']
      },
      {
        room: 'Bedrooms',
        description: `${property.bedrooms || 4} comfortable bedrooms`,
        images: uniqueImages.slice(3, 5),
        amenities: ['Quality beds', 'Air conditioning', 'Built-in wardrobes']
      }
    ],
    insideAmenities: insideAmenities.length > 0 ? insideAmenities : defaultInsideAmenities,
    outsideAmenities: outsideAmenities.length > 0 ? outsideAmenities : defaultOutsideAmenities,
    availableFor: [
      { icon: '👨‍💼', label: 'Single Men', description: 'Individual male guests welcome' },
      { icon: '👩‍💼', label: 'Single Women', description: 'Female-friendly accommodation' },
      { icon: '💑', label: 'Couples', description: 'Perfect for couples' },
      { icon: '👨‍👩‍👧‍👦', label: 'Families', description: 'Family-friendly' }
    ],
    essentials: [
      { icon: '🔑', label: 'Key Access' },
      { icon: '🧼', label: 'Toiletries' },
      { icon: '🛏️', label: 'Fresh Linens' },
      { icon: '🧴', label: 'Towels' },
    ],
    faqs: [
      'What is the minimum stay duration?',
      'Is the property suitable for families?',
      'What amenities are included?',
      'How do I access the property?'
    ],
    pricing: {
      from: property.price || 2500,
      currency: 'AED',
      fees: {
        vat: property.vat !== undefined ? property.vat : 5,
        bookingFee: property.booking_fee || 0,
        exitCleaningFee: property.exit_cleaning_fee || 0,
        tourismFee: property.tourism_fee || 0,
        securityDeposit: property.security_deposit || 0,
      },
      availableDates: [
        {
          dates: 'Current Month',
          price: property.price || 2500,
          available: true,
          selected: true
        },
        {
          dates: 'Next Month',
          price: Math.round((property.price || 2500) * 0.95),
          available: true,
          selected: false
        },
        {
          dates: 'In 2 Months',
          price: Math.round((property.price || 2500) * 0.9),
          available: true,
          selected: false
        }
      ]
    }
  };
}

// Fallback data for when API fails
function getFallbackData(slug: string) {
  const formattedName = slug
    ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dubai Marina';

  return {
    title: `Beautiful Property in ${formattedName}`,
    images: [
      'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601221998768-c0cdf463a393?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=800&auto=format&fit=crop',
      'https://plus.unsplash.com/premium_photo-1720486620020-c70516e9b69f?w=800&auto=format&fit=crop',
      'https://plus.unsplash.com/premium_photo-1687996107444-10614a7de48a?w=800&auto=format&fit=crop'
    ],
    summary: {
      location: formattedName,
      propertyType: 'Villa',
      bedrooms: 'Four',
      bathrooms: 'Three',
      area: '1,024 ft',
      parking: 'Indoor'
    },
    highlights: [
      { icon: '🏊‍♂️', text: 'Private swimming pool with stunning views' },
      { icon: '🚗', text: 'Dedicated parking space' },
      { icon: '🏋️‍♀️', text: 'Access to fitness center' },
      { icon: '🛡️', text: '24/7 security' },
    ],
    description: `Experience comfortable living in this spacious ${formattedName} property.`,
    propertyRooms: [],
    insideAmenities: [
      { icon: '❄️', text: 'Air conditioning' },
      { icon: '📺', text: 'Smart TV' },
      { icon: '📶', text: 'High-speed WiFi' },
    ],
    outsideAmenities: [
      { icon: '🏊‍♂️', text: 'Swimming pool' },
      { icon: '🚗', text: 'Parking' },
    ],
    availableFor: [
      { icon: '👨‍💼', label: 'Single Men', description: 'Welcome' },
      { icon: '👩‍💼', label: 'Single Women', description: 'Welcome' },
      { icon: '💑', label: 'Couples', description: 'Welcome' },
      { icon: '👨‍👩‍👧‍👦', label: 'Families', description: 'Welcome' }
    ],
    essentials: [
      { icon: '🔑', label: 'Key Access' },
      { icon: '🧼', label: 'Toiletries' },
    ],
    faqs: [],
    pricing: {
      from: 2500,
      currency: 'AED',
      availableDates: [
        { dates: 'Current Month', price: 2500, available: true, selected: true }
      ]
    }
  };
}

export default async function PropertyDetailsPage({ params }: TripExperiencePageProps) {
  const { slug, id } = await params;

  // Fetch property from API
  const propertyData = await getPropertyData(id);

  // Use API data or fallback
  const property = propertyData
    ? transformPropertyData(propertyData)
    : getFallbackData(slug);

  // Pass rental data to client component
  const rentalData = propertyData ? {
    status: propertyData.status || 'available',
    currentRentalEnd: propertyData.rented_until || null,
    currentRentalStart: null,
    // Public API exposes booked date ranges only (no tenant details)
    rentalPeriods: propertyData.booked_ranges || [],
  } : null;

  return <TripExperienceClient trip={property} slug={slug} id={id} rentalData={rentalData} />;
}
