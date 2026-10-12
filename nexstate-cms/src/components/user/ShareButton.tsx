"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
    title: string;
    url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
    const handleShare = async () => {
        const shareUrl = url || window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this property: ${title}`,
                    url: shareUrl
                });
            } catch (error) {
                // User cancelled or error occurred
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
            } catch (error) {
                toast.error("Failed to copy link");
            }
        }
    };

    return (
        <Button 
            variant="outline" 
            size="icon"
            onClick={handleShare}
            title="Share property"
        >
            <Share2 className="w-4 h-4" />
        </Button>
    );
}
