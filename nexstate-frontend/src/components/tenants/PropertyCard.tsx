
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, MapPin } from 'lucide-react';
import { Property } from '@/types/property';

export function getPropertyImage(property: Property): string {
    if (property.cover_image && property.cover_image.length > 0) {
        return property.cover_image[0];
    }
    if (property.images && property.images.length > 0) {
        return property.images[0];
    }
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60';
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Link
            href={`/properties/${property.location.toLowerCase().replace(/\s+/g, '-')}/${property.id}`}
            className="flex flex-col group cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5">
                <Image
                    src={getPropertyImage(property)}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Badge */}
                <div className="absolute top-5 left-5 bg-secondary px-4 py-1.5 rounded-full text-xs font-semibold text-secondary-foreground shadow-sm">
                    {property.status === 'available' ? 'For Sale' : property.status}
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2">
                {/* Icons Row */}
                <div className="flex items-center gap-6 text-muted-foreground text-sm mb-1">
                    <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 stroke-1" />
                        <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 stroke-1" />
                        <span>{property.bathrooms} Bathroom</span>
                    </div>
                </div>

                <h3 className="text-2xl font-medium text-foreground tracking-tight line-clamp-1">
                    {property.title}
                </h3>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="font-semibold text-foreground text-lg">{formatPrice(property.price)}</span>
                    <span className="w-1 h-1 bg-muted-foreground/40 rounded-full"></span>
                    <span className="flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.location}
                    </span>
                </div>
            </div>
        </Link>
    );
}
