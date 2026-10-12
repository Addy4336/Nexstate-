"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserToggleProps {
    currentType: "tenant" | "owner";
    className?: string;
}

export default function UserToggle({ currentType, className }: UserToggleProps) {
    return (
        <div className={cn("flex justify-center w-full py-8", className)}>
            <div className="relative flex p-1 bg-muted rounded-full border border-border shadow-sm">
                <Link href="/" className="relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200">
                    <span className={cn("relative z-10", currentType === "tenant" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                        Tenant
                    </span>
                    {currentType === "tenant" && (
                        <motion.div
                            layoutId="user-toggle-pill"
                            className="absolute inset-0 bg-primary rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </Link>
                <Link href="/owner" className="relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200">
                    <span className={cn("relative z-10", currentType === "owner" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                        Owner
                    </span>
                    {currentType === "owner" && (
                        <motion.div
                            layoutId="user-toggle-pill"
                            className="absolute inset-0 bg-primary rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </Link>
            </div>
        </div>
    );
}
