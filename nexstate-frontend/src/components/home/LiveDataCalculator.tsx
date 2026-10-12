"use client";

import React, { useState } from 'react';
import { Check, TrendingUp, DollarSign, BarChart3, Calculator } from 'lucide-react';
import Link from 'next/link';

const features = [
    "Real-time market analysis and ROI predictions",
    "Automated rent optimization suggestions",
    "Zero management stress with AI operations",
    "Transparent dashboard with live metrics"
];

export default function LiveDataCalculator() {
    const [propertyValue, setPropertyValue] = useState(200000);
    const [monthlyRent, setMonthlyRent] = useState(2900);

    // Calculate ROI and other values based on sliders
    const annualRent = monthlyRent * 12;
    const annualROI = ((annualRent / propertyValue) * 100).toFixed(1);
    const netIncome = Math.round(annualRent * 0.85); // Assuming 15% expenses
    const aiSavings = Math.round(annualRent * 0.12); // AI saves ~12%

    return (
        <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">

                    {/* Left Content */}
                    <div className="max-w-xl">
                        {/* Badge */}
                        <div className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 border border-primary/20 rounded-full text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6">
                            For Property Owners
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-foreground leading-tight mb-4 sm:mb-6">
                            Maximize Your Returns with{' '}
                            <span className="text-primary">Live AI Data</span>
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                            Forget outdated spreadsheets. Our unique AI Calculator uses live market
                            data to predict your ROI with high accuracy. Track your property's
                            performance in real-time.
                        </p>

                        {/* Feature List */}
                        <ul className="space-y-3 sm:space-y-4">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 sm:gap-3">
                                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" strokeWidth={3} />
                                    </div>
                                    <span className="text-sm sm:text-base text-foreground/80">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right - Calculator Card */}
                    <div className="bg-card rounded-2xl shadow-xl border border-border p-5 sm:p-6 md:p-8">
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm sm:text-base text-foreground">Live-Data AI Calculator</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Real-time ROI predictions</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-chart-2 font-medium">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-2 rounded-full animate-pulse"></span>
                                Live
                            </div>
                        </div>

                        {/* Property Value Slider */}
                        <div className="mb-5 sm:mb-6">
                            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">Property Value</label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="50000"
                                    max="1000000"
                                    step="10000"
                                    value={propertyValue}
                                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                                    className="w-full h-1 sm:h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs sm:text-sm text-muted-foreground">$</span>
                                    <span className="text-base sm:text-lg font-bold text-foreground">${propertyValue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Rent Slider */}
                        <div className="mb-6 sm:mb-8">
                            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">Monthly Rent</label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="100"
                                    value={monthlyRent}
                                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                                    className="w-full h-1 sm:h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs sm:text-sm text-muted-foreground">$</span>
                                    <span className="text-base sm:text-lg font-bold text-foreground">${monthlyRent.toLocaleString()}/mo</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            {/* Annual ROI */}
                            <div className="bg-muted rounded-xl p-3 sm:p-4">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Annual ROI
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-primary">{annualROI}%</div>
                            </div>

                            {/* Net Income */}
                            <div className="bg-muted rounded-xl p-3 sm:p-4">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Net Income
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-foreground">${netIncome.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* AI Savings */}
                        <div className="bg-chart-2/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-chart-2 mb-1 sm:mb-2">
                                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                                AI Management Savings
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-chart-2">${aiSavings.toLocaleString()}/year</div>
                        </div>

                        {/* CTA Button */}
                        <Link href="/owner#owner-consultation-form">
                        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-colors duration-200 text-sm sm:text-base">
                            Get Detailed Analysis
                        </button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
