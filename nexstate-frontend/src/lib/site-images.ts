/**
 * Site photography catalogue (see public/images/CREDITS.md for licences).
 * All files live in public/images/site as WebP; heroes are 2400px wide, the rest 1600px.
 * Use with next/image: <Image {...imageProps(siteImages.heroVilla)} sizes="..." />
 * blurDataURL is a 16px preview so photos fade in instead of popping.
 */
export interface SiteImage {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL: string;
    credit: { name: string; url: string };
}

export function imageProps(img: SiteImage) {
    return { src: img.src, alt: img.alt, width: img.width, height: img.height, placeholder: "blur" as const, blurDataURL: img.blurDataURL };
}

/** For <Image fill>: same as imageProps without the intrinsic size (fill and width/height are mutually exclusive). */
export function fillProps(img: SiteImage) {
    return { src: img.src, alt: img.alt, placeholder: "blur" as const, blurDataURL: img.blurDataURL };
}

export const siteImages = {
    heroVilla: {
        src: "/images/site/hero-villa.webp",
        alt: "Modern white villa with a timber-lined terrace and swimming pool",
        width: 2400,
        height: 1600,
        blurDataURL: "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADwAQCdASoQAAsAA4BaJaACdAEQNn+DXwAA/Gf/VsvhwTVFwOGm0JOQY2Oex5/FOZqdpfiI84EM43G6dq3Q8BLB5dgW8De/dXfw/ZnIRHJQYw//Z6cLWasAhcyYY/SO8QYwQAAA",
        credit: { name: "Avi Werde", url: "https://unsplash.com/photos/white-and-brown-concrete-building-hHz4yrvxwlA" },
    },
    villaWhite: {
        src: "/images/site/villa-white.webp",
        alt: "Contemporary villa with glass walls beside a pool",
        width: 1600,
        height: 1200,
        blurDataURL: "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADwAQCdASoQAAwAA4BaJYgCdAC3TpEZcgAA/tPdT4un89CdANpNly24PZOal1/oBRIPPZWrw6R5elDmhpXvgmh7+Kyev20sQ+xIHLP3G0PduYd8XpiuOEa0I2cjcrKN4cpgt3ZICSJs1wAA",
        credit: { name: "Ярослав Алексеенко", url: "https://unsplash.com/photos/white-and-brown-concrete-building-under-blue-sky-during-daytime-_TPTXZd9mOo" },
    },
    villaPool: {
        src: "/images/site/villa-pool.webp",
        alt: "White modern house with a rooftop terrace and pool",
        width: 1600,
        height: 1061,
        blurDataURL: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwAgCdASoQAAsAA4BaJbACdAYv1gVfaYdeAAD+YTo+qR9Ak25DEFcGSBI+LGE0H67eYu7vd0modGnkL/O4iOg+5xpYq3/5uR+97WNUiyTW3CmtnQZ8Si4B7WLYAAAA",
        credit: { name: "Frames For Your Heart", url: "https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-mR1CIDduGLc" },
    },
    villaGarden: {
        src: "/images/site/villa-garden.webp",
        alt: "Single-storey modern house with sliding glass doors",
        width: 1600,
        height: 1067,
        blurDataURL: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACQAgCdASoQAAsAA4BaJbACdAYtVuPKPPdFan5FAAD+lIkYHCuySZP47Vh231ofRYX7ed9//NnXr/5uCsEuJyYEnPdDpVADHjLuxseadcLLN/oOnv6yHSGkuM7Emw/Z9MHN7AbspPhySg6QAAA=",
        credit: { name: "Frames For Your Heart", url: "https://unsplash.com/photos/white-and-grey-concrete-building-near-swimming-pool-under-clear-sky-during-daytime-2d4lAQAlbDA" },
    },
    livingGreen: {
        src: "/images/site/living-green.webp",
        alt: "Living room with a deep green sofa and tall windows",
        width: 1600,
        height: 1000,
        blurDataURL: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAoAA4BaJQBOgB3zAVuGi+AA/j4csvLYR3MudnEQHJyItfNRa9ERi1KOYRyICX1XouEZeb0YjD941jqQ6BtcvmNEbT77BkXXtwAA",
        credit: { name: "Prydumano Design", url: "https://unsplash.com/photos/a-living-room-with-a-large-green-couch-VZ2z8ozzy10" },
    },
    livingMarble: {
        src: "/images/site/living-marble.webp",
        alt: "Living room with a marble feature wall and large windows",
        width: 1600,
        height: 1067,
        blurDataURL: "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAgCdASoQAAsAA4BaJQBWAP4EXaXx45m7YAD88EKwS/m69zF8WaeWX4woC8v4Tm12LGwvpeUmyO6G9ha6qzhpXWstyEjbowLxPvr3TyJOcnBUB5/FIEpAAAA=",
        credit: { name: "Aalo Lens", url: "https://unsplash.com/photos/modern-living-room-with-large-windows-and-comfortable-seating-LqGf5UvHCZ8" },
    },
    livingWarm: {
        src: "/images/site/living-warm.webp",
        alt: "Warmly lit open-plan living room and kitchen",
        width: 1600,
        height: 900,
        blurDataURL: "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAQCdASoQAAkAA4BaJQBOgB4bdVflAAD9nV7IsL7UyZW2za93k7us2vmrrKH9wflUowpHf67ibTk86Bxm9j0mwJutuCJ4kTzOy+agAAA=",
        credit: { name: "Christian", url: "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-kitchen-DS9Xc7AWmwQ" },
    },
    livingChandelier: {
        src: "/images/site/living-chandelier.webp",
        alt: "Elegant living room with a crystal chandelier",
        width: 1600,
        height: 900,
        blurDataURL: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAQCdASoQAAkAA4BaJQBOgBhzWTaovAD+rfBycUliCtQGODKUmZjKLErHlx/UoY403zHyyfjzt9QskiljKknpdLsX9jsqK0b6qtv3OxKccW3lT4VAAA==",
        credit: { name: "Aalo Lens", url: "https://unsplash.com/photos/modern-living-room-with-elegant-furniture-and-decor--QCjahEjubY" },
    },
    bedroomTufted: {
        src: "/images/site/bedroom-tufted.webp",
        alt: "Bedroom with a tufted headboard and warm lamps",
        width: 1600,
        height: 1067,
        blurDataURL: "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACwAQCdASoQAAsAA4BaJYwCdAB3E/9AAP7XcbcV4RcN0QtWcYFNTxQn7BvdckLVAN/eo7yWzJ0KVxo/R9QQjF+BvEl70d+9F6E6J+PxF8tbDQlJkFChJP27B8ylyPqgAAA=",
        credit: { name: "Quilia", url: "https://unsplash.com/photos/tufted-bed-in-modern-bedroom-iAftdIcgpFc" },
    },
    bedroomStudio: {
        src: "/images/site/bedroom-studio.webp",
        alt: "Bright studio bedroom with a work desk",
        width: 1600,
        height: 1067,
        blurDataURL: "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACwAQCdASoQAAsAA4BaJYwC7ACTDwPIAP7Vl8dTawopSAeN/jvr2K9/EsRgMrxlFWiDyRSiGQeKyOnaaRecpgwdAAA=",
        credit: { name: "Lotus Design N Print", url: "https://unsplash.com/photos/a-bedroom-with-a-bed-desk-and-a-window-WDUtNbot6Qw" },
    },
    kitchen: {
        src: "/images/site/kitchen.webp",
        alt: "Modern white kitchen with an island",
        width: 1600,
        height: 1067,
        blurDataURL: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAsAA4BaJYwAAgUz8Fb0HAD9+GnlWxHV1RKgTtKGDda5IjjwpPE8UloKUBG9FUA4JNod9zsaEHMmPOmEAA==",
        credit: { name: "Gerda Kauks", url: "https://unsplash.com/photos/a-kitchen-with-a-refrigerator-freezer-sitting-next-to-a-counter-KYM5QsbRsxk" },
    },
    cityMumbai: {
        src: "/images/site/city-mumbai.webp",
        alt: "Mumbai skyline of residential towers",
        width: 1600,
        height: 900,
        blurDataURL: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAkAA4BaJQBOgCP7ixvDwAD+7Zx/tEgSX6JF03HuhakffUvHoTqIInulyu+FeoTv5iW++MvTmyEFyAxqlkUyIzQAAA==",
        credit: { name: "Drone Master", url: "https://unsplash.com/photos/a-city-skyline-with-tall-buildings-and-skyscrapers-qrj4LiT9NRQ" },
    },
    cityMumbaiGateway: {
        src: "/images/site/city-mumbai-gateway.webp",
        alt: "Gateway of India and the Taj Mahal Palace, Mumbai",
        width: 2400,
        height: 1800,
        blurDataURL: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAwAA4BaJagCdAEMPQAmAAD6XxWSgI0Cs0FfU6xIiRzbZqTRJ/o7qcsLCR7sUKD0PrUHIzPDfjKvm802AAAA",
        credit: { name: "Renzo D'souza", url: "https://unsplash.com/photos/gateway-of-india-and-taj-mahal-MxabbMSLr_M" },
    },
    cityBengaluru: {
        src: "/images/site/city-bengaluru.webp",
        alt: "Bengaluru neighbourhood rooftops at sunset",
        width: 1600,
        height: 2193,
        blurDataURL: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAABQBACdASoQABYAPu1iqU2ppaOiMAgBMB2JYgCsIKnC4ED8elSyfcnfQHwYAOEZ2sL8Ax3h4RcQ93BOwMG81ciHD3bCQH+4b8cf8sp1igcmVYsBObg9xt6Psplf2TH3sJOZvOxEmfpNb5cj/0X0ZW+qx20+noW9MxZevKOBiOMpSi39RwJwjAAA",
        credit: { name: "Vishwanth Pindiboina", url: "https://unsplash.com/photos/high-rise-buildings-under-blue-sky-during-daytime-TRQI0gycN2c" },
    },
    cityGoa: {
        src: "/images/site/city-goa.webp",
        alt: "Colourful beach cottages under palm trees in Goa",
        width: 1600,
        height: 1200,
        blurDataURL: "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAACQAQCdASoQAAwAA4BaJbACdABGiwAA/q+XRYXtRR/lMWUak/K/+sKjARnAs0lOgYTtlK7VvNxXB2F1n1J6qW6ac7rGPaMVO76AlOeBy9eOFaU3aQaOY6J0wAA=",
        credit: { name: "Raja Sen", url: "https://unsplash.com/photos/blue-and-brown-wooden-houses-near-palm-trees-under-blue-sky-during-daytime-FYos6AbcDsY" },
    },
    cityGoaSunset: {
        src: "/images/site/city-goa-sunset.webp",
        alt: "Palm tree silhouetted against a Goa sunset",
        width: 2400,
        height: 1603,
        blurDataURL: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADQAQCdASoQAAsAA4BaJbACdADM8JsfYAD9AMI3WP/7Z1Ktu4z97vVCMjJNH9/p07gO0Ic6JC2NBvtt0vIka5IDDrfZ0hz5Xz99J7dkmLKQsOBWp1LVoUlz6qlOYIAA",
        credit: { name: "Ashutosh Saraswat", url: "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8" },
    },
    cityDelhi: {
        src: "/images/site/city-delhi.webp",
        alt: "India Gate under a pink dusk sky, New Delhi",
        width: 1600,
        height: 1067,
        blurDataURL: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACQAQCdASoQAAsAA4BaJbACdABanTwA9p3X9S5F73vYLCUnBf0PC249kI9D3f8qo7IjheZf9KShRZb1WfBXPVychyTuSmhO17EHIjqh8UAAAA==",
        credit: { name: "shalender kumar", url: "https://unsplash.com/photos/india-gate-war-memorial-in-new-delhi-XjKaPInYVCM" },
    },
    cityHyderabad: {
        src: "/images/site/city-hyderabad.webp",
        alt: "Charminar against a blue sky, Hyderabad",
        width: 1600,
        height: 2131,
        blurDataURL: "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAABwBACdASoQABUAPu1iqU2ppaQiMAgBMB2JbACdMoR4OsAAxf9jQ99lYigC8AD6YMaMAyzPtxwtxKE4Thju8J163+RaH2Ox3+EGE3ppq+ZhlRmJm5jJ/6R86YvBm3XiZVnXctbKMs6KjfoIC3Dgf2XAV67+3QzfKHjlVjP2aCWyg3o5FvVeGbcv82YAyppOrEnWj0UAAAA=",
        credit: { name: "Swipe", url: "https://unsplash.com/photos/charminar-monument-in-hyderabad-F-LVLE4r7sA" },
    },
    cityPune: {
        src: "/images/site/city-pune.webp",
        alt: "Stone fort wall along a green ridge near Pune",
        width: 1600,
        height: 2886,
        blurDataURL: "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABQBACdASoQAB0APu1iqU2ppaQiMAgBMB2JbACdLwJ6SBDbYXjdkXhqyO7IAP5rWls3ae9T1QsxkTSsxJH8KKVMnbQLiesDNOsd4GK0fpW0QrMkAg/tAMeROt8vn6Mym1q64zX+XDHS232pEv5s1FE8c6zw35SjlOwK6+ME6nojesgXrl6ZWjDyYxbEUMAA",
        credit: { name: "Sachin Tandale", url: "https://unsplash.com/photos/stone-fortification-on-green-mountain-ridge-QQlWHehI0ts" },
    },
} satisfies Record<string, SiteImage>;

