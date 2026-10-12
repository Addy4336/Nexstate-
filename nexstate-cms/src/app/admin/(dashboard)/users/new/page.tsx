import { UserForm } from "@/components/admin/UserForm";
import { requireAdmin } from "@/lib/auth-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default async function NewUserPage() {
    // Verify admin access
    await requireAdmin();

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="border shadow-sm bg-card">
                <CardHeader className="border-b bg-muted/40 px-6 py-5">
                    <CardTitle className="text-xl font-bold tracking-tight">Invite Team Member</CardTitle>
                    <CardDescription>
                        Send an invitation with login credentials to a new team member.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <UserForm />
                </CardContent>
            </Card>
        </div>
    );
}
