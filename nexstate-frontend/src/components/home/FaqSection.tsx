import Link from "next/link";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion, type FaqItem } from "./FaqAccordion";

/** Server component: FAQs come from the CMS, so editing them in the admin updates the site. Hidden if there are none. */
export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
    if (faqs.length === 0) return null;
    return (
        <Section tone="sand" id="faq">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                    <SectionHeading
                        layout="stacked"
                        eyebrow="Questions"
                        title="Good to *know*"
                        lead={
                            <>
                                Not here? <Link href="/contact" className="underline decoration-brass underline-offset-4 hover:text-ink">Ask us directly</Link>; we usually reply the same day.
                            </>
                        }
                    />
                </div>
                <Reveal className="lg:col-span-8">
                    <FaqAccordion items={faqs} />
                </Reveal>
            </div>
        </Section>
    );
}
