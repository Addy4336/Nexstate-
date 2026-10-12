"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    calculateTenantCosts,
    formatCurrency,
    type TenantCostInputs,
} from "@/lib/calculators";
import {
    Home,
    Calculator,
    Calendar,
    Wallet,
    TrendingDown,
    Clock,
    Zap,
    Car,
    Wrench,
    Shield,
} from "lucide-react";

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

export function TenantCostCalculator() {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 mb-4">
                    <Wallet className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Tenant Cost Calculator</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Compare total rental costs across different stay durations and understand your complete cost breakdown.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Inputs Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rent Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Rent Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Monthly Rent (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.monthlyRent}
                                    onChange={(e) => updateInput("monthlyRent", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Security Deposit (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.securityDeposit}
                                    onChange={(e) => updateInput("securityDeposit", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <div className="flex justify-between">
                                    <Label>Stay Duration</Label>
                                    <span className="text-sm font-medium">{inputs.stayDurationMonths} months</span>
                                </div>
                                <Slider
                                    value={[inputs.stayDurationMonths]}
                                    onValueChange={([v]) => updateInput("stayDurationMonths", v)}
                                    min={1}
                                    max={36}
                                    step={1}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1 month</span>
                                    <span>3 years</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Recurring Costs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Monthly Recurring Costs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Wrench className="w-4 h-4" />
                                    Maintenance
                                </Label>
                                <Input
                                    type="number"
                                    value={inputs.monthlyMaintenance}
                                    onChange={(e) => updateInput("monthlyMaintenance", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Utilities
                                </Label>
                                <Input
                                    type="number"
                                    value={inputs.monthlyUtilities}
                                    onChange={(e) => updateInput("monthlyUtilities", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Car className="w-4 h-4" />
                                    Parking
                                </Label>
                                <Input
                                    type="number"
                                    value={inputs.monthlyParking}
                                    onChange={(e) => updateInput("monthlyParking", Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* One-time Costs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                One-time Costs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Move-in Costs (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.moveInCosts}
                                    onChange={(e) => updateInput("moveInCosts", Number(e.target.value))}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Cleaning, moving company, etc.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Brokerage Fee (AED)</Label>
                                <Input
                                    type="number"
                                    value={inputs.brokerageFee}
                                    onChange={(e) => updateInput("brokerageFee", Number(e.target.value))}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Agent/broker commission
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Main Cost Summary */}
                    <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
                        <CardHeader>
                            <CardTitle className="text-white/90">Cost Summary</CardTitle>
                            <CardDescription className="text-white/60">
                                For {inputs.stayDurationMonths} months stay
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-300">
                                    {formatCurrency(results.totalStayCost)}
                                </div>
                                <div className="text-sm text-white/70 mt-1">Total Cost</div>
                            </div>

                            <Separator className="bg-white/20" />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-bold text-green-400">
                                        {formatCurrency(results.monthlyAllInCost)}
                                    </div>
                                    <div className="text-xs text-white/70">Monthly All-In</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-amber-400">
                                        {formatCurrency(results.averageMonthlyCost)}
                                    </div>
                                    <div className="text-xs text-white/70">Effective Monthly</div>
                                </div>
                            </div>

                            {savings > 0 && inputs.stayDurationMonths > 6 && (
                                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                                    <div className="text-green-400 text-sm font-medium">
                                        💰 You save {formatCurrency(savings)}/month vs 6-month lease
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cost Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5" />
                                Cost Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Rent</span>
                                <span className="font-medium">{formatCurrency(results.costBreakdown.rent)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Maintenance</span>
                                <span className="font-medium">{formatCurrency(results.costBreakdown.maintenance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Utilities</span>
                                <span className="font-medium">{formatCurrency(results.costBreakdown.utilities)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Parking</span>
                                <span className="font-medium">{formatCurrency(results.costBreakdown.parking)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-muted-foreground">
                                <span>Security Deposit</span>
                                <span>{formatCurrency(results.costBreakdown.deposit)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Move-in Costs</span>
                                <span>{formatCurrency(results.costBreakdown.moveIn)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Brokerage</span>
                                <span>{formatCurrency(results.costBreakdown.brokerage)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-medium">Upfront Required</span>
                                <span className="font-bold text-blue-600">{formatCurrency(results.upfrontCosts)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Duration Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Duration Comparison
                            </CardTitle>
                            <CardDescription>
                                Effective monthly cost by lease length
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {results.durationComparison.map((item) => (
                                <div
                                    key={item.months}
                                    className={`flex justify-between items-center p-2 rounded-lg ${item.months === inputs.stayDurationMonths
                                            ? "bg-blue-100 dark:bg-blue-900/30"
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.months} months</span>
                                        {item.months === inputs.stayDurationMonths && (
                                            <Badge variant="secondary">Selected</Badge>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{formatCurrency(item.avgMonthlyCost)}/mo</div>
                                        <div className="text-xs text-muted-foreground">
                                            Total: {formatCurrency(item.totalCost)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
