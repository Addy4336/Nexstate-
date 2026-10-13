/**
 * DEMO CONTENT. Replace with real material before launch.
 * Keeping it in one file means a new client only edits this (and the brand config).
 * Everything here is fictional and rendered with a visible "sample" label.
 */
import { siteImages, type SiteImage } from "./site-images";

export interface DemoReview {
    quote: string;
    name: string;
    role: string;
    city: string;
}

export const demoReviews: DemoReview[] = [
    {
        quote: "I landed in Bengaluru on a Sunday and had keys by Tuesday. The flat was furnished properly: good mattress, working kitchen, fast Wi-Fi. No haggling over the deposit either.",
        name: "Ananya Rao",
        role: "Product designer, tenant",
        city: "Bengaluru",
    },
    {
        quote: "We handed over our Candolim villa expecting the usual headaches. Statements arrive on the 1st, repairs are logged and closed, and the occupancy is better than when we managed it ourselves.",
        name: "Rohan & Meera Kulkarni",
        role: "Villa owners",
        city: "Goa",
    },
    {
        quote: "Booked a month near Bandra for a project. The price on the page was the price I paid, GST included, and the host answered every question the same day.",
        name: "Imran Sheikh",
        role: "Film editor, tenant",
        city: "Mumbai",
    },
];

export interface HowStep {
    title: string;
    body: string;
    image: SiteImage;
}

export const howSteps: HowStep[] = [
    {
        title: "Tell us what you need",
        body: "Pick a city, a budget and how many bedrooms. Or describe it in your own words and the AI assistant shortlists homes that fit.",
        image: siteImages.livingMarble,
    },
    {
        title: "See the real price, then reserve",
        body: "Check live availability for your dates and get an itemised quote: rent, GST, fees and deposit, all upfront. Pay securely online; UPI, cards and netbanking are supported.",
        image: siteImages.kitchen,
    },
    {
        title: "Move in and relax",
        body: "The home is cleaned, furnished and ready. If anything needs fixing, one message gets it logged and handled within the service window.",
        image: siteImages.bedroomTufted,
    },
];

export interface WhyTile {
    title: string;
    body: string;
}

export const whyTiles: Record<"furnished" | "flexible" | "pricing" | "managed" | "booking", WhyTile> = {
    furnished: {
        title: "Furnished to the last cushion",
        body: "Beds, sofas, kitchenware, linen and Wi-Fi. Bring a suitcase, not a truck.",
    },
    flexible: {
        title: "Stay for a month or for years",
        body: "Short stays, monthly rentals and long leases on the same home, priced by the night, never by surprise.",
    },
    pricing: {
        title: "One honest price",
        body: "Rent, GST, fees and deposit are itemised before you pay. The total you see is the total you are charged.",
    },
    managed: {
        title: "Looked after properly",
        body: "Cleaning, repairs and tenant support are handled by one team, so owners stay hands-off and residents get answers.",
    },
    booking: {
        title: "Book in minutes",
        body: "Live availability and instant online payment. Your dates are held the moment you pay.",
    },
};
