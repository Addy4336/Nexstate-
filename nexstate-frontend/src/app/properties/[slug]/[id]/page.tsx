import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowRight, Bath, BedDouble, Building2, ChevronRight, MapPin, Maximize2, Sofa } from "lucide-react";
import { brand, formatMoney } from "@nexstate/brand";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/layout/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Gallery } from "@/components/property/detail/Gallery";
import { Booking } from "@/components/property/detail/Booking";
import { ShareButton } from "@/components/property/detail/ShareButton";
import { ExpandableText } from "@/components/property/detail/ExpandableText";
import { amenityIcon } from "@/lib/amenity-icons";
import { apiGet } from "@/lib/server-api";
import { locationSlug } from "@/lib/slug";
import { toPropertyDetail } from "@/lib/property-detail";
import type { Property } from "@/types/property";

interface PageProps {
    params: Promise<{ slug: string; id: string }>;
}

// Availability must be fresh, so the property itself is never cached.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProperty = cache(async (id: string) => apiGet<any | null>(`/properties/${encodeURIComponent(id)}`, null, 0));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const raw = await getProperty(id);
    if (!raw) return { title: "Home not found" };
    const p = toPropertyDetail(raw);
    const description =
        p.description.slice(0, 155) || `Furnished ${p.bedrooms}-bedroom home in ${p.location}, ${formatMoney(p.price)} per month.`;
    return {
        title: `${p.title}, ${p.area}`,
        description,
        openGraph: { title: p.title, description, images: p.images[0] ? [p.images[0]] : undefined },
    };
}

function Fact({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-4 md:px-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-forest">
                <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span>
                <span className="block text-xs text-stone">{label}</span>
                <span className="block whitespace-nowrap font-medium text-ink">{value}</span>
            </span>
        </div>
    );
}

