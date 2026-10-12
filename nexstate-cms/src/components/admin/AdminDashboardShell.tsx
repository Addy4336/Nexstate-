"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { cn } from "@/lib/utils";

interface AdminDashboardShellProps {
    children: React.ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <div className={cn(
                "min-h-screen flex flex-col transition-all duration-300",
                isCollapsed ? "lg:pl-[70px]" : "lg:pl-[260px]"
            )}>
                <AdminTopNav />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
