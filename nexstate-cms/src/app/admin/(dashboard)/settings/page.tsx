import { requireAuth } from "@/lib/auth-utils";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
    // Verify authentication
    const session = await requireAuth();

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <SettingsForm user={session.user} />
        </div>
    );
}
