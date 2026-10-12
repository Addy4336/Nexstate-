"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const locations = [
  { name: "Dubai Marina", properties: 85, popular: true },
  { name: "Downtown Dubai", properties: 62, popular: true },
  { name: "JLT", properties: 78, popular: false },
  { name: "Business Bay", properties: 54, popular: false },
  { name: "JBR", properties: 41, popular: true },
  { name: "Palm Jumeirah", properties: 28, popular: false },
];

export function Locations() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-semibold text-sm uppercase tracking-wider"
          >
            Prime Locations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4"
          >
            Explore Dubai's Best Areas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Find your perfect neighborhood from Dubai's most sought-after locations.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {locations.map((location, index) => (
            <motion.a
              key={location.name}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-md transition-all text-center"
            >
              {location.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold uppercase">
                  Popular
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <MapPin className="w-5 h-5 text-accent group-hover:text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-accent transition-colors">
                {location.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {location.properties} properties
              </p>
              <ArrowRight className="w-4 h-4 mx-auto mt-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
