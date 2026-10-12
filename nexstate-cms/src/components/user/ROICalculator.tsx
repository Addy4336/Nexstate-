"use client";

import { brand } from "@nexstate/brand";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export function ROICalculator() {
  const [monthlyRent, setMonthlyRent] = useState(8000);
  const [occupancy, setOccupancy] = useState(85);
  const [serviceFee, setServiceFee] = useState(15);

  const annualRevenue = monthlyRent * 12 * (occupancy / 100);
  const serviceCost = annualRevenue * (serviceFee / 100);
  const netIncome = annualRevenue - serviceCost;

  return (
    <section className="section-padding bg-primary text-primary-foreground" id="roi">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              ROI Calculator
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Calculate Your
              <br />
              <span className="text-secondary">Rental Returns</span>
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg">
              Estimate your property's earning potential with our AI-powered ROI calculator. Get insights on rent optimization, occupancy rates, and net returns.
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-primary-foreground/60">Avg. Occupancy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15%</p>
                  <p className="text-sm text-primary-foreground/60">Higher Returns</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card text-card-foreground rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <div className="space-y-6">
              {/* Monthly Rent */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    Monthly Rent (AED)
                  </label>
                  <span className="text-sm font-bold text-accent">{monthlyRent.toLocaleString()}</span>
                </div>
                <Slider
                  value={[monthlyRent]}
                  onValueChange={(value) => setMonthlyRent(value[0])}
                  min={2000}
                  max={30000}
                  step={500}
                  className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>AED 2,000</span>
                  <span>AED 30,000</span>
                </div>
              </div>

              {/* Occupancy Rate */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="w-4 h-4 text-accent" />
                    Occupancy Rate
                  </label>
                  <span className="text-sm font-bold text-accent">{occupancy}%</span>
                </div>
                <Slider
                  value={[occupancy]}
                  onValueChange={(value) => setOccupancy(value[0])}
                  min={50}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Service Fee */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Percent className="w-4 h-4 text-accent" />
                    {brand.name} Service Fee
                  </label>
                  <span className="text-sm font-bold text-accent">{serviceFee}%</span>
                </div>
                <Slider
                  value={[serviceFee]}
                  onValueChange={(value) => setServiceFee(value[0])}
                  min={10}
                  max={25}
                  step={1}
                  className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Results */}
              <div className="pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-secondary">
                    <p className="text-sm text-muted-foreground mb-1">Annual Revenue</p>
                    <p className="text-xl font-bold text-foreground">AED {annualRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/10">
                    <p className="text-sm text-muted-foreground mb-1">Net Income</p>
                    <p className="text-xl font-bold text-accent">AED {netIncome.toLocaleString()}</p>
                  </div>
                </div>
               <Link href="/owner#owner-consultation-form">
                <Button className="btn-primary w-full">
                  Get Detailed Analysis
                </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
