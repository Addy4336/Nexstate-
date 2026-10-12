"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    calculateOwnerROI,
    formatCurrency,
    formatPercent,
    formatYears,
    type OwnerROIInputs,
} from "@/lib/calculators";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Percent,
    Home,
    Calculator,
    PiggyBank,
    Clock,
    Building,
} from "lucide-react";

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

export function OwnerROICalculator() {
    const [inputs, setInputs] = useState<OwnerROIInputs>(defaultInputs);

    const results = useMemo(() => calculateOwnerROI(inputs), [inputs]);

    const updateInput = (key: keyof OwnerROIInputs, value: number) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    const getROIStatus = (capRate: number) => {
        if (capRate >= 8) return { label: "Excellent", color: "bg-green-500" };
        if (capRate >= 6) return { label: "Good", color: "bg-emerald-500" };
        if (capRate >= 4) return { label: "Fair", color: "bg-amber-500" };
        return { label: "Low", color: "bg-red-500" };
    };

    const roiStatus = getROIStatus(results.capRate);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4">
                    <Calculator className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Owner ROI Calculator</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Estimate your rental property returns based on rent, occupancy, expenses, and financing.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Inputs Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Property Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                Property Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Purchase Price (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.purchasePrice}
                                    onChange={(e) => updateInput("purchasePrice", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Monthly Rent (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.monthlyRent}
                                    onChange={(e) => updateInput("monthlyRent", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <div className="flex justify-between">
                                    <Label>Expected Occupancy Rate</Label>
                                    <span className="text-sm font-medium">{inputs.occupancyRate}%</span>
                                </div>
                                <Slider
                                    value={[inputs.occupancyRate]}
                                    onValueChange={([v]) => updateInput("occupancyRate", v)}
                                    min={0}
                                    max={100}
                                    step={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Industry average: 80-90%
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operating Expenses */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Operating Expenses (Annual)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Service/Management Fee</Label>
                                    <span className="text-sm font-medium">{inputs.serviceFeePercent}%</span>
                                </div>
                                <Slider
                                    value={[inputs.serviceFeePercent]}
                                    onValueChange={([v]) => updateInput("serviceFeePercent", v)}
                                    min={0}
                                    max={15}
                                    step={0.5}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Maintenance (AED/year)</Label>
                                <Input
                                    type="number"
                                    value={inputs.annualMaintenance}
                                    onChange={(e) => updateInput("annualMaintenance", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Insurance (AED/year)</Label>
                                <Input
                                    type="number"
                                    value={inputs.annualInsurance}
                                    onChange={(e) => updateInput("annualInsurance", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Property Tax (AED/year)</Label>
                                <Input
                                    type="number"
                                    value={inputs.annualPropertyTax}
                                    onChange={(e) => updateInput("annualPropertyTax", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Other Expenses (AED/year)</Label>
                                <Input
                                    type="number"
                                    value={inputs.otherAnnualExpenses}
                                    onChange={(e) => updateInput("otherAnnualExpenses", Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PiggyBank className="w-5 h-5" />
                                Financing Details
                            </CardTitle>
                            <CardDescription>
                                Leave mortgage at 0 for cash purchase calculations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Down Payment (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.downPayment}
                                    onChange={(e) => updateInput("downPayment", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Monthly Mortgage Payment (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.monthlyMortgage}
                                    onChange={(e) => updateInput("monthlyMortgage", Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Main ROI Card */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <CardHeader>
                            <CardTitle className="text-white/90">Investment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-amber-400">
                                    {formatPercent(results.capRate)}
                                </div>
                                <div className="text-sm text-white/70 mt-1">Cap Rate</div>
                                <Badge className={`mt-2 ${roiStatus.color}`}>
                                    {roiStatus.label} Return
                                </Badge>
                            </div>

                            <Separator className="bg-white/20" />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-bold text-green-400">
                                        {formatPercent(results.cashOnCashReturn)}
                                    </div>
                                    <div className="text-xs text-white/70">Cash-on-Cash</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-blue-400">
                                        {formatYears(results.paybackPeriodYears)}
                                    </div>
                                    <div className="text-xs text-white/70">Payback Period</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Income Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <TrendingUp className="w-5 h-5" />
                                Income
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Gross Annual</span>
                                <span className="font-medium">{formatCurrency(results.grossAnnualIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Effective (w/ vacancy)</span>
                                <span className="font-medium">{formatCurrency(results.effectiveGrossIncome)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Net Operating Income</span>
                                <span className="font-bold text-green-600">{formatCurrency(results.netOperatingIncome)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expense Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <TrendingDown className="w-5 h-5" />
                                Expenses (Annual)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Operating</span>
                                <span className="font-medium">{formatCurrency(results.totalAnnualExpenses)}</span>
                            </div>
                            {inputs.monthlyMortgage > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mortgage</span>
                                    <span className="font-medium">{formatCurrency(inputs.monthlyMortgage * 12)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Annual Cash Flow</span>
                                <span className={`font-bold ${results.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {formatCurrency(results.cashFlow)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Monthly Cash Flow</span>
                                <span className={`font-bold ${results.monthlyNetIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {formatCurrency(results.monthlyNetIncome)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Break-even */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Break-even Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {formatPercent(results.breakEvenOccupancy)}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Minimum occupancy to break even
                                </div>
                                {results.breakEvenOccupancy > inputs.occupancyRate && (
                                    <p className="text-xs text-red-500 mt-2">
                                        ⚠️ Current occupancy is below break-even
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
