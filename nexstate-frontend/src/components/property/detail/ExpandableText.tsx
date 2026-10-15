"use client";

import { useEffect, useRef, useState } from "react";

/** Long description clamped to a few lines with "Read more"; the toggle only appears if the text is actually cut. */
export function ExpandableText({ text, lines = 5 }: { text: string; lines?: number }) {
    const [open, setOpen] = useState(false);
    const [clamped, setClamped] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (el) setClamped(el.scrollHeight > el.clientHeight + 2);
    }, [text]);

    return (
        <div>
            <p
                ref={ref}
                className="text-lead whitespace-pre-line text-ink/80"
                style={open ? undefined : { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
                {text}
            </p>
            {(clamped || open) && (
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="mt-3 text-sm font-medium text-forest underline decoration-brass underline-offset-4"
                >
                    {open ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
}
