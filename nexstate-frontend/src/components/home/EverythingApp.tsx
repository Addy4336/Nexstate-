"use client";

import { brand } from "@nexstate/brand";
import React from 'react';
import { Bot, Zap, Clock, TrendingUp, BarChart3, Eye, Brain, Sparkles, Settings, Wrench, Users } from 'lucide-react';

export default function EverythingApp() {
    return (
        <section className="py-18 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
                        The {brand.name} Difference
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-foreground leading-tight mb-6">
                        Not Just a Rental, It's a <span className="text-primary">Smart Ecosystem</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        We are the first in the industry to offer a home fully managed by AI. From the moment you search to the moment you leave, AI ensures perfection.
                    </p>
                </div>

                {/* Bento Grid layout - 55/45 height distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:[grid-template-rows:repeat(20,1fr)] gap-5">

                    {/* Card 1: First-of-Its-Kind Technology - AI Ecosystem Visualization */}
                    <div className="bg-gradient-to-br from-secondary/30 via-secondary/50 to-secondary/70 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 md:[grid-row:1/12]">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-foreground mb-3">First-of-Its-Kind Technology</h3>
                            <p className="text-foreground/70 mb-6 leading-relaxed text-[15px]">
                                No other rental platform combines AI agents for sales, maintenance, and management into one seamless ecosystem.
                            </p>

                            {/* AI Ecosystem - 3 Connected Agents */}
                            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
                                {/* Sales Agent */}
                                <div className="bg-card rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-sm flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-[100px] sm:max-w-none">
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                                        <Users className="w-4 h-4 sm:w-6 sm:h-6 text-chart-2" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center leading-tight">Sales</span>
                                    <div className="text-[8px] sm:text-[10px] text-muted-foreground hidden sm:block">AI Agent</div>
                                </div>

                                {/* Connection Lines */}
                                <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0">
                                    <div className="w-4 sm:w-8 h-0.5 bg-foreground/20"></div>
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-secondary animate-pulse" />
                                    <div className="w-4 sm:w-8 h-0.5 bg-foreground/20"></div>
                                </div>

                                {/* Maintenance Agent */}
                                <div className="bg-card rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-sm flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-[100px] sm:max-w-none">
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                                        <Wrench className="w-4 h-4 sm:w-6 sm:h-6 text-secondary" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center leading-tight">Maint.</span>
                                    <div className="text-[8px] sm:text-[10px] text-muted-foreground hidden sm:block">AI Agent</div>
                                </div>

                                {/* Connection Lines */}
                                <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0">
                                    <div className="w-4 sm:w-8 h-0.5 bg-foreground/20"></div>
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-secondary animate-pulse" />
                                    <div className="w-4 sm:w-8 h-0.5 bg-foreground/20"></div>
                                </div>

                                {/* Management Agent */}
                                <div className="bg-card rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-sm flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-[100px] sm:max-w-none">
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center leading-tight">Mgmt.</span>
                                    <div className="text-[8px] sm:text-[10px] text-muted-foreground hidden sm:block">AI Agent</div>
                                </div>
                            </div>

                            {/* Unified Platform Badge */}
                            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">One Seamless Ecosystem</div>
                                        <div className="text-xs text-muted-foreground">All agents working together</div>
                                    </div>
                                </div>
                                <div className="bg-chart-2 text-card text-xs font-bold px-3 py-1.5 rounded-full">Active</div>
                            </div>
                        </div>

                        {/* Soft Glow */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-card/15 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    </div>

                    {/* Card 2: Instant Everything - Real-time Speed Indicators */}
                    <div className="bg-primary/5 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-primary/10 md:[grid-row:1/10]">
                        <div className="w-full text-left mb-6">
                            <h3 className="text-2xl font-bold text-foreground">
                                Instant Everything
                            </h3>
                            <p className="text-muted-foreground mt-2">From booking to repairs, every interaction is handled in real-time. No queues, no delays, no frustration.</p>
                        </div>

                        {/* Real-time Speed Metrics */}
                        <div className="space-y-4">
                            {/* Booking Speed */}
                            <div className="bg-card rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-chart-2" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">Instant Booking</div>
                                        <div className="text-xs text-muted-foreground">No broker waiting</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-chart-2">&lt;5s</div>
                                    <div className="text-[10px] text-muted-foreground">Response</div>
                                </div>
                            </div>

                            {/* Repair Response */}
                            <div className="bg-card rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">Repair Requests</div>
                                        <div className="text-xs text-muted-foreground">Immediate resolution</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-secondary">0</div>
                                    <div className="text-[10px] text-muted-foreground">Wait Time</div>
                                </div>
                            </div>

                            {/* 24/7 Badge */}
                            <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium pt-2">
                                <span className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></span>
                                Available 24/7 - No Queues
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Transparent Operations - Live Dashboard */}
                    <div className="bg-primary/5 rounded-2xl p-4 md:p-6 relative overflow-hidden shadow-sm border border-primary/10 hover:shadow-xl transition-shadow duration-300 md:[grid-row:10/21]">
                        <div className="relative z-10 mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-3">Transparent Operations</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Both tenants and owners have full visibility into performance metrics, costs, and ROI through live dashboards.
                            </p>
                        </div>

                        {/* Live Dashboard Mockup */}
                        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-foreground">Live Dashboard</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-chart-2">
                                    <span className="w-1.5 h-1.5 bg-chart-2 rounded-full animate-pulse"></span>
                                    Real-time
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-foreground">98%</div>
                                    <div className="text-[9px] text-muted-foreground">Uptime</div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-foreground">$2.4k</div>
                                    <div className="text-[9px] text-muted-foreground">Monthly Costs</div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-chart-2">+18%</div>
                                    <div className="text-[9px] text-muted-foreground">ROI</div>
                                </div>
                            </div>

                            {/* Mini Bar Chart */}
                            <div className="flex items-end justify-between gap-1 h-16 px-2">
                                {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-primary' : 'bg-primary/30'}`}
                                        style={{ height: `${h}%` }}
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[8px] text-muted-foreground mt-1 px-1">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                            </div>
                        </div>

                        {/* Floating ROI Card */}
                        <div className="absolute bottom-4 right-2 bg-card p-3 rounded-xl shadow-xl border border-border hidden md:flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-chart-2" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-foreground">Live ROI</div>
                                <div className="text-sm font-bold text-chart-2">+18.5%</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Continuously Learning - AI Learning Progress */}
                    <div className="bg-card rounded-2xl p-4 md:p-6 relative overflow-hidden shadow-sm border border-border hover:shadow-xl transition-shadow duration-300 md:[grid-row:12/21]">
                        <div className="relative z-10 mb-6 max-w-sm">
                            <h3 className="text-2xl font-bold text-foreground mb-3">Continuously Learning</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Our AI agents improve over time, learning from every interaction to provide even better service.
                            </p>
                        </div>

                        {/* AI Learning Visualization */}
                        <div className="space-y-4">
                            {/* Learning Progress */}
                            <div className="bg-muted/30 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-semibold text-foreground">AI Learning Progress</span>
                                    </div>
                                    <span className="text-xs text-chart-2 font-medium">+12% this month</span>
                                </div>

                                {/* Progress Bars */}
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Customer Queries</span>
                                            <span className="text-foreground font-medium">94%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: '94%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Issue Resolution</span>
                                            <span className="text-foreground font-medium">89%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-secondary rounded-full" style={{ width: '89%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Service Accuracy</span>
                                            <span className="text-foreground font-medium">97%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-chart-2 rounded-full" style={{ width: '97%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interactions Counter */}
                            <div className="flex items-center justify-between bg-primary/5 rounded-xl p-4 border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">Total Interactions</div>
                                        <div className="text-xs text-muted-foreground">Learning from every one</div>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-primary">48.2k</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
