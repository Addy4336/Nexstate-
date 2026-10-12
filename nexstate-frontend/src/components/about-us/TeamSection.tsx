import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
    {
        name: "Riya - The Sales & Guide AI",
        role: "Instant bookings, zero waiting. I help you find and tour your dream home in seconds, 24/7.",
        image: "/images/avatar-riya.jpg",
        slug: "sales-guide-ai"
    },
    {
        name: "Maya - The Maintenance AI",
        role: "I handle repairs instantly. Report an issue, and I dispatch solutions immediately—no follow-ups needed.",
        image: "/images/avatar-maya.jpg",
        slug: "maintenance-ai"
    },
    {
        name: "Zia - The Management AI",
        role: "I protect your investment. I track ROI in real-time and ensure 100% operational efficiency for owners.",
        image: "/images/avatar-zia.jpg",
        slug: "management-ai"
    }
];

const TeamSection = () => {
    return (
        <section className="bg-background py-16 md:py-28 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col mb-12 md:mb-16">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                            For Sellers
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-6 tracking-[-0.02em]">
                        Agents who go further for <span className="font-serif italic">you</span>
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.7] max-w-[600px]">
                        Our goal is to provide clients with an exceptional real estate experience, offering top-tier service every step of the way.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="group flex flex-col h-full">
                            {/* Image */}
                            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl mb-4">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>

                            {/* Info Card */}
                            <div className="flex items-start border border-border group-hover:bg-primary/10 transition-colors duration-300 justify-between bg-card rounded-2xl p-4 shadow-sm min-h-[120px] flex-1">
                                <div className="flex flex-col flex-1 pr-3">
                                    <h3 className="text-foreground text-[18px] md:text-[20px] font-medium mb-1">
                                        {member.name}
                                    </h3>
                                    <span className="text-muted-foreground text-[14px] line-clamp-3">
                                        {member.role}
                                    </span>
                                </div>

                                {/* Arrow Button */}
                                <Link
                                    href={`/team/${member.slug}`}
                                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-border hover:bg-secondary/20 hover:border-foreground hover:text-background transition-all duration-300 group/btn"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-foreground group-hover/btn:text-foreground transition-colors"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