/** City cards: name, state, a one-line hook, and the photo. Order is the display order. */
export const cityImages = [
    { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", blurb: "Garden city, tech capital", image: siteImages.cityBengaluru },
    { slug: "mumbai", name: "Mumbai", state: "Maharashtra", blurb: "Sea views and skyline living", image: siteImages.cityMumbai },
    { slug: "goa", name: "Goa", state: "Goa", blurb: "Villas a walk from the beach", image: siteImages.cityGoa },
    { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi", blurb: "Heritage streets, modern towers", image: siteImages.cityDelhi },
    { slug: "hyderabad", name: "Hyderabad", state: "Telangana", blurb: "Old city charm, new city comfort", image: siteImages.cityHyderabad },
    { slug: "pune", name: "Pune", state: "Maharashtra", blurb: "Green hills, calm neighbourhoods", image: siteImages.cityPune },
] as const;

/** The marketing photo for a city name as stored in listings ("Mumbai", "Delhi"); falls back to the hero villa. */
export function cityImageFor(city: string): SiteImage {
    const c = city.trim().toLowerCase();
    const hit = cityImages.find((x) => x.name.toLowerCase() === c || x.name.toLowerCase().startsWith(c) || c.startsWith(x.name.toLowerCase().split(" ")[0]));
    return hit ? hit.image : siteImages.heroVilla;
}
