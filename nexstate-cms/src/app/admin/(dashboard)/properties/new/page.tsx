import { PropertyForm } from "@/components/admin/PropertyForm";
import { requireStaff } from "@/lib/auth-utils";

export default async function NewPropertyPage() {
    // Verify staff access
    await requireStaff();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
                <p className="text-muted-foreground">
                    Create a new property listing.
                </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <PropertyForm />
            </div>
        </div>
    );
}
