"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createFaq, updateFaq } from "@/actions/faq-actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface FaqFormProps {
    initialData?: {
        id: string;
        question: string;
        answer: string;
        category: string;
        sort_order: number;
        is_active: boolean;
    };
}

const categories = [
    { value: "general", label: "General" },
    { value: "properties", label: "Properties" },
    { value: "investment", label: "Investment" },
    { value: "buying", label: "Buying" },
    { value: "selling", label: "Selling" },
    { value: "renting", label: "Renting" },
    { value: "legal", label: "Legal" },
    { value: "finance", label: "Finance" },
];

export function FaqForm({ initialData }: FaqFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.set("is_active", isActive.toString());

        try {
            let result;
            if (initialData?.id) {
                result = await updateFaq(initialData.id, formData);
            } else {
                result = await createFaq(formData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "FAQ updated!" : "FAQ created!");
                router.push("/admin/faqs");
            }
        } catch (e: any) {
            console.error("Form error:", e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>FAQ Content</CardTitle>
                    <CardDescription>
                        Enter the question and answer for this FAQ.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Input
                            id="question"
                            name="question"
                            placeholder="e.g. What documents do I need to buy a property?"
                            required
                            defaultValue={initialData?.question}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                            id="answer"
                            name="answer"
                            placeholder="Provide a detailed answer to the question..."
                            className="min-h-[300px] resize-y"
                            required
                            defaultValue={initialData?.answer}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            Markdown supported
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Publishing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={initialData?.category || "general"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min="0"
                                placeholder="0"
                                defaultValue={initialData?.sort_order || 0}
                            />
                            <p className="text-xs text-muted-foreground">
                                FAQs are sorted by this number (lowest first).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="text-base font-medium">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Only active FAQs are visible to users.
                            </p>
                        </div>
                        <Switch
                            id="is_active"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {initialData ? "Update FAQ" : "Publish FAQ"}
                </Button>
            </div>
        </form>
    );
}
