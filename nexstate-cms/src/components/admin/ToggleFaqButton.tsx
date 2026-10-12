"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleFaqActive } from "@/actions/faq-actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ToggleFaqButtonProps {
    id: string;
    isActive: boolean;
}

export function ToggleFaqButton({ id, isActive: initialActive }: ToggleFaqButtonProps) {
    const [isActive, setIsActive] = useState(initialActive);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const result = await toggleFaqActive(id, !isActive);
            if (result.error) {
                toast.error(result.error);
            } else {
                setIsActive(!isActive);
                toast.success(isActive ? "FAQ hidden" : "FAQ published");
            }
        } catch (error) {
            toast.error("Failed to toggle FAQ status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={isLoading}
            className="gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isActive ? (
                <>
                    <Eye className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-xs">Active</span>
                </>
            ) : (
                <>
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">Hidden</span>
                </>
            )}
        </Button>
    );
}
