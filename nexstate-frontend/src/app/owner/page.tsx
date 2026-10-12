
import Hero from "@/components/owner/Hero";
import UserToggle from "@/components/tenants/UserToggle";
import OwnerFeatures from "@/components/owner/OwnerFeatures";
import TailoredStrategies from "@/components/owner/TailoredStrategies";
import AdaptiveRentalOptions from "@/components/owner/AdaptiveRentalOptions";
import ServicesSection from "@/components/owner/ServicesSection";
import AboutSection from "@/components/owner/AboutSection";
import ProcessSection from "@/components/owner/ProcessSection";
import GrowthSection from "@/components/owner/GrowthSection";
import TeamSection from "@/components/owner/TeamSection";
import ConsultationSection from "@/components/owner/ConsultationSection";
import FooterSection from "@/components/owner/FooterSection";
import CalculatorsSection from "@/components/CalculatorsSection";

export default function Home() {
  return (
    <main className="min-h-screen pt-20 bg-white text-black dark:bg-neutral-950 dark:text-white selection:bg-purple-100 selection:text-purple-900">

      <Hero />
      <CalculatorsSection />
      {/* <UserToggle currentType="owner" /> */}
      {/* <TailoredStrategies /> */}
      {/* */}
      {/* <ServicesSection /> */}
      <OwnerFeatures />
      <ConsultationSection />
      {/* <AboutSection /> */}
      <ProcessSection />
      <AdaptiveRentalOptions /> 
      <GrowthSection />
      
      <TeamSection />
      {/* <FooterSection /> */}

    </main>
  );
}
