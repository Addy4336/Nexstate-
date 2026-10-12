"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateEnquiryStatus } from "@/actions/enquiry-actions";
import { toast } from "sonner";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-constants";
import { Loader2 } from "lucide-react";

interface LeadStatusSelectProps {
    enquiryId: string;
    currentStatus: string;
}

export function LeadStatusSelect({ enquiryId, currentStatus }: LeadStatusSelectProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState(currentStatus);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const result = await updateEnquiryStatus(enquiryId, newStatus);
            if (result.success) {
                setStatus(newStatus);
                toast.success("Status updated successfully");
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const currentStatusConfig = ENQUIRY_STATUSES.find(s => s.value === status);

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className={`w-[130px] h-8 text-xs ${currentStatusConfig?.color || ''}`}>
                {isUpdating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <SelectValue />
                )}
            </SelectTrigger>
            <SelectContent>
                {ENQUIRY_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="text-xs">
                        <span className={`inline-flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full ${s.color.split(' ')[0].replace('/10', '')}`} />
                            {s.label}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
