import ContactHero from "@/components/contact/ContactHero";
import ContactDetails from "@/components/contact/ContactDetails";
import ExploreProperties from "@/components/contact/ExploreProperties";
import ContactCTA from "@/components/contact/ContactCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with us to find out more about our services.",
};

export default function ContactPage() {
    return (
        <main>
            <ContactHero />
            <ContactDetails />
            <ExploreProperties />
            <ContactCTA />
        </main>
    );
}
