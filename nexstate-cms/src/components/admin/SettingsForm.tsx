"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Loader2, Save, User, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SettingsFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        image?: string | null;
    };
}

export function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter();
    const [name, setName] = useState(user.name);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password Update State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);

        try {
            await authClient.updateUser({
                name: name
            });
            toast.success("Profile updated successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsUpdatingPassword(true);

        try {
            const result = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true
            });

            if (result.error) {
                toast.error(result.error.message);
            } else {
                toast.success("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Profile Settings */}
            <Card className="border shadow-sm bg-card overflow-hidden h-full flex flex-col">
                <CardHeader className="border-b bg-muted/40 px-6 py-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile Settings
                    </CardTitle>
                    <CardDescription>
                        Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                            <Avatar className="h-12 w-12 border-2 border-muted">
                                <AvatarImage src={user.image || undefined} />
                                <AvatarFallback className="bg-primary/5 text-primary text-lg font-bold">
                                    {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="font-medium truncate max-w-[200px]">{user.name}</h3>
                                <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] uppercase font-bold tracking-wider">
                                    {user.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-9"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className="pl-9 bg-muted/50 h-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={isUpdatingProfile} className="w-full">
                                {isUpdatingProfile ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving Changes
                                    </>
                                ) : (
                                    "Save Profile"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="border shadow-sm bg-card overflow-hidden h-full flex flex-col">
                <CardHeader className="border-b bg-muted/40 px-6 py-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Change your password securely.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="h-9"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="h-9"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="h-9"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-lg p-3 text-xs text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-900/50">
                            Security Tip: Use a strong password with at least 8 characters, including numbers and symbols.
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={isUpdatingPassword} variant="destructive" className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-50 dark:text-slate-900">
                                {isUpdatingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
