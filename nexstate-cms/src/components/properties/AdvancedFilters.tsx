"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    MapPin,
    SlidersHorizontal,
    X,
    Home,
    DollarSign,
    Users,
    Sofa,
    Sparkles,
    Calendar,
} from "lucide-react";

export interface PropertyFilters {
    location: string;
    radiusKm: number;
    propertyType: string;
    budgetMin: number;
    budgetMax: number;
    sharingType: string;
    furnishing: string;
    genderPreference: string;
    bedrooms: number[];
    bathrooms: number[];
    amenities: string[];
    availableFrom: string;
}

const defaultFilters: PropertyFilters = {
    location: "",
    radiusKm: 5,
    propertyType: "all",
    budgetMin: 0,
    budgetMax: 50000,
    sharingType: "all",
    furnishing: "all",
    genderPreference: "all",
    bedrooms: [],
    bathrooms: [],
    amenities: [],
    availableFrom: "",
};

const propertyTypes = [
    { value: "all", label: "All Types" },
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "studio", label: "Studio" },
    { value: "penthouse", label: "Penthouse" },
    { value: "townhouse", label: "Townhouse" },
    { value: "pg", label: "PG/Hostel" },
];

const sharingTypes = [
    { value: "all", label: "Any" },
    { value: "private", label: "Private" },
    { value: "shared", label: "Shared" },
    { value: "single-room", label: "Single Room" },
];

const furnishingOptions = [
    { value: "all", label: "Any" },
    { value: "fully-furnished", label: "Fully Furnished" },
    { value: "semi-furnished", label: "Semi Furnished" },
    { value: "unfurnished", label: "Unfurnished" },
];

const genderOptions = [
    { value: "all", label: "Any" },
    { value: "male-only", label: "Male Only" },
    { value: "female-only", label: "Female Only" },
    { value: "family", label: "Family" },
];

const amenitiesList = [
    "Swimming Pool",
    "Gym",
    "Parking",
    "Security",
    "Balcony",
    "Garden",
    "Pet Friendly",
    "Maid Room",
    "Study Room",
    "Storage",
    "Concierge",
    "Kids Play Area",
];

interface AdvancedFiltersProps {
    filters: PropertyFilters;
    onFiltersChange: (filters: PropertyFilters) => void;
    onApply?: () => void;
    onReset?: () => void;
}

export function AdvancedFilters({
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const updateFilter = <K extends keyof PropertyFilters>(
        key: K,
        value: PropertyFilters[K]
    ) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const toggleBedroom = (num: number) => {
        const current = filters.bedrooms;
        const updated = current.includes(num)
            ? current.filter((n) => n !== num)
            : [...current, num];
        updateFilter("bedrooms", updated);
    };

    const toggleBathroom = (num: number) => {
        const current = filters.bathrooms;
        const updated = current.includes(num)
            ? current.filter((n) => n !== num)
            : [...current, num];
        updateFilter("bathrooms", updated);
    };

    const toggleAmenity = (amenity: string) => {
        const current = filters.amenities;
        const updated = current.includes(amenity)
            ? current.filter((a) => a !== amenity)
            : [...current, amenity];
        updateFilter("amenities", updated);
    };

    const handleReset = () => {
        onFiltersChange(defaultFilters);
        onReset?.();
    };

    const handleApply = () => {
        onApply?.();
        setIsOpen(false);
    };

    const activeFilterCount = [
        filters.location !== "",
        filters.propertyType !== "all",
        filters.budgetMin > 0 || filters.budgetMax < 50000,
        filters.sharingType !== "all",
        filters.furnishing !== "all",
        filters.genderPreference !== "all",
        filters.bedrooms.length > 0,
        filters.bathrooms.length > 0,
        filters.amenities.length > 0,
        filters.availableFrom !== "",
    ].filter(Boolean).length;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 justify-center">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetDescription>
                        Refine your property search with detailed filters.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    <Accordion type="multiple" defaultValue={["location", "budget", "property"]} className="space-y-4">
                        {/* Location */}
                        <AccordionItem value="location" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label>Area / Neighborhood</Label>
                                    <Input
                                        placeholder="e.g. Downtown Dubai"
                                        value={filters.location}
                                        onChange={(e) => updateFilter("location", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label>Search Radius</Label>
                                        <span className="text-sm text-muted-foreground">
                                            {filters.radiusKm} km
                                        </span>
                                    </div>
                                    <Slider
                                        value={[filters.radiusKm]}
                                        onValueChange={([v]) => updateFilter("radiusKm", v)}
                                        min={1}
                                        max={20}
                                        step={1}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Budget */}
                        <AccordionItem value="budget" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Budget
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Min (AED)</Label>
                                        <Input
                                            type="number"
                                            value={filters.budgetMin}
                                            onChange={(e) => updateFilter("budgetMin", Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max (AED)</Label>
                                        <Input
                                            type="number"
                                            value={filters.budgetMax}
                                            onChange={(e) => updateFilter("budgetMax", Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Property Type */}
                        <AccordionItem value="property" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Property Type
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <Select
                                    value={filters.propertyType}
                                    onValueChange={(v) => updateFilter("propertyType", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="space-y-2">
                                    <Label>Bedrooms</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((num) => (
                                            <Button
                                                key={num}
                                                variant={filters.bedrooms.includes(num) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => toggleBedroom(num)}
                                            >
                                                {num === 0 ? "Studio" : num === 5 ? "5+" : num}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Bathrooms</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <Button
                                                key={num}
                                                variant={filters.bathrooms.includes(num) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => toggleBathroom(num)}
                                            >
                                                {num === 5 ? "5+" : num}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Sharing & Preferences */}
                        <AccordionItem value="sharing" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Sharing & Preferences
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label>Sharing Type</Label>
                                    <Select
                                        value={filters.sharingType}
                                        onValueChange={(v) => updateFilter("sharingType", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sharingTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender Preference</Label>
                                    <Select
                                        value={filters.genderPreference}
                                        onValueChange={(v) => updateFilter("genderPreference", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {genderOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Furnishing */}
                        <AccordionItem value="furnishing" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Sofa className="w-4 h-4" />
                                    Furnishing
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <Select
                                    value={filters.furnishing}
                                    onValueChange={(v) => updateFilter("furnishing", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {furnishingOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Amenities */}
                        <AccordionItem value="amenities" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Amenities
                                    {filters.amenities.length > 0 && (
                                        <Badge variant="secondary" className="ml-2">
                                            {filters.amenities.length}
                                        </Badge>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    {amenitiesList.map((amenity) => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={amenity}
                                                checked={filters.amenities.includes(amenity)}
                                                onCheckedChange={() => toggleAmenity(amenity)}
                                            />
                                            <label
                                                htmlFor={amenity}
                                                className="text-sm cursor-pointer"
                                            >
                                                {amenity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Availability */}
                        <AccordionItem value="availability" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Availability
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <div className="space-y-2">
                                    <Label>Available From</Label>
                                    <Input
                                        type="date"
                                        value={filters.availableFrom}
                                        onChange={(e) => updateFilter("availableFrom", e.target.value)}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <SheetFooter className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button onClick={handleApply} className="flex-1 btn-primary">
                        Apply Filters
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

// Export default filters for use elsewhere
export { defaultFilters };
