import { Hero } from "@/components/user/Hero";
import { Stats } from "@/components/user/Stats";
import { FeaturedProperties } from "@/components/user/FeaturedProperties";
import { HowItWorks } from "@/components/user/HowItWorks";
import { Services } from "@/components/user/Services";
import { Locations } from "@/components/user/Locations";
import { ROICalculator } from "@/components/user/ROICalculator";
import { CTA } from "@/components/user/CTA";
import { getFeaturedProperties, getAvailableProperties } from "@/lib/properties";

export default async function HomePage() {
    // Fetch featured properties, fallback to available properties if none are featured
    let properties = await getFeaturedProperties(6);

    // If no featured properties, show available ones instead
    if (properties.length === 0) {
        properties = await getAvailableProperties(6);
    }

    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <Hero />
            <Stats />
            <FeaturedProperties properties={properties} />
            <HowItWorks />
            <Services />
            <Locations />
            <ROICalculator />
            <CTA />
        </main>
    );
}