export default async function PropertyPage({ params }: PageProps) {
    const { id } = await params;
    const raw = await getProperty(id);
    if (!raw) notFound();
    const p = toPropertyDetail(raw);

    // Similar homes: same city first, then the rest.
    const all = await apiGet<Property[]>("/properties?limit=50", [], 60);
    const similar = all
        .filter((x) => x.id !== p.id)
        .sort((a, b) => Number(b.location.includes(p.city)) - Number(a.location.includes(p.city)))
        .slice(0, 3);

    const facts = [
        { icon: BedDouble, label: "Bedrooms", value: String(p.bedrooms) },
        { icon: Bath, label: "Bathrooms", value: String(p.bathrooms) },
        p.areaSqft ? { icon: Maximize2, label: "Area", value: `${p.areaSqft.toLocaleString("en-IN")} sq ft` } : null,
        p.propertyType ? { icon: Building2, label: "Type", value: p.propertyType } : null,
        { icon: Sofa, label: "Furnishing", value: p.furnishing ? p.furnishing.replace(/^\w/, (c) => c.toUpperCase()) : "Fully furnished" },
    ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string }[];

    const glance = [
        { label: "Monthly rent", value: formatMoney(p.price) },
        { label: brand.market.taxLabel, value: `${p.fees.taxRate}% on rent` },
        p.fees.securityDeposit > 0 ? { label: "Security deposit", value: `${formatMoney(p.fees.securityDeposit)}, refundable` } : null,
        p.fees.exitCleaningFee > 0 ? { label: "Exit cleaning", value: formatMoney(p.fees.exitCleaningFee) } : null,
        p.fees.bookingFee > 0 ? { label: "Booking fee", value: formatMoney(p.fees.bookingFee) } : null,
        { label: "Minimum stay", value: `${brand.booking.minNights} nights` },
    ].filter(Boolean) as { label: string; value: string }[];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": p.propertyType && /villa|house/i.test(p.propertyType) ? "House" : "Apartment",
        name: p.title,
        description: p.description || undefined,
        image: p.images.slice(0, 5),
        numberOfRooms: p.bedrooms,
        numberOfBathroomsTotal: p.bathrooms,
        floorSize: p.areaSqft ? { "@type": "QuantitativeValue", value: p.areaSqft, unitCode: "FTK" } : undefined,
        address: { "@type": "PostalAddress", addressLocality: p.area, addressRegion: p.city || undefined, addressCountry: "IN" },
        amenityFeature: p.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    };

    return (
        <main className="pb-28 lg:pb-0">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

            {/* Title + gallery */}
            <Container className="pt-28 md:pt-32">
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-stone">
                    <Link href="/properties" className="hover:text-ink">
                        Homes
                    </Link>
                    {p.city && (
                        <>
                            <ChevronRight className="size-3.5" aria-hidden="true" />
                            <Link href={`/properties?location=${encodeURIComponent(p.city)}`} className="hover:text-ink">
                                {p.city}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                    <Link href={`/properties/${locationSlug(p.location)}`} className="hover:text-ink">
                        {p.area}
                    </Link>
                </nav>

                <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        {p.propertyType && <Eyebrow>{p.propertyType}</Eyebrow>}
                        <h1 className="text-headline mt-3 max-w-3xl">{p.title}</h1>
                        <p className="mt-3 flex items-center gap-1.5 text-stone">
                            <MapPin className="size-4" aria-hidden="true" />
                            {p.location}
                        </p>
                    </div>
                    <ShareButton title={p.title} />
                </div>

                <div className="mt-8">
                    <Gallery images={p.images} title={p.title} />
                </div>
            </Container>

            {/* Details + booking */}
            <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-14">
                <div className="space-y-14 lg:col-span-7">
                    <Reveal>
                        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 [&>*]:-mb-px [&>*]:-mr-px [&>*]:border-b [&>*]:border-r [&>*]:border-line">
                            {facts.map((f) => (
                                <Fact key={f.label} {...f} />
                            ))}
                        </div>
                    </Reveal>

                    {p.description && (
                        <section aria-labelledby="about">
                            <h2 id="about" className="text-title">
                                About this home
                            </h2>
                            <div className="mt-4">
                                <ExpandableText text={p.description} />
                            </div>
                        </section>
                    )}

                    {p.amenities.length > 0 && (
                        <section aria-labelledby="amenities">
                            <h2 id="amenities" className="text-title">
                                What this home offers
                            </h2>
                            <RevealGroup className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2" stagger={0.05}>
                                {p.amenities.map((a) => {
                                    const Icon = amenityIcon(a);
                                    return (
                                        <RevealItem key={a} className="flex items-center gap-3 border-b border-line pb-4">
                                            <Icon className="size-5 shrink-0 text-brass-deep" aria-hidden="true" />
                                            <span className="text-[15px] text-ink">{a}</span>
                                        </RevealItem>
                                    );
                                })}
                            </RevealGroup>
                        </section>
                    )}

                    <section aria-labelledby="pricing">
                        <h2 id="pricing" className="text-title">
                            Pricing at a glance
                        </h2>
                        <p className="mt-2 text-sm text-stone">
                            Choose your dates to see the exact total. What you see there is what you pay.
                        </p>
                        <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
                            {glance.map((g) => (
                                <div key={g.label} className="flex items-center justify-between gap-4 px-5 py-4">
                                    <dt className="text-stone">{g.label}</dt>
                                    <dd className="text-right font-medium text-ink">{g.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section aria-labelledby="where">
                        <h2 id="where" className="text-title">
                            Where you&apos;ll be
                        </h2>
                        <p className="mt-2 text-stone">
                            {p.area}
                            {p.city && `, ${p.city}`}. The exact address is shared after booking.
                        </p>
                        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-sand">
                            <iframe
                                title={`Map of ${p.location}`}
                                src={`https://www.google.com/maps?q=${encodeURIComponent(p.location)}&z=13&output=embed`}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="block h-[320px] w-full border-0 grayscale-[35%]"
                            />
                        </div>
                        <Link
                            href={`/properties/${locationSlug(p.location)}`}
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest underline decoration-brass underline-offset-4"
                        >
                            More homes in {p.area} <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </section>
                </div>

                <aside className="lg:col-span-5 xl:col-span-4 xl:col-start-9" aria-label="Book this home">
                    <Booking property={p} />
                </aside>
            </Container>

            {similar.length > 0 && (
                <Section tone="sand">
                    <SectionHeading
                        eyebrow="You might also like"
                        title="More homes *nearby*"
                        actions={
                            <Button asChild size="pill" variant="outline-dark">
                                <Link href="/properties">
                                    All homes <ArrowRight />
                                </Link>
                            </Button>
                        }
                    />
                    <RevealGroup className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
                        {similar.map((s) => (
                            <RevealItem key={s.id}>
                                <PropertyCard property={s} />
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </Section>
            )}
        </main>
    );
}
