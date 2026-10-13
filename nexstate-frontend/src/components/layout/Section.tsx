import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Page rhythm. Every section picks a tone so the page alternates light, warm and dark
 * bands instead of repeating the same white block; spacing is one of three steps.
 */

const tones = {
    ivory: "bg-ivory text-ink",
    sand: "bg-sand text-ink",
    white: "bg-white text-ink",
    ink: "bg-ink text-ivory",
    forest: "bg-forest text-ivory",
} as const;

const spacings = {
    none: "",
    sm: "py-14 md:py-20",
    md: "py-20 md:py-28 lg:py-32",
    lg: "py-24 md:py-36 lg:py-44",
} as const;

export type SectionTone = keyof typeof tones;
const isDark = (tone: SectionTone) => tone === "ink" || tone === "forest";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("container-site", className)} {...props} />;
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    tone?: SectionTone;
    spacing?: keyof typeof spacings;
    /** Wrap children in the standard container (default). Turn off for full-bleed content. */
    contained?: boolean;
}

export function Section({ tone = "ivory", spacing = "md", contained = true, className, children, ...props }: SectionProps) {
    return (
        <section data-tone={tone} className={cn("relative", tones[tone], spacings[spacing], className)} {...props}>
            {contained ? <Container>{children}</Container> : children}
        </section>
    );
}

export function Eyebrow({ children, light, className }: { children: React.ReactNode; light?: boolean; className?: string }) {
    return <p className={cn("eyebrow", light && "eyebrow-light", className)}>{children}</p>;
}

interface SectionHeadingProps {
    eyebrow?: string;
    /** Supports *emphasis* (italic accent). */
    title: string;
    lead?: React.ReactNode;
    /** "split": title left, lead right on wide screens (editorial). "center": stacked and centred. */
    layout?: "split" | "stacked" | "center";
    tone?: SectionTone;
    actions?: React.ReactNode;
    as?: "h1" | "h2";
    className?: string;
}

export function SectionHeading({
    eyebrow,
    title,
    lead,
    layout = "split",
    tone = "ivory",
    actions,
    as = "h2",
    className,
}: SectionHeadingProps) {
    const dark = isDark(tone);
    const emphasis = dark ? "italic text-brass" : "italic text-brass-deep";
    const leadClass = cn("text-lead max-w-xl", dark ? "text-ivory/75" : "text-stone");

    if (layout === "split") {
        return (
            <div className={cn("grid gap-6 md:grid-cols-12 md:items-end md:gap-10", className)}>
                <div className="md:col-span-7">
                    {eyebrow && <Eyebrow light={dark}>{eyebrow}</Eyebrow>}
                    <RevealText as={as} text={title} className="text-headline mt-4" emphasisClassName={emphasis} />
                </div>
                {(lead || actions) && (
                    <Reveal delay={0.15} className="md:col-span-5 md:pb-2">
                        {lead && <div className={leadClass}>{lead}</div>}
                        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
                    </Reveal>
                )}
            </div>
        );
    }

    const center = layout === "center";
    return (
        <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
            {eyebrow && <Eyebrow light={dark} className={cn(center && "justify-center")}>{eyebrow}</Eyebrow>}
            <RevealText as={as} text={title} className="text-headline mt-4" emphasisClassName={emphasis} />
            {(lead || actions) && (
                <Reveal delay={0.15}>
                    {lead && <div className={cn(leadClass, "mt-5", center && "mx-auto")}>{lead}</div>}
                    {actions && <div className={cn("mt-7 flex flex-wrap gap-3", center && "justify-center")}>{actions}</div>}
                </Reveal>
            )}
        </div>
    );
}
