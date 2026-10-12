"use client";

import { brand } from "@nexstate/brand";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";


function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn.email({
                email,
                password,
                callbackURL: callbackUrl,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Welcome back!", {
                            description: "Successfully signed in to admin dashboard",
                        });
                        // Use replace to prevent back button returning to login
                        router.replace(callbackUrl);
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Invalid email or password");
                    }
                }
            });
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="flex items-center gap-2 text-2xl font-bold whitespace-nowrap">
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary">{brand.name}</span>
                    <span className="text-foreground">Admin</span>
                </div>
            </Link>

            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground mb-8">
                Sign in to your {brand.name} admin portal
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </motion.div>
    );
}

function LoginFormFallback() {
    return (
        <div className="w-full max-w-md animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-8" />
            <div className="h-10 w-48 bg-muted rounded mb-2" />
            <div className="h-6 w-64 bg-muted rounded mb-8" />
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="h-4 w-12 bg-muted rounded" />
                    <div className="h-10 w-full bg-muted rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-10 w-full bg-muted rounded" />
                </div>
                <div className="h-10 w-full bg-muted rounded" />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-12 relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-chart-1 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="max-w-lg text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-3xl font-bold text-foreground mb-6 flex items-center justify-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                            {brand.name}
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            {brand.name} Admin Portal
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Manage properties, leads, and AI intelligent recommendations with our unified admin dashboard.
                            Adaptive, real-time, and AI-powered.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
