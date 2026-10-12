"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminTopNav() {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Get page title from pathname
    const getPageTitle = () => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length <= 1) return "Dashboard";
        return segments[segments.length - 1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background pl-16 pr-6 lg:px-6">
            {/* Page Title - Commented out */}
            <div className="flex-1">
                {/* <h1 className="text-xl font-semibold text-foreground capitalize">
                    {getPageTitle()}
                </h1> */}

                {/* Search - Moved here */}
                <div className="w-full max-w-md flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-muted/40 focus-within:bg-background focus-within:ring-1 focus-within:ring-ring transition-colors">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    3
                </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                                {session?.user?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block text-sm font-medium">
                            {session?.user?.name || "Admin"}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
