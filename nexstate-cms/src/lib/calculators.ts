/**
 * ROI Calculator Utility Functions
 * For both property owners and tenants
 */

// ==================== OWNER CALCULATIONS ====================

export interface OwnerROIInputs {
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

export interface OwnerROIResults {
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

export function calculateOwnerROI(inputs: OwnerROIInputs): OwnerROIResults {
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

// ==================== TENANT CALCULATIONS ====================

export interface TenantCostInputs {
    monthlyRent: number;
    stayDurationMonths: number;
    securityDeposit: number;
    monthlyMaintenance: number;
    monthlyUtilities: number;
    monthlyParking: number;
    moveInCosts: number;
    brokerageFee: number;
}

export interface TenantCostResults {
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

export function calculateTenantCosts(inputs: TenantCostInputs): TenantCostResults {
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

// ==================== UTILITY FUNCTIONS ====================

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
}

export function formatYears(years: number): string {
    if (years === Infinity) return "N/A";
    if (years < 1) return `${Math.round(years * 12)} months`;
    return `${years.toFixed(1)} years`;
}
