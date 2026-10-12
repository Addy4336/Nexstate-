import { brand } from "@nexstate/brand";
import Hero from "@/components/tenants/Hero";
import UserToggle from "@/components/tenants/UserToggle";
import PropertyShowcase from "@/components/tenants/PropertyShowcase";
import MapFeatures from "@/components/tenants/MapFeatures";
import PremierHouses from "@/components/tenants/PremierHouses";
import ClientTestimonials from "@/components/tenants/ClientTestimonials";
import FAQSection from "@/components/tenants/FAQSection";
import CTASection from "@/components/tenants/CTASection";
import LocationSection from "@/components/tenants/LocationSection";
import CalculatorsSection from "@/components/CalculatorsSection";

import TenantStories from "@/components/tenants/TenantStories";
import DetailedContent from "@/components/landing/DetailedContent";

export default function HomeTenants() {
  return (
    <main className="min-h-screen bg-background text-foreground relative font-sans">
      {/* <Navbar /> */}
      <Hero />

      {/* Standard tier segment */}
      {/* <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-2">
            {brand.tiers.standard.toUpperCase()}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Private Rooms & Co-living
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Quality living spaces designed for community, comfort, and affordability.
          </p>
        </div>
        <PropertyShowcase />
      </div> */}

      <DetailedContent />
      <TenantStories />
      {/* <LocationSection /> */}
      {/* <MapFeatures /> */}
      {/* <PremierHouses /> */}
      {/* <CalculatorsSection /> */}

      {/* <FAQSection /> */}
      {/* <ClientTestimonials /> */}
      {/* <CTASection /> */}
    </main>
  );
}
