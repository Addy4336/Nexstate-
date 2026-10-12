import { Award, Building2, MapPin, ShieldCheck } from "lucide-react";

export default function Credibility() {
    const stats = [
        {
            icon: <Award className="w-8 h-8 text-primary mb-4" />,
            value: "Years",
            label: "of operating experience in property management & hospitality"
        },
        {
            icon: <Building2 className="w-8 h-8 text-primary mb-4" />,
            value: "1000s",
            label: "of tenant nights hosted, proving operational consistency"
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary mb-4" />,
            value: "Local",
            label: "Strong team on the ground in Dubai combining tech & hospitality"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary mb-4" />,
            value: "Compliance",
            label: "Deep understanding of Dubai regulations & leasing laws"
        }
    ];

    return (
        <section className="py-20 bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Credibility & Track Record</h2>
                    <p className="text-muted-foreground">Built on a foundation of experience and trust.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                            {stat.icon}
                            <span className="text-3xl font-bold text-foreground mb-2">{stat.value}</span>
                            <span className="text-sm text-muted-foreground leading-relaxed">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
