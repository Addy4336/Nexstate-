"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { EASE_OUT } from "@/components/motion/hooks";
import { cn } from "@/lib/utils";

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

/** Accessible accordion: each question is a real button with aria-expanded controlling its answer region. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
    const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
    const base = useId();

    return (
        <div className="divide-y divide-line border-y border-line">
            {items.map((item) => {
                const isOpen = open === item.id;
                const panelId = `${base}-${item.id}`;
                return (
                    <div key={item.id}>
                        <h3>
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpen(isOpen ? null : item.id)}
                                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-serif text-xl tracking-tight text-ink transition-colors hover:text-forest-700 md:text-2xl"
                            >
                                {item.question}
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        "flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500",
                                        isOpen ? "rotate-45 border-forest bg-forest text-ivory" : "text-ink"
                                    )}
                                >
                                    <Plus className="size-5" />
                                </span>
                            </button>
                        </h3>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={undefined}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: EASE_OUT }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-lead max-w-2xl pb-7 text-stone">{item.answer}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
