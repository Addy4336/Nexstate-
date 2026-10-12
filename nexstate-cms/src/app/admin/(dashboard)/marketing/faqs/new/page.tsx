import { FaqForm } from "@/components/admin/FaqForm";
import { requireStaff } from "@/lib/auth-utils";

export default async function NewFaqPage() {
    await requireStaff();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New FAQ</h1>
                <p className="text-muted-foreground">
                    Create a new frequently asked question.
                </p>
            </div>

            <FaqForm />
        </div>
    );
}
