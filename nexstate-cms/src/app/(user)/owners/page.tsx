import { brand, telHref } from "@nexstate/brand";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Building2, 
    Calculator, 
    MessageSquare, 
    TrendingUp, 
    Phone, 
    Mail,
    CheckCircle,
    ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
    title: `Owner Portal | ${brand.name}`,
    description: "Property owner dashboard - manage your listings and track performance",
};

export default function OwnerPortalPage() {
    const services = [
        {
            icon: Building2,
            title: "Property Management",
            description: "End-to-end property management including tenant sourcing, maintenance, and rent collection.",
        },
        {
            icon: TrendingUp,
            title: "Performance Tracking",
            description: "Real-time insights into your property's occupancy rates, rental income, and market trends.",
        },
        {
            icon: Calculator,
            title: "ROI Analysis",
            description: "Comprehensive return on investment calculations to help you maximize your property's potential.",
        },
        {
            icon: MessageSquare,
            title: "Direct Communication",
            description: "Dedicated account manager for all your property-related queries and concerns.",
        },
    ];

    const benefits = [
        "Maximum occupancy rates with vetted corporate tenants",
        "Transparent monthly financial reports",
        "24/7 property maintenance support",
        "Legal and regulatory compliance handling",
        "Professional photography and listing optimization",
        "Flexible management fee structures",
    ];

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container px-4 md:px-6">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Owner Portal
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Maximize your property investment with {brand.name}'s professional management services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/list-property">
                            <Button size="lg" className="btn-primary">
                                <Building2 className="w-5 h-5 mr-2" />
                                List Your Property
                            </Button>
                        </Link>
                        <Link href="/tools/roi-calculator">
                            <Button size="lg" variant="outline">
                                <Calculator className="w-5 h-5 mr-2" />
                                Calculate ROI
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {services.map((service) => (
                        <Card key={service.title} className="text-center hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-lg">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{service.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Why Partner With {brand.name}?</h2>
                        <div className="space-y-4">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Quick ROI Overview</CardTitle>
                            <CardDescription className="text-white/70">
                                Sample calculation for a 1BR apartment in Dubai Marina
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between border-b border-white/20 pb-2">
                                <span className="text-white/80">Property Value</span>
                                <span className="font-bold">AED 1,200,000</span>
                            </div>
                            <div className="flex justify-between border-b border-white/20 pb-2">
                                <span className="text-white/80">Monthly Rent</span>
                                <span className="font-bold">AED 8,500</span>
                            </div>
                            <div className="flex justify-between border-b border-white/20 pb-2">
                                <span className="text-white/80">Occupancy Rate</span>
                                <span className="font-bold">92%</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-white/80">Net Annual Yield</span>
                                <span className="font-bold text-2xl text-amber-400">7.8%</span>
                            </div>
                            <Link href="/tools/roi-calculator" className="block mt-4">
                                <Button variant="secondary" className="w-full">
                                    Calculate Your ROI <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Section */}
                <Card className="bg-muted/50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                        <CardDescription>
                            Our team is here to help you maximize your property investment
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <Link href="/list-property">
                                <Button size="lg" className="btn-primary">
                                    Submit Your Property
                                </Button>
                            </Link>
                            <div className="flex items-center gap-6 text-sm">
                                {brand.contact.phone && (
                                    <a href={telHref() ?? undefined} className="flex items-center gap-2 hover:text-accent transition-colors">
                                        <Phone className="w-4 h-4" />
                                        {brand.contact.phone}
                                    </a>
                                )}
                                {brand.contact.ownersEmail && (
                                    <a href={`mailto:${brand.contact.ownersEmail}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                                        <Mail className="w-4 h-4" />
                                        {brand.contact.ownersEmail}
                                    </a>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
