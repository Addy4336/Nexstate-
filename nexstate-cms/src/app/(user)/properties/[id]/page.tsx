import { brand } from "@nexstate/brand";
import { getPropertyById } from "@/lib/properties";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BedDouble,
    Bath,
    Maximize,
    MapPin,
    Check,
    Home
} from "lucide-react";
import { EnquiryForm } from "@/components/user/EnquiryForm";
import { FavoriteButton } from "@/components/user/FavoriteButton";
import { ShareButton } from "@/components/user/ShareButton";
import Link from "next/link";
import { Property } from "@/types/property";

interface PropertyPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps) {
    const id = (await params).id;
    const property = await getPropertyById(id);
    if (!property) return { title: "Property Not Found" };

    return {
        title: `${property.title} | ${brand.name}`,
        description: property.description?.substring(0, 160),
    };
}

// Default amenities for properties that don't have any set
const DEFAULT_AMENITIES = [
    "Fully Furnished", "High-Speed Wi-Fi", "Kitchen Appliances",
    "Swimming Pool", "Gym Access", "Parking"
];

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
    const id = (await params).id;
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    // Use property amenities if available, otherwise use defaults
    const amenities = property.amenities && property.amenities.length > 0 
        ? property.amenities 
        : DEFAULT_AMENITIES;

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container px-4 md:px-6">

                {/* Breadcrumb / Back */}
                <div className="mb-6">
                    <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Home className="w-3 h-3" /> Properties / <span className="text-foreground font-medium">{property.title}</span>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Main Image */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm bg-muted">
                            {property.images && property.images.length > 0 ? (
                                <img
                                    src={getImageUrl(property.images[0])}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No Image Available
                                </div>
                            )}

                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-background/90 text-foreground hover:bg-background">
                                    {property.status}
                                </Badge>
                                {property.featured && (
                                    <Badge variant="secondary" className="bg-accent text-accent-foreground">Featured</Badge>
                                )}
                            </div>
                        </div>

                        {/* Gallery (Thumbnail Strip) */}
                        {property.images && property.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {property.images.slice(1, 5).map((img, i) => (
                                    <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`${property.title} ${i + 2}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Title & Key Specs */}
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {property.location}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">
                                            AED {property.price.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground">per month</div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <FavoriteButton propertyId={property.id} variant="icon" />
                                        <ShareButton title={property.title} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-accent/10 rounded-full text-accent">
                                        <BedDouble className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                                        <p className="font-semibold">{property.bedrooms}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-accent/10 rounded-full text-accent">
                                        <Bath className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                                        <p className="font-semibold">{property.bathrooms}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-accent/10 rounded-full text-accent">
                                        <Maximize className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Area</p>
                                        <p className="font-semibold">{property.area_sqft} sqft</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">About this Property</h2>
                            <div className="prose text-muted-foreground max-w-none">
                                <p>{property.description}</p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-accent" />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Enquiry Form & Actions */}
                    <div className="space-y-6">
                        <div className="sticky top-24 space-y-6">

                            {/* Book Viewing Card */}
                            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                                <h3 className="text-lg font-bold mb-1">Interested?</h3>
                                <p className="text-muted-foreground text-sm mb-6">Send us an enquiry to book a viewing.</p>

                                <EnquiryForm
                                    propertyId={property.id}
                                    propertyTitle={property.title}
                                    type="tenant_enquiry"
                                />
                            </div>

                            {/* Agent Info (Mock) */}
                            <div className="p-4 bg-muted/30 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                                    {brand.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{brand.name} Team</p>
                                    <p className="text-xs text-muted-foreground">Property Management</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
