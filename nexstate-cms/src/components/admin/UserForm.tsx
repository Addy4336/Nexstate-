"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteUser } from "@/actions/user-actions";
import { Loader2, Mail, Shield, Briefcase, PenTool, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const roles = [
    {
        value: "admin",
        label: "Admin",
        description: "Full access to settings, users, and financials.",
        icon: Shield,
        color: "text-purple-600 bg-purple-50 border-purple-200",
        activeBorder: "border-purple-600 ring-1 ring-purple-600"
    },
    {
        value: "manager",
        label: "Manager",
        description: "Can manage properties, leads, and view reports.",
        icon: Briefcase,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        activeBorder: "border-blue-600 ring-1 ring-blue-600"
    },
    {
        value: "editor",
        label: "Editor",
        description: "Can Create/Update blog posts and content.",
        icon: PenTool,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        activeBorder: "border-amber-600 ring-1 ring-amber-600"
    },
];

export function UserForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState("editor");
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        // Ensure role is set in formData since we're using custom state
        formData.set('role', selectedRole);

        try {
            const result = await inviteUser(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(result?.message || "User invited successfully! 🎉");
                router.push("/admin/users");
            }
        } catch (e: any) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. John Doe"
                        required
                        className="h-10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. john@company.com"
                        required
                        className="h-10"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label>Select Role</Label>
                <div className="grid gap-4 md:grid-cols-3">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.value;
                        return (
                            <div
                                key={role.value}
                                onClick={() => setSelectedRole(role.value)}
                                className={cn(
                                    "relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 hover:bg-muted/50",
                                    isSelected ? role.activeBorder + " bg-muted/20" : "border-muted bg-card"
                                )}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-primary">
                                        <CheckCircle2 className="w-5 h-5 fill-current" />
                                    </div>
                                )}
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", role.color)}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">{role.label}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {role.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <input type="hidden" name="role" value={selectedRole} />
            </div>

            <div className="bg-muted/30 border border-dashed rounded-xl p-4 flex gap-4">
                <div className="p-2 bg-background rounded-full border shadow-sm h-fit">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-medium">Invitation Details</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                        The user will receive an email with a secure, temporary password.
                        They will be required to change it upon their first login.
                        Invitation links expire in 24 hours.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Mail className="w-4 h-4 mr-2" />
                    )}
                    Send Invitation
                </Button>
            </div>
        </form>
    );
}

