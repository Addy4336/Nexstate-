import { supabaseAdmin } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { ArchivePropertyButton } from "@/components/admin/ArchivePropertyButton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/auth-utils";
import { getImageUrl } from "@/lib/utils";
import { StatusFilter } from "@/components/admin/StatusFilter";

async function getProperties(statusFilter?: string) {
    let query = supabaseAdmin
        .from("property")
        .select("*")
        .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
        query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching properties:", error);
        return [];
    }

    return data || [];
}

interface PropertiesPageProps {
    searchParams: Promise<{ status?: string }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    // Verify staff access
    await requireStaff();

    const params = await searchParams;
    const statusFilter = params.status || 'all';
    const properties = await getProperties(statusFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
                    <p className="text-muted-foreground">
                        Manage your property listings.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusFilter defaultValue={statusFilter} />
                    <Link href="/admin/properties/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Property
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                    <div key={property.id} className="bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col">
                        <div className="relative aspect-video">
                            {property.images && property.images.length > 0 ? (
                                <Image
                                    src={getImageUrl(property.images[0])}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            {property.featured && (
                                <div className="absolute top-2 left-2">
                                    <Badge className="bg-primary text-primary-foreground border-0">Featured</Badge>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                                    {property.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{property.location}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span>{property.bedrooms} Beds</span>
                                <span>{property.bathrooms} Baths</span>
                                <span>{property.area_sqft} sqft</span>
                            </div>

                            <div className="text-xl font-bold text-primary mt-auto">
                                AED {property.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </div>
                        </div>

                        <div className="p-4 pt-0 flex gap-2">
                            <Link href={`/admin/properties/${property.id}/edit`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </Button>
                            </Link>
                            <ArchivePropertyButton
                                id={property.id}
                                title={property.title}
                                isArchived={property.status === 'archived'}
                            />
                            <DeletePropertyButton id={property.id} />
                        </div>
                    </div>
                ))}

                {properties.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                        <p>No properties found.</p>
                        <Link href="/admin/properties/new" className="text-primary hover:underline mt-2 inline-block">
                            Create your first property
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
