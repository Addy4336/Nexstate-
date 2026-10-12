"use client";

import { useState, useMemo } from "react";
import {
    Home,
    Wallet,
    TrendingUp,
    TrendingDown,
    Building,
    Calculator,
    Percent,
    DollarSign,
    PiggyBank,
    ArrowRight,
    PieChart,
    Activity
} from "lucide-react";

// --- Types & Logic ---

interface OwnerROIInputs {
    purchasePrice: number;
    monthlyRent: number;
    occupancyRate: number; // Percentage (0-100)
    serviceFeePercent: number; // Percentage of rent
    annualMaintenance: number;
    annualInsurance: number;
    annualPropertyTax: number;
    monthlyMortgage: number;
    downPayment: number;
    otherAnnualExpenses: number;
}

interface OwnerROIResults {
    grossAnnualIncome: number;
    effectiveGrossIncome: number;
    totalAnnualExpenses: number;
    netOperatingIncome: number;
    cashFlow: number;
    capRate: number;
    cashOnCashReturn: number;
    breakEvenOccupancy: number;
    monthlyNetIncome: number;
    paybackPeriodYears: number;
}

function calculateOwnerROI(inputs: OwnerROIInputs): OwnerROIResults {
    const {
        purchasePrice,
        monthlyRent,
        occupancyRate,
        serviceFeePercent,
        annualMaintenance,
        annualInsurance,
        annualPropertyTax,
        monthlyMortgage,
        downPayment,
        otherAnnualExpenses,
    } = inputs;

    // Gross Annual Income (100% occupancy)
    const grossAnnualIncome = monthlyRent * 12;

    // Effective Gross Income (with occupancy rate)
    const effectiveGrossIncome = grossAnnualIncome * (occupancyRate / 100);

    // Service Fee
    const annualServiceFee = effectiveGrossIncome * (serviceFeePercent / 100);

    // Total Annual Expenses
    const totalAnnualExpenses =
        annualServiceFee +
        annualMaintenance +
        annualInsurance +
        annualPropertyTax +
        otherAnnualExpenses;

    // Net Operating Income (NOI)
    const netOperatingIncome = effectiveGrossIncome - totalAnnualExpenses;

    // Annual Mortgage Payments
    const annualMortgage = monthlyMortgage * 12;

    // Cash Flow (after mortgage)
    const cashFlow = netOperatingIncome - annualMortgage;

    // Cap Rate (NOI / Purchase Price)
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;

    // Cash-on-Cash Return (Cash Flow / Down Payment)
    const cashOnCashReturn = downPayment > 0 ? (cashFlow / downPayment) * 100 : 0;

    // Break-even Occupancy
    const breakEvenOccupancy =
        grossAnnualIncome > 0 ? ((totalAnnualExpenses + annualMortgage) / grossAnnualIncome) * 100 : 0;

    // Monthly Net Income
    const monthlyNetIncome = cashFlow / 12;

    // Payback Period (years to recover down payment)
    const paybackPeriodYears = cashFlow > 0 ? downPayment / cashFlow : Infinity;

    return {
        grossAnnualIncome,
        effectiveGrossIncome,
        totalAnnualExpenses,
        netOperatingIncome,
        cashFlow,
        capRate,
        cashOnCashReturn,
        breakEvenOccupancy,
        monthlyNetIncome,
        paybackPeriodYears,
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

function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
}

const defaultInputs: OwnerROIInputs = {
    purchasePrice: 1500000,
    monthlyRent: 8000,
    occupancyRate: 85,
    serviceFeePercent: 5,
    annualMaintenance: 15000,
    annualInsurance: 5000,
    annualPropertyTax: 0,
    monthlyMortgage: 0,
    downPayment: 375000,
    otherAnnualExpenses: 5000,
};

// --- Components ---

function InputGroup({
    label,
    value,
    onChange,
    icon: Icon,
    dark = false,
    className = "",
    min,
    max,
    step,
    type = "number",
    suffix
}: {
    label: string,
    value: number,
    onChange: (val: number) => void,
    icon?: any,
    dark?: boolean,
    className?: string,
    min?: number,
    max?: number,
    step?: number,
    type?: "number" | "range",
    suffix?: string
}) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className={`text-[10px] md:text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </label>
            <div className="relative group">
                {type === 'range' ? (
                    <div className={`group/slider relative flex h-14 w-full rounded-2xl border px-5 items-center gap-5 transition-all duration-300 ${dark
                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        : 'bg-white border-border/50 text-foreground shadow-sm hover:border-primary/30 hover:shadow-md'
                        }`}>

                        <div className="flex flex-col items-end min-w-[3.5rem]">
                            <span className="text-lg font-bold tracking-tight text-primary">
                                {value}{suffix}
                            </span>
                        </div>

                        <div className="relative w-full h-full flex items-center">
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={value}
                                onChange={(e) => onChange(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none z-10 relative bg-transparent"
                                style={{
                                    backgroundImage: `linear-gradient(90deg, var(--primary) ${((value - (min || 0)) / ((max || 100) - (min || 0))) * 100}%, transparent ${((value - (min || 0)) / ((max || 100) - (min || 0))) * 100}%)`
                                }}
                            />
                            {/* Custom Track Background (Gray Part) */}
                            <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-muted/40 rounded-full z-0 overflow-hidden pointer-events-none"></div>
                        </div>

                        <style jsx>{`
                            input[type=range]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                height: 24px;
                                width: 24px;
                                border-radius: 50%;
                                background: white;
                                border: 4px solid var(--primary); /* Primary Ring */
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                cursor: grab;
                                transition: transform 0.1s ease;
                                margin-top: -2px; /* Center alignment adjustment if needed */
                            }
                            input[type=range]::-webkit-slider-thumb:hover {
                                transform: scale(1.1);
                            }
                            input[type=range]::-webkit-slider-thumb:active {
                                cursor: grabbing;
                                transform: scale(0.95);
                                box-shadow: 0 0 0 4px var(--primary-light, rgba(0,0,0,0.1));
                            }
                            input[type=range]::-moz-range-thumb {
                                height: 24px;
                                width: 24px;
                                border-radius: 50%;
                                background: white;
                                border: 4px solid var(--primary);
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                cursor: grab;
                                border: none;
                            }
                        `}</style>
                    </div>
                ) : (
                    <>
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className={`flex h-12 w-full rounded-2xl border px-4 py-2 text-base font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all 
                            ${dark
                                    ? 'bg-white/10 border-white/10 text-white placeholder:text-white/40 hover:bg-white/20 focus-visible:ring-white/50'
                                    : 'bg-muted/30 border-transparent text-foreground placeholder:text-muted-foreground hover:bg-muted focus-visible:ring-primary/50'
                                }`}
                        />
                        {suffix && (
                            <div className={`absolute right-4 top-3.5 text-xs font-medium pointer-events-none ${dark ? 'text-white/40' : 'text-muted-foreground/60'}`}>
                                {suffix}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function OwnerROICalculator() {
    const [inputs, setInputs] = useState<OwnerROIInputs>(defaultInputs);
    const results = useMemo(() => calculateOwnerROI(inputs), [inputs]);

    const updateInput = (key: keyof OwnerROIInputs, value: number) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    const getROIStatus = (capRate: number) => {
        if (capRate >= 8) return { label: "Excellent", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        if (capRate >= 6) return { label: "Good", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
        if (capRate >= 4) return { label: "Fair", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
        return { label: "Low", color: "text-red-400 bg-red-500/10 border-red-500/20" };
    };

    const roiStatus = getROIStatus(results.capRate);

    return (
        <section className="py-6 bg-background relative overflow-hidden">

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="text-center space-y-3 mb-8 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
                        Project Your <span className="text-primary italic">Returns</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg font-light">
                        Use our advanced ROI calculator to estimate cash flow, cap rates, and long-term profitability.
                    </p>
                </div>

                {/* THE UNIFIED WIDGET */}
                <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl lg:rounded-[2rem] shadow-xl overflow-hidden border border-border/50 flex flex-col lg:flex-row">

                    {/* LEFT PANEL: INPUTS (65%) */}
                    <div className="flex-[1.5] p-4 md:p-8 flex flex-col gap-4 md:gap-8">

                        {/* 1. PROPERTY BASICS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">1</span>
                                <h3 className="text-base md:text-lg font-semibold">Property Basics</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Purchase Price"
                                    value={inputs.purchasePrice}
                                    onChange={(v) => updateInput("purchasePrice", v)}
                                    icon={Building}
                                    suffix="AED"
                                />
                                <InputGroup
                                    label="Monthly Rental Income"
                                    value={inputs.monthlyRent}
                                    onChange={(v) => updateInput("monthlyRent", v)}
                                    icon={Home}
                                    suffix="AED"
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Occupancy Rate"
                                    value={inputs.occupancyRate}
                                    onChange={(v) => updateInput("occupancyRate", v)}
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    suffix="%"
                                    icon={Activity}
                                />
                                <InputGroup
                                    label="Service Fee %"
                                    value={inputs.serviceFeePercent}
                                    onChange={(v) => updateInput("serviceFeePercent", v)}
                                    type="range"
                                    min={0}
                                    max={20}
                                    step={0.5}
                                    suffix="%"
                                    icon={PieChart}
                                />
                            </div>
                        </div>

                        <div className="h-px bg-border/40 w-full" />

                        {/* 2. EXPENSES */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-600 font-bold text-xs shrink-0">2</span>
                                <h3 className="text-base md:text-lg font-semibold">Annual Expenses</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                <InputGroup
                                    label="Maintenance"
                                    value={inputs.annualMaintenance}
                                    onChange={(v) => updateInput("annualMaintenance", v)}
                                    suffix="AED"
                                />
                                <InputGroup
                                    label="Insurance"
                                    value={inputs.annualInsurance}
                                    onChange={(v) => updateInput("annualInsurance", v)}
                                    suffix="AED"
                                />
                                <InputGroup
                                    label="Other/Misc"
                                    value={inputs.otherAnnualExpenses}
                                    onChange={(v) => updateInput("otherAnnualExpenses", v)}
                                    suffix="AED"
                                />
                            </div>
                        </div>

                        <div className="h-px bg-border/40 w-full" />

                        {/* 3. FINANCING */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs shrink-0">3</span>
                                <h3 className="text-base md:text-lg font-semibold">Financing (Optional)</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Down Payment"
                                    value={inputs.downPayment}
                                    onChange={(v) => updateInput("downPayment", v)}
                                    icon={PiggyBank}
                                    suffix="AED"
                                />
                                <InputGroup
                                    label="Monthly Mortgage"
                                    value={inputs.monthlyMortgage}
                                    onChange={(v) => updateInput("monthlyMortgage", v)}
                                    icon={Wallet}
                                    suffix="AED"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: RESULTS (35%) - DARK THEME */}
                    <div className="flex-1 bg-[#0A0A0A] text-white p-5 md:p-8 flex flex-col justify-between relative overflow-hidden">

                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-4 ${roiStatus.color}`}>
                                    {roiStatus.label} Investment
                                </div>
                                <h3 className="text-white/60 font-medium text-base mb-1">Cap Rate</h3>
                                <div className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-1">
                                    {formatPercent(results.capRate)}
                                </div>
                                <p className="text-sm text-white/40 max-w-xs">
                                    The rate of return on a real estate investment property based on the income that the property is expected to generate.
                                </p>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Annual Cash Flow</div>
                                    <div className={`text-2xl font-bold ${results.cashFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {formatCurrency(results.cashFlow)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Cash on Cash</div>
                                    <div className="text-2xl font-bold text-primary">
                                        {formatPercent(results.cashOnCashReturn)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Net Income (mo)</div>
                                    <div className="text-xl font-bold text-white">
                                        {formatCurrency(results.monthlyNetIncome)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Break-even Occ.</div>
                                    <div className={`text-xl font-bold ${results.breakEvenOccupancy > 100 ? "text-red-400" : "text-white"}`}>
                                        {formatPercent(results.breakEvenOccupancy)}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Gross Income</span>
                                    <span className="font-medium text-white">{formatCurrency(results.effectiveGrossIncome)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Total Expenses</span>
                                    <span className="font-medium text-red-300">-{formatCurrency(results.totalAnnualExpenses)}</span>
                                </div>
                                {inputs.monthlyMortgage > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Mortgage (Yr)</span>
                                        <span className="font-medium text-red-300">-{formatCurrency(inputs.monthlyMortgage * 12)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="relative z-10 mt-6 md:mt-8">
                            <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group shadow-xl shadow-primary/20 text-sm">
                                View High Yield Properties
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
