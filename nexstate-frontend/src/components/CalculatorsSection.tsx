"use client";

import { useState } from "react";
import TenantCostCalculator from "@/components/tenants/TenantCostCalculator";
import OwnerROICalculator from "@/components/owner/OwnerROICalculator";

export default function CalculatorsSection() {
    const [activeTab, setActiveTab] = useState<'tenant' | 'owner'>('tenant');

    return (
        <section className="py-8 bg-background relative" id="calculator">

            {/* Tab Switcher (Centered in Container) */}
            <div className="container px-4 mx-auto relative z-20 mb-[-40px]">
                <div className="flex justify-center">
                    <div className="inline-flex items-center bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md shadow-lg z-20">
                        <button
                            onClick={() => setActiveTab('tenant')}
                            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'tenant'
                                ? 'bg-secondary text-secondary-foreground shadow-md scale-100'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/10'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                🏠 True Cost Calculator
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('owner')}
                            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'owner'
                                ? 'bg-secondary text-secondary-foreground shadow-md shadow-secondary/20 scale-100'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/10'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                💼 ROI Calculator
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area (Full Width - Responsive Height) */}
            <div className="relative min-h-[600px] pt-10">
                {activeTab === 'tenant' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-forwards">
                        <TenantCostCalculator />
                    </div>
                )}

                {activeTab === 'owner' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-forwards">
                        <OwnerROICalculator />
                    </div>
                )}
            </div>
        </section>
    );
}
