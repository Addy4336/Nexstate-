import WhyNexState from "./WhyNexState";
import ThreeTypes from "./ThreeTypes";
import AILayer from "./AILayer";
import ResidentsVsOwners from "./ResidentsVsOwners";
import Credibility from "./Credibility";
import { NumberTicker } from "../ui/number-ticker";
import { Separator } from "../ui/separator";
import Properties from "@/app/properties/page";

export default function DetailedContent() {
    return (
        <div className="flex flex-col w-full">
            <ThreeTypes />
            <Properties />
            <WhyNexState />
            
            <div className="bg-muted/30 px-5 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14">
                    <div className="flex flex-wrap lg:flex-nowrap justify-between gap-y-8">
                        {[
                            { value: 98, suffix: "%", label: "Occupancy Rate" },
                            { value: 500, suffix: "+", label: "Rooms Managed" },
                            { value: 1500, suffix: "+", label: "Active Tenants" },
                            { value: 4, suffix: ".8/5", label: "Tenant Rating" }
                        ].map((stat, idx) => (
                            <div key={idx} className="flex items-center w-1/2 lg:w-auto">
                                {idx !== 0 && (
                                    <Separator orientation="vertical" className="h-16 sm:h-20 lg:h-24 mr-4 sm:mr-6 lg:mr-10 hidden lg:block" />
                                )}
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight">
                                        <NumberTicker value={stat.value} />{stat.suffix}
                                    </h4>
                                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            {/* <ResidentsVsOwners /> */}
            {/* <AILayer /> */}
            <Credibility />
        </div>
    );
}
