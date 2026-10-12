"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitEnquiry } from "@/actions/enquiry-actions";

interface EnquiryFormProps {
    propertyId?: string;
    propertyTitle?: string;
    type?: "tenant_enquiry" | "owner_submission" | "general_contact";
    className?: string;
}

export function EnquiryForm({
    propertyId,
    propertyTitle,
    type = "tenant_enquiry",
    className
}: EnquiryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);

        // Append hidden fields
        formData.append("type", type);
        if (propertyId) formData.append("propertyId", propertyId);
        if (propertyTitle) formData.append("propertyTitle", propertyTitle);

        try {
            const result = await submitEnquiry(formData);
            if (result.success) {
                toast.success("Enquiry sent successfully! Our team will contact you shortly.");
                // specialized reset could go here if we had a ref to the form
                (document.getElementById("enquiry-form") as HTMLFormElement)?.reset();
            } else {
                toast.error(result.error || "Failed to send enquiry");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form id="enquiry-form" action={handleSubmit} className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <Input
                    name="name"
                    placeholder="Your Name"
                    required
                    className="bg-background"
                />
            </div>
            <div className="space-y-2">
                <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    className="bg-background"
                />
            </div>
            <div className="space-y-2">
                <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-background"
                />
            </div>
            <div className="space-y-2">
                <Textarea
                    name="message"
                    placeholder="I'm interested in this property. Please provide more details."
                    required
                    className="min-h-[100px] bg-background"
                />
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Enquiry
                    </>
                )}
            </Button>
        </form>
    );
}
