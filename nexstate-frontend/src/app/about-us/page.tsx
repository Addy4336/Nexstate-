import AboutStatistics from "@/components/about-us/AboutStatistic";
import ContactSection from "@/components/about-us/ContactSection";
import Hero from "@/components/about-us/Hero";
import Mission from "@/components/about-us/Mission";
import Vision from "@/components/about-us/Vision";
import AtAGlance from "@/components/about-us/AtAGlance";
import WhatWeOffer from "@/components/about-us/WhatWeOffer";
import HowToWeDifferent from "@/components/about-us/HowToWeDifferent";
import TeamSection from "@/components/about-us/TeamSection";
import Testimonials from "@/components/about-us/Testimonials";
import WorkWithUs from "@/components/about-us/WorkWithUs";
import HomeHero from "@/components/home/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "About Us",
};

export default function AboutUs() {
    return (
        <main>
            <HomeHero />
            <Hero />
            {/* <AboutStatistics /> */}
            <Vision />
            
            <Mission />
<AtAGlance />
            <WhatWeOffer />
            <HowToWeDifferent />
            <TeamSection />
            {/* <WorkWithUs /> */}
            {/* <Testimonials /> */}
            {/* <ContactSection /> */}
        </main>
    );
}

