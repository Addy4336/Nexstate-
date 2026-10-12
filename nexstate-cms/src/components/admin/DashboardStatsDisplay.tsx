"use client";

import { motion } from "framer-motion";
import {
    Building2,
    Users,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/dashboard";

interface DashboardStatsDisplayProps {
    stats: DashboardStats;
}

export function DashboardStatsDisplay({ stats }: DashboardStatsDisplayProps) {
    // Format currency
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `AED ${(amount / 1000000).toFixed(1)}M`;
        }
        return `AED ${amount.toLocaleString()}`;
    };
    const statItems = [
        {
            title: "Total Properties",
            value: stats.totalProperties.toString(),
            change: "+12%", // Mock trend for now
            trend: "up",
            icon: Building2,
            color: "text-chart-1",
            bgColor: "bg-chart-1/10",
        },
        {
            title: "Active Tenants",
            value: stats.activeTenants.toString(),
            change: "+8%", // Mock trend
            trend: "up",
            icon: Users,
            color: "text-chart-2",
            bgColor: "bg-chart-2/10",
        },
        {
            title: "Monthly Revenue",
            value: formatCurrency(stats.monthlyRevenue),
            change: "+23%", // Mock trend
            trend: "up",
            icon: DollarSign,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Occupancy Rate",
            value: `${stats.occupancyRate}%`,
            change: "-2%", // Mock trend
            trend: "down",
            icon: TrendingUp,
            color: "text-chart-5",
            bgColor: "bg-chart-5/10",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {statItems.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                    className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {stat.change}
                                </span>
                                <span className="text-sm text-muted-foreground">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
