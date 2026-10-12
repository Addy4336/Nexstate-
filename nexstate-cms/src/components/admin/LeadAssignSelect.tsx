"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { assignEnquiry } from "@/actions/enquiry-actions";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import type { StaffUser } from "@/lib/enquiries";

interface LeadAssignSelectProps {
    enquiryId: string;
    currentAssignee: string | null;
    staffUsers: StaffUser[];
}

export function LeadAssignSelect({ enquiryId, currentAssignee, staffUsers }: LeadAssignSelectProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [assignedTo, setAssignedTo] = useState(currentAssignee || "unassigned");

    const handleAssignChange = async (userId: string) => {
        setIsUpdating(true);
        try {
            const result = await assignEnquiry(enquiryId, userId === "unassigned" ? null : userId);
            if (result.success) {
                setAssignedTo(userId);
                toast.success(userId === "unassigned" ? "Lead unassigned" : "Lead assigned successfully");
            } else {
                toast.error(result.error || "Failed to assign lead");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const currentUser = staffUsers.find(u => u.id === assignedTo);

    return (
        <Select value={assignedTo} onValueChange={handleAssignChange} disabled={isUpdating}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
                {isUpdating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <span className="flex items-center gap-2 truncate">
                        <User className="w-3 h-3 shrink-0" />
                        {currentUser ? currentUser.name : "Unassigned"}
                    </span>
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="unassigned" className="text-xs">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-3 h-3" />
                        Unassigned
                    </span>
                </SelectItem>
                {staffUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id} className="text-xs">
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="truncate">{user.name}</span>
                            <span className="text-muted-foreground capitalize">({user.role})</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
