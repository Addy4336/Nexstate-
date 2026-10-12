"use client";

import { brand } from "@nexstate/brand";
import { motion } from "framer-motion";
import { Home, Key, Calculator, Users, Building, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tenantServices = [
  {
    icon: Home,
    title: "Fully Furnished",
    description: "Move-in ready homes with premium furniture and appliances included."
  },
  {
    icon: Key,
    title: "Flexible Leases",
    description: "Short-term, long-term, or month-to-month rental options available."
  },
  {
    icon: Users,
    title: "Community Living",
    description: "Join our vibrant co-living spaces and connect with like-minded professionals."
  },
];

const ownerServices = [
  {
    icon: Building,
    title: "Property Management",
    description: "End-to-end management from tenant screening to maintenance."
  },
  {
    icon: TrendingUp,
    title: "Maximize Returns",
    description: "AI-powered pricing and occupancy optimization for higher ROI."
  },
  {
    icon: Calculator,
    title: "ROI Calculator",
    description: "Calculate your potential returns with our intelligent estimator."
  },
];

export function Services() {
  return (
    <section className="section-padding bg-secondary/30" id="services">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Tenants */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id="tenants"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Home className="w-4 h-4" />
              For Tenants
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Find Your Dream Home
            </h2>
            <p className="text-muted-foreground mb-8">
              From studio apartments to luxury villas, discover your perfect furnished rental in Dubai's most desirable locations.
            </p>

            <div className="space-y-6 mb-8">
              {tenantServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="btn-primary group">
              Browse Properties
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* For Owners */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id="owners"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Building className="w-4 h-4" />
              For Owners
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Maximize Your Property's Potential
            </h2>
            <p className="text-muted-foreground mb-8">
              Let {brand.name} manage your property with our AI-driven platform. Higher occupancy, better returns, zero hassle.
            </p>

            <div className="space-y-6 mb-8">
              {ownerServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="btn-secondary group border-primary/20 hover:border-primary/50">
              List Your Property
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
