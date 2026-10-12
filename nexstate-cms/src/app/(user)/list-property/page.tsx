import { brand } from "@nexstate/brand";
import { EnquiryForm } from "@/components/user/EnquiryForm";
import { Check } from "lucide-react";

export const metadata = {
    title: `List Your Property | ${brand.name}`,
    description: "Partner with Dubai's premier property management company.",
};

export default function ListPropertyPage() {
    const benefits = [
        "Maximum Occupancy Rates",
        "Vetted Corporate Tenants",
        "Maintenance & Upkeep",
        "Zero-Hassle Management",
        "Transparent Financial Reporting",
        "Legal & Regulatory Compliance"
    ];

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Content */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">
                                Unlock Your Property's Potential
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Partner with {brand.name} for hassle-free property management and superior returns.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Why List With Us?</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-muted/50 p-6 rounded-2xl border border-border">
                            <h3 className="font-semibold mb-2">Our Promise</h3>
                            <p className="text-muted-foreground text-sm">
                                We treat your property like our own. From rigorous tenant screening to 24/7 maintenance, we handle everything so you can enjoy passive income.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Get Started</h2>
                            <p className="text-muted-foreground">
                                Fill out the form below and our team will get in touch with a free rental valuation.
                            </p>
                        </div>

                        <EnquiryForm
                            type="owner_submission"
                            className="space-y-4"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
