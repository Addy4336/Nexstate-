"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { setInitialAdminPassword } from "@/actions/admin-setup-actions";
import { motion } from "framer-motion";

/**
 * Initial Admin Password Setup Page
 * Allows setting password for pre-seeded admin account
 * This page should be removed or disabled in production after initial setup
 */
export default function SetupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email || !name) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            // Set the password (will create user if doesn't exist)
            const result = await setInitialAdminPassword({ email, password, name, token });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Admin account created successfully!", {
                    description: "You can now log in with your credentials.",
                });
                setTimeout(() => router.push("/admin/login"), 1500);
            }
        } catch (err: any) {
            const errorMessage = err.message || "Something went wrong";
            
            // Check for database connection errors
            if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("connect")) {
                toast.error("Database connection failed!", {
                    description: "Please check your DATABASE_URL in .env.local",
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-card border rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold">Initial Admin Setup</h1>
                        <p className="text-muted-foreground text-sm">
                            Set a password for the default admin account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="token">Setup Token (if configured)</Label>
                            <Input id="token" type="password" value={token} onChange={(e) => setToken(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Admin User"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                This will be your login email
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Minimum 8 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Setting up...
                                </>
                            ) : (
                                "Set Password & Continue"
                            )}
                        </Button>
                    </form>

                    <div className="pt-4 border-t">
                        <p className="text-xs text-center text-muted-foreground">
                            ⚠️ This setup page should be disabled in production
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
