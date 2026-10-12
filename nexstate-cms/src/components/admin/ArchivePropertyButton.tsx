"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { archiveProperty } from "@/actions/property-actions";
import { toast } from "sonner";
import { Archive, Loader2 } from "lucide-react";

interface ArchivePropertyButtonProps {
    id: string;
    title: string;
    isArchived?: boolean;
}

export function ArchivePropertyButton({ id, title, isArchived = false }: ArchivePropertyButtonProps) {
    const [isArchiving, setIsArchiving] = useState(false);
    const [open, setOpen] = useState(false);

    const handleArchive = async () => {
        setIsArchiving(true);
        try {
            const result = await archiveProperty(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(isArchived ? "Property restored" : "Property archived successfully");
                setOpen(false);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsArchiving(false);
        }
    };

    if (isArchived) {
        return null; // Don't show archive button for already archived properties
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-amber-600">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archive Property</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to archive <strong>{title}</strong>? 
                        Archived properties won't be visible to users but can be restored later.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleArchive}
                        disabled={isArchiving}
                        className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                        {isArchiving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Archiving...
                            </>
                        ) : (
                            <>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
