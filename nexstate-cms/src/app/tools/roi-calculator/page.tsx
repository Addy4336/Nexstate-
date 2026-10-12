import { brand } from "@nexstate/brand";
import { OwnerROICalculator } from "@/components/calculators/OwnerROICalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `ROI Calculator for Property Owners | ${brand.name}`,
    description: "Calculate your rental property returns based on rent, occupancy, expenses, and financing. Free investment analysis tool.",
};

export default function ROICalculatorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto px-4 py-12">
                <OwnerROICalculator />
            </div>
        </div>
    );
}
