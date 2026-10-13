import type { Metadata } from "next";
import { brand } from "@nexstate/brand";
import { apiGet } from "@/lib/server-api";
import type { Property } from "@/types/property";
import { HomeHero } from "@/components/home/HomeHero";
import { CityTicker } from "@/components/home/CityTicker";
import { FeaturedHomes } from "@/components/home/FeaturedHomes";
import { CityGrid } from "@/components/home/CityGrid";
import { WhyBento } from "@/components/home/WhyBento";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OwnersBand } from "@/components/home/OwnersBand";
import { Reviews } from "@/components/home/Reviews";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import type { FaqItem } from "@/components/home/FaqAccordion";

// Rebuilt at most once a minute, so new listings and FAQ edits appear without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${brand.name}: ${brand.tagline}` },
  description: brand.description,
};

export default async function HomePage() {
  const [properties, faqs] = await Promise.all([
    apiGet<Property[]>("/properties?limit=50", []),
    apiGet<FaqItem[]>("/faqs", []),
  ]);

  return (
    <main>
      <HomeHero />
      <CityTicker />
      <FeaturedHomes properties={properties} />
      <CityGrid properties={properties} />
      <WhyBento />
      <HowItWorks />
      <OwnersBand />
      <Reviews />
      <FaqSection faqs={faqs} />
      <FinalCta />
    </main>
  );
}
