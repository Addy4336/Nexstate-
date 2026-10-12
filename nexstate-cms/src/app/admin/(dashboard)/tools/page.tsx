import { requireStaff } from "@/lib/auth-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Calculator,
    Wallet,
    TrendingUp,
    SlidersHorizontal,
    Sparkles,
    ExternalLink,
    Eye,
    Check,
} from "lucide-react";

const tools = [
    {
        title: "Owner ROI Calculator",
        description: "Help property owners estimate rental returns based on rent, expenses, and financing.",
        icon: TrendingUp,
        href: "/tools/roi-calculator",
        color: "bg-chart-4",
        stats: { label: "Investments analyzed", value: "—" },
    },
    {
        title: "Tenant Cost Calculator",
        description: "Enable tenants to compare rental costs across different stay durations.",
        icon: Wallet,
        href: "/tools/cost-calculator",
        color: "bg-chart-1",
        stats: { label: "Cost comparisons", value: "—" },
    },
    {
        title: "Advanced Property Search",
        description: "Location radius, property type, budget, sharing options, amenities, and more.",
        icon: SlidersHorizontal,
        href: "/properties",
        color: "bg-chart-2",
        stats: { label: "Search filters", value: "10+" },
    },
    {
        title: "Smart Recommendations",
        description: "Cross-sell and upsell suggestions based on user search behavior and preferences.",
        icon: Sparkles,
        href: "/properties",
        color: "bg-chart-5",
        stats: { label: "Recommendation types", value: "4" },
    },
];

export default async function ToolsPage() {
    await requireStaff();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">ROI Tools</h1>
                <p className="text-muted-foreground text-sm">
                    Manage property calculators and search tools available to users.
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((tool) => (
                    <Card key={tool.title} className="flex flex-col overflow-hidden h-full">
                        <div className={`${tool.color} p-4 text-white`}>
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-md">
                                    <tool.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-sm leading-tight">{tool.title}</h3>
                            </div>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1 justify-between gap-4">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {tool.description}
                            </p>
                            <div className="space-y-3 pt-2 border-t mt-auto">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground truncate">{tool.stats.label}</span>
                                    <span className="font-medium bg-muted px-1.5 py-0.5 rounded">{tool.stats.value}</span>
                                </div>
                                <Link href={tool.href} target="_blank" className="block w-full">
                                    <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                                        Preview Tool
                                        <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Links */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Public Tool Pages</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-2">
                        <Link href="/tools" target="_blank">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                <Calculator className="w-3.5 h-3.5 mr-2" />
                                Tools Landing
                            </Button>
                        </Link>
                        <Link href="/tools/roi-calculator" target="_blank">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                <TrendingUp className="w-3.5 h-3.5 mr-2" />
                                ROI Calculator
                            </Button>
                        </Link>
                        <Link href="/tools/cost-calculator" target="_blank">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                <Wallet className="w-3.5 h-3.5 mr-2" />
                                Cost Calculator
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Features implemented */}
            <Card className="border-none shadow-none bg-transparent">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">Feature Breakdown</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Owner ROI */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4 hover:border-chart-4/50 transition-colors">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-chart-4/10 text-chart-4">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-sm">Owner ROI</h4>
                        </div>
                        <ul className="space-y-2.5">
                            {["Cap Rate calculation", "Cash-on-Cash return", "Break-even occupancy", "Payback period", "Expense breakdown"].map((item) => (
                                <li key={item} className="text-xs text-muted-foreground flex items-start gap-2.5">
                                    <Check className="w-3.5 h-3.5 text-chart-4 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tenant Cost */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4 hover:border-chart-1/50 transition-colors">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-chart-1/10 text-chart-1">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-sm">Tenant Cost</h4>
                        </div>
                        <ul className="space-y-2.5">
                            {["Total stay cost breakdown", "Duration comparison", "Upfront cost calculation", "Effective monthly rent", "Savings visualization"].map((item) => (
                                <li key={item} className="text-xs text-muted-foreground flex items-start gap-2.5">
                                    <Check className="w-3.5 h-3.5 text-chart-1 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Advanced Filters */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4 hover:border-chart-2/50 transition-colors">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-chart-2/10 text-chart-2">
                                <SlidersHorizontal className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-sm">Advanced Filters</h4>
                        </div>
                        <ul className="space-y-2.5">
                            {["Location radius (1-20 km)", "Property type selection", "Budget range", "Sharing/Private options", "Furnishing & Gender", "Amenities & Availability"].map((item) => (
                                <li key={item} className="text-xs text-muted-foreground flex items-start gap-2.5">
                                    <Check className="w-3.5 h-3.5 text-chart-2 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Smart Recommendations */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4 hover:border-chart-5/50 transition-colors">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-chart-5/10 text-chart-5">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-sm">Smart Recommendations</h4>
                        </div>
                        <ul className="space-y-2.5">
                            {["Similar properties (±20%)", "Upgrade options (+10-30%)", "Budget alternatives", "Popular in area"].map((item) => (
                                <li key={item} className="text-xs text-muted-foreground flex items-start gap-2.5">
                                    <Check className="w-3.5 h-3.5 text-chart-5 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
