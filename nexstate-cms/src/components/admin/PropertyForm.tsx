"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { VideoUpload } from "./VideoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProperty, updateProperty } from "@/actions/property-actions";
import { Loader2, Save, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROPERTY_AMENITIES } from "@/types/property";
import { Badge } from "@/components/ui/badge";

interface PropertyFormProps {
    initialData?: any; // Define proper type if available
}

export function PropertyForm({ initialData }: PropertyFormProps) {
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [videoUrl, setVideoUrl] = useState<string | null>(initialData?.property_video || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [descriptionText, setDescriptionText] = useState(initialData?.description || "");
    const [locationText, setLocationText] = useState(initialData?.location || "");
    const [bedroomsVal, setBedroomsVal] = useState(initialData?.bedrooms || 2);
    const router = useRouter();

    const handleAIGenerate = async () => {
        if (!title.trim()) {
            toast.error("Please enter a property title first to generate copy.");
            return;
        }
        setIsGeneratingAI(true);
        try {
            const res = await fetch("/api/ai/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    location: locationText || "Dubai",
                    bedrooms: Number(bedroomsVal),
                    amenities: selectedAmenities,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setDescriptionText(data.description);
                toast.success("AI description generated successfully!");
            }
        } catch {
            toast.error("Failed to generate AI description.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.set("images", images.join(","));
        
        // Add video URL to form data
        if (videoUrl) {
            formData.set("property_video", videoUrl);
        }
        formData.set("amenities", selectedAmenities.join(","));

        try {
            let result;
            if (initialData?.id) {
                result = await updateProperty(initialData.id, formData);
            } else {
                result = await createProperty(formData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "Property updated!" : "Property created!");
                router.push("/admin/properties");
            }
        } catch (e: any) {
            console.error("Form error:", e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Luxury Apartment in Marina"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Also used to group this property's uploaded media.
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="description">Description</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAIGenerate}
                            disabled={isGeneratingAI}
                            className="text-xs border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
                        >
                            {isGeneratingAI ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                            )}
                            Auto-Generate via AI Copilot
                        </Button>
                    </div>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed description of the property..."
                        className="h-32"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price (Monthly Rent AED)</Label>
                    <Input id="price" name="price" type="number" step="0.01" required defaultValue={initialData?.price} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g. Dubai Marina" required defaultValue={initialData?.location} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" name="bedrooms" type="number" min="0" required defaultValue={initialData?.bedrooms} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" name="bathrooms" type="number" min="0" required defaultValue={initialData?.bathrooms} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sqft)</Label>
                    <Input id="area_sqft" name="area_sqft" type="number" min="0" required defaultValue={initialData?.area_sqft} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={initialData?.status || "available"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Additional Fees Section */}
                <div className="md:col-span-2 mt-4 mb-2">
                    <h3 className="text-lg font-medium">Additional Fees</h3>
                    <p className="text-sm text-muted-foreground">Detailed breakdown of extra charges</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="vat">VAT (%)</Label>
                    <Input id="vat" name="vat" type="number" step="0.01" min="0" defaultValue={initialData?.vat || 5} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="booking_fee">Booking Fee (AED)</Label>
                    <Input id="booking_fee" name="booking_fee" type="number" step="0.01" min="0" defaultValue={initialData?.booking_fee} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="exit_cleaning_fee">Exit Cleaning & Restocking Fee (AED)</Label>
                    <Input id="exit_cleaning_fee" name="exit_cleaning_fee" type="number" step="0.01" min="0" defaultValue={initialData?.exit_cleaning_fee} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tourism_fee">Tourism Fee (AED)</Label>
                    <Input id="tourism_fee" name="tourism_fee" type="number" step="0.01" min="0" defaultValue={initialData?.tourism_fee} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="security_deposit">Refundable Security Deposit (AED)</Label>
                    <Input id="security_deposit" name="security_deposit" type="number" step="0.01" min="0" defaultValue={initialData?.security_deposit} />
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                    <Switch id="featured" name="featured" defaultChecked={initialData?.featured} />
                    <Label htmlFor="featured">Featured Property</Label>
                </div>

                {/* Amenities Section */}
                <div className="space-y-3 md:col-span-2">
                    <Label>Amenities</Label>
                    <p className="text-xs text-muted-foreground">
                        Select the amenities available at this property
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {PROPERTY_AMENITIES.map((amenity) => {
                            const isSelected = selectedAmenities.includes(amenity);
                            return (
                                <Badge
                                    key={amenity}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`cursor-pointer transition-all ${isSelected
                                        ? "hover:bg-primary/90"
                                        : "hover:bg-muted"
                                        }`}
                                    onClick={() => toggleAmenity(amenity)}
                                >
                                    {isSelected && <Check className="w-3 h-3 mr-1" />}
                                    {amenity}
                                </Badge>
                            );
                        })}
                    </div>
                    {selectedAmenities.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {selectedAmenities.length} amenities selected
                        </p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <ImageUpload
                        onImagesChange={setImages}
                        defaultImages={initialData?.images}
                        folderName={title}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <VideoUpload
                        onVideoChange={setVideoUrl}
                        defaultVideo={initialData?.property_video}
                        folderName={title}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {initialData ? "Update Property" : "Create Property"}
                </Button>
            </div>
        </form>
    );
}
