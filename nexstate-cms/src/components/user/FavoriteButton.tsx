"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { toggleFavorite, isFavorited } from "@/actions/favorite-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
    propertyId: string;
    initialFavorited?: boolean;
    variant?: "icon" | "button";
    className?: string;
}

// Helper to get/set guest user ID in localStorage
function getGuestUserId(): string {
    if (typeof window === "undefined") return "";

    let guestId = localStorage.getItem("guest_user_id");
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        localStorage.setItem("guest_user_id", guestId);
    }
    return guestId;
}

export function FavoriteButton({
    propertyId,
    initialFavorited = false,
    variant = "icon",
    className
}: FavoriteButtonProps) {
    const [isFav, setIsFav] = useState(initialFavorited);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check actual favorite status on mount
        const checkStatus = async () => {
            const userId = getGuestUserId();
            if (userId) {
                const result = await isFavorited(propertyId, userId);
                setIsFav(result);
            }
        };
        checkStatus();
    }, [propertyId]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            const userId = getGuestUserId();
            const result = await toggleFavorite(propertyId, userId);

            if (result.success && result.isFavorited !== undefined) {
                setIsFav(result.isFavorited);
                toast.success(result.isFavorited ? "Added to favorites" : "Removed from favorites");
            } else {
                toast.error(result.error || "Failed to update favorites");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return null; // Avoid hydration mismatch
    }

    if (variant === "icon") {
        return (
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    "p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-sm hover:bg-card transition-all",
                    isFav && "text-destructive",
                    className
                )}
                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
                )}
            </button>
        );
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={isLoading}
            variant={isFav ? "default" : "outline"}
            className={cn(isFav && "bg-destructive hover:bg-destructive/90", className)}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Heart className={cn("w-4 h-4 mr-2", isFav && "fill-current")} />
            )}
            {isFav ? "Saved" : "Save Property"}
        </Button>
    );
}
