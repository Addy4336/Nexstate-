import {
    AirVent,
    Baby,
    Bath,
    BatteryCharging,
    Car,
    CircleCheck,
    Cpu,
    Dumbbell,
    Fence,
    Flame,
    Laptop,
    Mountain,
    PawPrint,
    Shield,
    Shirt,
    Sofa,
    Sprout,
    Tv,
    Utensils,
    Waves,
    Wifi,
    type LucideIcon,
} from "lucide-react";

/** Keyword -> icon. Amenities are free text in the CMS, so we match loosely and fall back to a check mark. */
const MAP: [RegExp, LucideIcon][] = [
    [/wi-?fi|internet|broadband/i, Wifi],
    [/\bac\b|\ba\/c\b|air ?con|cooling|climate/i, AirVent],
    [/power|backup|inverter|generator/i, BatteryCharging],
    [/smart|automation/i, Cpu],
    [/park/i, Car],
    [/gym|fitness/i, Dumbbell],
    [/pool|swim/i, Waves],
    [/terrace|balcony|view|deck/i, Mountain],
    [/garden|lawn|green/i, Sprout],
    [/gated|security|guard|cctv/i, Shield],
    [/kitchen|dining|cook/i, Utensils],
    [/tv|television|netflix/i, Tv],
    [/wash|laundry|dryer/i, Shirt],
    [/furnish|sofa|living/i, Sofa],
    [/bath|jacuzzi|tub/i, Bath],
    [/work|desk|study/i, Laptop],
    [/pet/i, PawPrint],
    [/kid|play|child/i, Baby],
    [/bbq|barbecue|grill|fire/i, Flame],
    [/fenc|boundary/i, Fence],
];

export function amenityIcon(label: string): LucideIcon {
    return MAP.find(([re]) => re.test(label))?.[1] ?? CircleCheck;
}
