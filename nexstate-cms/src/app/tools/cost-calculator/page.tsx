import { brand } from "@nexstate/brand";
import { TenantCostCalculator } from "@/components/calculators/TenantCostCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Rental Cost Calculator for Tenants | ${brand.name}`,
    description: "Compare total rental costs across different stay durations. Calculate your complete cost breakdown including rent, utilities, and fees.",
};

export default function CostCalculatorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto px-4 py-12">
                <TenantCostCalculator />
            </div>
        </div>
    );
}
