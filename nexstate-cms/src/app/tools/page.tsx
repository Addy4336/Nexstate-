import { brand } from "@nexstate/brand";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Wallet, ArrowRight, TrendingUp, Home, PiggyBank } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Property Tools | ${brand.name}`,
    description: "Free property investment tools - ROI Calculator for owners and Cost Calculator for tenants.",
};

const tools = [
    {
        title: "Owner ROI Calculator",
        description: "Estimate rental returns based on rent, occupancy, service fees, maintenance, and financing.",
        href: "/tools/roi-calculator",
        icon: TrendingUp,
        color: "from-amber-400 to-amber-600",
        features: ["Cap Rate Analysis", "Cash-on-Cash Return", "Break-even Occupancy", "Payback Period"],
    },
    {
        title: "Tenant Cost Calculator",
        description: "Compare total rental costs across different stay durations and understand your complete expenses.",
        href: "/tools/cost-calculator",
        icon: Wallet,
        color: "from-blue-400 to-blue-600",
        features: ["Duration Comparison", "All-In Monthly Cost", "Upfront Requirements", "Cost Breakdown"],
    },
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 mb-4">
                        <Calculator className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-4xl font-bold">Property Tools</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Free calculators and tools to help you make informed property decisions.
                        Whether you're an investor or a tenant, we've got you covered.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                    {tools.map((tool) => (
                        <Card key={tool.href} className="overflow-hidden hover:shadow-xl transition-shadow">
                            <CardHeader className={`bg-gradient-to-br ${tool.color} text-white`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-xl">
                                        <tool.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-xl">{tool.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <CardDescription className="text-base">
                                    {tool.description}
                                </CardDescription>
                                <div className="flex flex-wrap gap-2">
                                    {tool.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <Link href={tool.href}>
                                    <Button className="w-full group">
                                        Open Calculator
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-8">Why Use Our Tools?</h2>
                    <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                        <div className="p-6 rounded-xl bg-card border">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                                <PiggyBank className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">100% Free</h3>
                            <p className="text-sm text-muted-foreground">
                                No sign-up required. Use all tools for free, forever.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">Real-time Results</h3>
                            <p className="text-sm text-muted-foreground">
                                See calculations update instantly as you type.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
                                <Home className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">UAE Focused</h3>
                            <p className="text-sm text-muted-foreground">
                                Built specifically for the UAE property market.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
