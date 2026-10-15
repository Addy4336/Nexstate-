import Image from "next/image";
import Link from "next/link";
import { addDays, parseISO } from "date-fns";
import { Bath, BedDouble, CalendarClock, MapPin, Maximize2 } from "lucide-react";
import { brand, formatMoney } from "@nexstate/brand";
import { getPropertyImage } from "@/components/tenants/PropertyCard";
import { locationSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

interface PropertyCardProps {
    property: Property;
    /** Classes for the outer link (width etc). */
    className?: string;
    /** Classes for the photo frame, e.g. to fix its height in a pinned row. */
    imageClassName?: string;
    sizes?: string;
    priority?: boolean;
}

/** Availability pill. "Booked" only carries a date, never anything about who booked. */
function Status({ property }: { property: Property }) {
    const rented = property.is_currently_rented || property.status === "rented";
    const label = rented ? "Booked" : property.featured ? "Featured" : "Available";
    return (
        <span
            className={cn(
                "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md",
                rented ? "bg-ink/70 text-ivory" : "bg-ivory/90 text-ink"
            )}
        >
            <span className={cn("size-1.5 rounded-full", rented ? "bg-brass" : "bg-emerald-600")} />
            {label}
        </span>
    );
}

/** First day a booked home is free again (the API only exposes the booking end date, never who booked). */
function availableFrom(property: Property): string | null {
    if (!property.is_currently_rented || !property.rented_until) return null;
    const end = parseISO(property.rented_until);
    if (Number.isNaN(end.getTime())) return null;
    return addDays(end, 1).toLocaleDateString(brand.market.locale, { day: "numeric", month: "short", year: "numeric" });
}

/** The one property card used across the site: photo-led, price in the market currency, key facts underneath. */
export function PropertyCard({ property, className, imageClassName, sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw", priority }: PropertyCardProps) {
    const href = `/properties/${locationSlug(property.location)}/${property.id}`;
    return (
        <Link
            href={href}
            className={cn(
                "group block rounded-[1.25rem] outline-offset-4",
                className
            )}
        >
            <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-sand", imageClassName)}>
                <Image
                    src={getPropertyImage(property)}
                    alt={property.title}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.06]"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />
                <Status property={property} />
                <p className="absolute bottom-4 left-4 rounded-full bg-ivory/95 px-3.5 py-1.5 text-sm font-semibold text-ink shadow-soft">
                    {formatMoney(property.price)}
                    <span className="font-normal text-stone"> / month</span>
                </p>
            </div>

            <div className="px-1 pt-4">
                <h3 className="font-serif text-xl leading-snug tracking-tight text-ink transition-colors group-hover:text-forest-700 line-clamp-1">
                    {property.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-stone">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="line-clamp-1">{property.location}</span>
                </p>
                <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/80">
                    <li className="flex items-center gap-1.5">
                        <BedDouble className="size-4 text-brass-deep" aria-hidden="true" />
                        {property.bedrooms} <span className="sr-only">bedrooms</span>
                        <span aria-hidden="true">bd</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                        <Bath className="size-4 text-brass-deep" aria-hidden="true" />
                        {property.bathrooms} <span className="sr-only">bathrooms</span>
                        <span aria-hidden="true">ba</span>
                    </li>
                    {property.area_sqft ? (
                        <li className="flex items-center gap-1.5">
                            <Maximize2 className="size-4 text-brass-deep" aria-hidden="true" />
                            {property.area_sqft.toLocaleString("en-IN")} sq ft
                        </li>
                    ) : null}
                </ul>
                {availableFrom(property) && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-medium text-brass-deep">
                        <CalendarClock className="size-3.5" aria-hidden="true" />
                        Available from {availableFrom(property)}
                    </p>
                )}
            </div>
        </Link>
    );
}
