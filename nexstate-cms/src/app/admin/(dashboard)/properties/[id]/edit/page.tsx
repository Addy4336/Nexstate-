
import { PropertyForm } from "@/components/admin/PropertyForm";
import { supabaseAdmin } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params as per Next.js 15/16 requirements
    const { id } = await params;

    const { data: property, error } = await supabaseAdmin
        .from("property")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
                <p className="text-muted-foreground">
                    Update property details and images.
                </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <PropertyForm initialData={property} />
            </div>
        </div>
    );
}
