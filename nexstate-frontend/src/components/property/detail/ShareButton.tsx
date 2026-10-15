"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** Native share sheet where available (phones), otherwise copies the link. */
export function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    async function share() {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
                /* dismissed: fall through to copy */
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard blocked: nothing sensible to do */
        }
    }

    return (
        <button
            type="button"
            onClick={share}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:border-ink/40 md:self-auto"
        >
            {copied ? <Check className="size-4 text-emerald-700" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
        </button>
    );
}
