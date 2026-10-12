/**
 * ============================================================================
 *  BRAND CONFIG: the one file to edit when white-labelling for a new agency.
 * ============================================================================
 *
 *  Both apps (nexstate-cms, nexstate-frontend) import `brand` from here, so
 *  every name, contact detail, link and headline figure below changes
 *  everywhere at once. Optional values: leave a string empty ("") and the
 *  corresponding UI element is hidden rather than showing a placeholder.
 *
 *  Not in this file (configure elsewhere):
 *   - Colours / fonts: each app's globals.css theme tokens
 *   - Logo: nexstate-cms/src/assets/images/logo.webp, nexstate-frontend/public/
 *   - Secrets and URLs: environment variables (see .env.example in each app)
 */

export const brand = {
    /** Display name used in headers, titles, emails and body copy. */
    name: "NexState",
    /** Registered company name, used in legal text and footers. */
    legalName: "NexState Real Estate",
    /** Wordmark split for the two-tone header logo: "Nex" + "State". */
    wordmark: { primary: "Nex", accent: "State" },
    /** Short one-liner under the logo and in link previews. */
    tagline: "Premium furnished rentals and property management",
    /** Default meta description (<= 160 chars). */
    description:
        "Find fully furnished apartments, villas and co-living homes with flexible leases, AI-powered property matching and hassle-free property management.",

    /**
     * Hex colour used for the generated favicon / app icons and the browser theme colour.
     * Keep it in step with the --primary token in each app's globals.css.
     */
    themeColor: "#2b4fa6",

    /** Public site URL of the frontend. Overridden by NEXT_PUBLIC_SITE_URL when set. */
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://nexstate.ai",

    /** Where the agency operates. Drives currency formatting and "in <city>" copy. */
    market: {
        city: "Dubai",
        country: "United Arab Emirates",
        currency: "AED",
        locale: "en-AE",
    },

    contact: {
        /** Shown in footers and the contact page. "" hides it. */
        email: "contact@nexstate.ai",
        ownersEmail: "owners@nexstate.ai",
        phone: "",
        /** Digits only with country code, e.g. "971501234567". Used for tel: links. "" disables. */
        phoneDigits: "",
        address: "",
        /** Google Maps embed URL (Share > Embed a map > copy the src). "" hides the map. */
        mapEmbedUrl: "",
    },

    /** Social profile URLs. Empty strings hide the icon. */
    social: {
        instagram: "",
        x: "",
        linkedin: "",
        facebook: "",
    },

    /**
     * Regulator / licence badge ("RERA Licensed", etc). Only show it if the
     * agency actually holds the licence. Empty label hides every badge.
     */
    licenseBadge: "",

    /** Prefix for generated order numbers, e.g. NS-<timestamp>-<random>. */
    orderPrefix: "NS",

    /** Name of the two service tiers shown on the tenant page. */
    tiers: {
        standard: "Standard",
        select: "Select",
    },

    /**
     * Headline figures used in marketing copy. These are DEMO values; each
     * agency must replace them with figures it can substantiate.
     */
    claims: {
        /** Owner-page headline: extra rental yield versus a traditional lease. */
        yieldUplift: "30%",
        /** Portfolio value on the owner consultation page, e.g. "AED 2.5B+". "" hides the stat. */
        assetsManaged: "AED 2.5B+",
        /** Typical occupancy shown on owner pages. */
        occupancy: "98%",
        /** Longest lease offered to owners, in years. */
        maxLeaseYears: 5,
        /** Maintenance response window shown to tenants. */
        maintenanceSla: "24 to 72 hours",
    },
};

export type Brand = typeof brand;

/** Small helpers that keep JSX readable. */
export const brandName = brand.name;
export const brandNameUpper = brand.name.toUpperCase();

/** Builds a tel: href, or null when no phone is configured. */
export function telHref(): string | null {
    return brand.contact.phoneDigits ? `tel:+${brand.contact.phoneDigits}` : null;
}

/** Social links that are configured, in display order. */
export function socialLinks(): { key: keyof typeof brand.social; url: string }[] {
    return (Object.keys(brand.social) as (keyof typeof brand.social)[])
        .map((key) => ({ key, url: brand.social[key] as string }))
        .filter((s) => s.url);
}
