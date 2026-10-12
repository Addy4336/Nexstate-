"use client";

import { useState, useMemo } from "react";
import {
    Home,
    Wallet,
    TrendingDown,
    Clock,
    Zap,
    Car,
    Wrench,
    Shield,
    Info,
    Check,
    ChevronRight,
    ArrowRight,
    Coins,
    Sparkles
} from "lucide-react";

// --- Types & Logic ---

interface TenantCostInputs {
    monthlyRent: number;
    stayDurationMonths: number;
    securityDeposit: number;
    monthlyMaintenance: number;
    monthlyUtilities: number;
    monthlyParking: number;
    moveInCosts: number;
    brokerageFee: number;
}

interface TenantCostResults {
    totalRentCost: number;
    monthlyAllInCost: number;
    totalStayCost: number;
    averageMonthlyCost: number;
    upfrontCosts: number;
    totalRecurringCosts: number;
    effectiveMonthlyRent: number;
    costBreakdown: {
        rent: number;
        maintenance: number;
        utilities: number;
        parking: number;
        deposit: number;
        moveIn: number;
        brokerage: number;
    };
    durationComparison: {
        months: number;
        totalCost: number;
        avgMonthlyCost: number;
    }[];
}

function calculateTenantCosts(inputs: TenantCostInputs): TenantCostResults {
    const {
        monthlyRent,
        stayDurationMonths,
        securityDeposit,
        monthlyMaintenance,
        monthlyUtilities,
        monthlyParking,
        moveInCosts,
        brokerageFee,
    } = inputs;

    // Monthly recurring costs
    const monthlyAllInCost = monthlyRent + monthlyMaintenance + monthlyUtilities + monthlyParking;

    // Total rent over stay duration
    const totalRentCost = monthlyRent * stayDurationMonths;

    // Total recurring costs
    const totalRecurringCosts = monthlyAllInCost * stayDurationMonths;

    // Upfront costs (one-time)
    const upfrontCosts = securityDeposit + moveInCosts + brokerageFee;

    // Total stay cost
    const totalStayCost = totalRecurringCosts + upfrontCosts;

    // Average monthly cost (spreading upfront costs)
    const averageMonthlyCost = stayDurationMonths > 0 ? totalStayCost / stayDurationMonths : 0;

    // Effective monthly rent (including all costs spread over duration)
    const effectiveMonthlyRent = averageMonthlyCost;

    // Cost breakdown
    const costBreakdown = {
        rent: totalRentCost,
        maintenance: monthlyMaintenance * stayDurationMonths,
        utilities: monthlyUtilities * stayDurationMonths,
        parking: monthlyParking * stayDurationMonths,
        deposit: securityDeposit,
        moveIn: moveInCosts,
        brokerage: brokerageFee,
    };

    // Duration comparison (6, 12, 24, 36 months)
    const durations = [6, 12, 24, 36];
    const durationComparison = durations.map((months) => {
        const total = monthlyAllInCost * months + upfrontCosts;
        return {
            months,
            totalCost: total,
            avgMonthlyCost: total / months,
        };
    });

    return {
        totalRentCost,
        monthlyAllInCost,
        totalStayCost,
        averageMonthlyCost,
        upfrontCosts,
        totalRecurringCosts,
        effectiveMonthlyRent,
        costBreakdown,
        durationComparison,
    };
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

const defaultInputs: TenantCostInputs = {
    monthlyRent: 5000,
    stayDurationMonths: 12,
    securityDeposit: 5000,
    monthlyMaintenance: 500,
    monthlyUtilities: 400,
    monthlyParking: 300,
    moveInCosts: 1000,
    brokerageFee: 2500,
};

// --- Components ---

function InputGroup({
    label,
    value,
    onChange,
    icon: Icon,
    dark = false,
    className = ""
}: {
    label: string,
    value: number,
    onChange: (val: number) => void,
    icon?: any,
    dark?: boolean,
    className?: string
}) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className={`text-[10px] md:text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </label>
            <div className="relative group">
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`flex h-11 w-full rounded-xl border px-3 py-2 text-sm font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all 
                    ${dark
                            ? 'bg-white/10 border-white/10 text-white placeholder:text-white/40 hover:bg-white/20 focus-visible:ring-white/50'
                            : 'bg-muted/30 border-transparent text-foreground placeholder:text-muted-foreground hover:bg-muted focus-visible:ring-primary/50'
                        }`}
                />
            </div>
        </div>
    );
}

export default function TenantCostCalculator() {
    const [inputs, setInputs] = useState<TenantCostInputs>(defaultInputs);
    const results = useMemo(() => calculateTenantCosts(inputs), [inputs]);

    const updateInput = (key: keyof TenantCostInputs, value: number) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    const getSavingsVs6Month = () => {
        const sixMonthAvg = results.durationComparison.find((d) => d.months === 6)?.avgMonthlyCost || 0;
        return sixMonthAvg - results.averageMonthlyCost;
    };

    const savings = getSavingsVs6Month();

    return (
        <section className="py-6 bg-background relative overflow-hidden">

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="text-center space-y-3 mb-8 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
                        Calculate the <span className="text-primary italic">Real</span> Rent
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg font-light">
                        Don't get blindsided by hidden fees. See exactly what you'll pay every month.
                    </p>
                </div>

                {/* THE UNIFIED WIDGET */}
                <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl lg:rounded-[2rem] shadow-xl overflow-hidden border border-border/50 flex flex-col lg:flex-row">

                    {/* LEFT PANEL: INPUTS RE-IMAGINED (65%) */}
                    <div className="flex-[1.5] p-4 md:p-8 flex flex-col gap-3 md:gap-6">

                        {/* 1. HERO RENT INPUT */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">1</span>
                                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Monthly Rent</label>
                            </div>
                            <div className="relative max-w-sm">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground/30">AED</span>
                                <input
                                    type="number"
                                    value={inputs.monthlyRent}
                                    onChange={(e) => updateInput("monthlyRent", Number(e.target.value))}
                                    className="w-full h-10 md:h-12 pl-14 pr-4 bg-muted/30 rounded-xl text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-muted/50 transition-all border border-transparent hover:border-border"
                                />
                            </div>
                        </div>

                        {/* 2. DURATION SELECTION */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">2</span>
                                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Select Lease Duration</label>
                            </div>

                            {/* Preset Duration Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6">
                                {results.durationComparison.map((item) => (
                                    <button
                                        key={item.months}
                                        onClick={() => updateInput("stayDurationMonths", item.months)}
                                        className={`relative p-3 rounded-2xl border text-left transition-all duration-200 group ${inputs.stayDurationMonths === item.months
                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]'
                                            : 'bg-white hover:bg-muted/50 border-input hover:border-primary/30'
                                            }`}
                                    >
                                        <div className="text-xs font-medium opacity-80 mb-1">{item.months} Months</div>
                                        <div className="font-bold text-lg md:text-xl tracking-tight leading-none">
                                            {formatCurrency(item.avgMonthlyCost)}
                                        </div>
                                        <div className="text-[10px] opacity-60 mt-1">/mo effective</div>

                                        {/* Most Popular / Best Value Badges */}
                                        {item.months === 12 && (
                                            <span className={`absolute -top-2 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shadow-sm ${inputs.stayDurationMonths === 12 ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                                Popular
                                            </span>
                                        )}
                                        {item.months === 36 && (
                                            <span className={`absolute -top-2 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shadow-sm ${inputs.stayDurationMonths === 36 ? 'bg-white text-green-600' : 'bg-green-600 text-white'}`}>
                                                Best Value
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Duration Slider - Clean & Minimal */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Or choose custom duration</span>
                                    <span className="text-lg font-bold text-foreground">
                                        {inputs.stayDurationMonths} <span className="text-sm font-normal text-muted-foreground">months</span>
                                    </span>
                                </div>

                                {/* Slider with Primary Fill */}
                                <div className="relative h-2">
                                    {/* Background Track */}
                                    <div className="absolute inset-0 bg-muted rounded-full" />

                                    {/* Primary Color Fill */}
                                    <div
                                        className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-100"
                                        style={{ width: `${((inputs.stayDurationMonths - 1) / 47) * 100}%` }}
                                    />

                                    {/* Range Input */}
                                    <input
                                        type="range"
                                        min={1}
                                        max={48}
                                        step={1}
                                        value={inputs.stayDurationMonths}
                                        onChange={(e) => updateInput("stayDurationMonths", Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer
                                            [&::-webkit-slider-thumb]:appearance-none 
                                            [&::-webkit-slider-thumb]:w-5 
                                            [&::-webkit-slider-thumb]:h-5 
                                            [&::-webkit-slider-thumb]:bg-primary 
                                            [&::-webkit-slider-thumb]:rounded-full 
                                            [&::-webkit-slider-thumb]:cursor-grab
                                            [&::-webkit-slider-thumb]:shadow-lg
                                            [&::-webkit-slider-thumb]:border-2
                                            [&::-webkit-slider-thumb]:border-white
                                            [&::-webkit-slider-thumb]:hover:scale-110
                                            [&::-webkit-slider-thumb]:transition-transform
                                            [&::-moz-range-thumb]:w-5 
                                            [&::-moz-range-thumb]:h-5 
                                            [&::-moz-range-thumb]:bg-primary 
                                            [&::-moz-range-thumb]:rounded-full 
                                            [&::-moz-range-thumb]:cursor-grab
                                            [&::-moz-range-thumb]:border-2
                                            [&::-moz-range-thumb]:border-white
                                            [&::-moz-range-track]:bg-transparent
                                            [&::-webkit-slider-runnable-track]:bg-transparent"
                                    />
                                </div>

                                {/* Month Labels */}
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1 month</span>
                                    <span>48 months</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border/40 w-full" />

                        {/* 3. ADDITIONAL COSTS GRID */}
                        <div className="grid grid-cols-2 gap-3 md:gap-12">
                            {/* Hidden Costs */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 font-bold text-[10px]">3</span>
                                    <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Hidden Fees</label>
                                </div>
                                <div className="space-y-2">
                                    <InputGroup
                                        label="Security Deposit"
                                        value={inputs.securityDeposit}
                                        onChange={(v) => updateInput("securityDeposit", v)}
                                        icon={Shield}
                                        className="scale-95 origin-left"
                                    />
                                    <InputGroup
                                        label="Brokerage Fee"
                                        value={inputs.brokerageFee}
                                        onChange={(v) => updateInput("brokerageFee", v)}
                                        icon={Wallet}
                                        className="scale-95 origin-left"
                                    />
                                    <InputGroup
                                        label="Move-in Costs"
                                        value={inputs.moveInCosts}
                                        onChange={(v) => updateInput("moveInCosts", v)}
                                        icon={Car}
                                        className="scale-95 origin-left"
                                    />
                                </div>
                            </div>

                            {/* Monthly Extras */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">4</span>
                                    <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Monthly Extras</label>
                                </div>
                                <div className="space-y-3">
                                    <InputGroup
                                        label="Utilities (DEWA)"
                                        value={inputs.monthlyUtilities}
                                        onChange={(v) => updateInput("monthlyUtilities", v)}
                                        icon={Zap}
                                    />
                                    <InputGroup
                                        label="Maintenance"
                                        value={inputs.monthlyMaintenance}
                                        onChange={(v) => updateInput("monthlyMaintenance", v)}
                                        icon={Wrench}
                                    />
                                    <InputGroup
                                        label="Parking"
                                        value={inputs.monthlyParking}
                                        onChange={(v) => updateInput("monthlyParking", v)}
                                        icon={Car}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT PANEL: RESULTS (35%) - DARK THEME - UNCHANGED */}
                    <div className="flex-1 bg-[#0A0A0A] text-white p-5 md:p-8 flex flex-col justify-between relative overflow-hidden">

                        {/* Decorative Gradient Blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-medium text-white/80 mb-4">
                                    <Clock className="w-3 h-3" />
                                    {inputs.stayDurationMonths} Month Lease
                                </div>
                                <h3 className="text-white/60 font-medium text-base mb-1">Effective Monthly Cost</h3>
                                <div className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-1">
                                    {formatCurrency(results.averageMonthlyCost)}
                                </div>
                                <p className="text-sm text-white/40">Includes all fees amortized over the lease.</p>
                            </div>

                            {/* Comparison Card (Integrated) */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">Total Payment</div>
                                        <div className="text-2xl font-bold text-white">{formatCurrency(results.totalStayCost)}</div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">Upfront Cash</div>
                                        <div className="text-xl font-bold text-primary">{formatCurrency(results.upfrontCosts)}</div>
                                    </div>
                                </div>

                                {savings > 0 && inputs.stayDurationMonths > 6 && (
                                    <div className="pt-4 mt-4 border-t border-white/10 flex items-start gap-3">
                                        <div className="bg-green-500/20 p-1.5 rounded-full text-green-400 mt-0.5">
                                            <TrendingDown className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm text-white/80 leading-snug">
                                            Saving <span className="text-green-400 font-bold">{formatCurrency(savings)}/mo</span> vs 6-month lease.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Compact Breakdown */}
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Cost Breakdown</p>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Rent</span>
                                        <span className="font-medium text-white">{formatCurrency(results.costBreakdown.rent)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Recurring Extras</span>
                                        <span className="font-medium text-white">{formatCurrency(results.costBreakdown.maintenance + results.costBreakdown.utilities + results.costBreakdown.parking)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">One-time Fees</span>
                                        <span className="font-medium text-white">{formatCurrency(results.costBreakdown.brokerage + results.costBreakdown.moveIn)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-400/80">Refundable Deposit</span>
                                        <span className="font-medium text-emerald-400">{formatCurrency(results.costBreakdown.deposit)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA / Footer of Card */}
                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                            <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group text-sm">
                                Find Properties matching Budget
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
