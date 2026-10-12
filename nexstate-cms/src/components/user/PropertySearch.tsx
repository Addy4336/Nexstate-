"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";

export function PropertySearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search by location, building, or keywords..."
                        className="pl-9"
                        defaultValue={searchParams.get("query")?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Select
                        defaultValue={searchParams.get("bedrooms") || "all"}
                        onValueChange={(val) => handleFilterChange("bedrooms", val)}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Bedrooms" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Bed</SelectItem>
                            <SelectItem value="0">Studio</SelectItem>
                            <SelectItem value="1">1 Bed</SelectItem>
                            <SelectItem value="2">2 Beds</SelectItem>
                            <SelectItem value="3">3+ Beds</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        defaultValue={searchParams.get("maxPrice") || "all"}
                        onValueChange={(val) => handleFilterChange("maxPrice", val)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Max Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Price</SelectItem>
                            <SelectItem value="5000">AED 5k</SelectItem>
                            <SelectItem value="8000">AED 8k</SelectItem>
                            <SelectItem value="12000">AED 12k</SelectItem>
                            <SelectItem value="20000">AED 20k+</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                        <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
