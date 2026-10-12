import { supabaseAdmin } from "@/lib/db";
import { FaqForm } from "@/components/admin/FaqForm";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth-utils";

async function getFaq(id: string) {
    const { data, error } = await supabaseAdmin
        .from("faq")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching FAQ:", error);
        return null;
    }

    return data;
}

interface EditFaqPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
    await requireStaff();

    const { id } = await params;
    const faq = await getFaq(id);

    if (!faq) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit FAQ</h1>
                <p className="text-muted-foreground">
                    Update this frequently asked question.
                </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <FaqForm initialData={faq} />
            </div>
        </div>
    );
}
