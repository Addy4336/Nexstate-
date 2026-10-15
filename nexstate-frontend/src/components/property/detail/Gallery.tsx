"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Grid3x3, ImageOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryProps {
    images: string[];
    title: string;
}

function Photo({ src, alt, sizes, priority, className }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
    const [failed, setFailed] = useState(false);
    if (failed) {
        return (
            <div className={cn("flex size-full items-center justify-center bg-sand text-stone", className)}>
                <ImageOff className="size-8" aria-hidden="true" />
                <span className="sr-only">Photo unavailable</span>
            </div>
        );
    }
    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            onError={() => setFailed(true)}
            className={cn("object-cover", className)}
        />
    );
}

/**
 * Desktop/tablet: a magazine mosaic (one large photo plus up to four) with "Show all photos".
 * Phones: a full-width swipeable strip with a counter. Any photo opens the full-screen viewer.
 */
export function Gallery({ images, title }: GalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);
    const strip = useRef<HTMLDivElement>(null);

    const show = (i: number) => {
        setIndex(i);
        setOpen(true);
    };

    // Track which photo is in view on the phone strip, for the counter.
    useEffect(() => {
        const el = strip.current;
        if (!el) return;
        const onScroll = () => setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    if (images.length === 0) {
        return (
            <div className="flex aspect-[16/9] items-center justify-center rounded-3xl bg-sand text-stone">
                <ImageOff className="size-10" aria-hidden="true" />
                <span className="sr-only">No photos yet</span>
            </div>
        );
    }

    const mosaic = images.slice(0, 5);
    const layout =
        mosaic.length >= 5
            ? "md:grid-cols-4 md:grid-rows-2"
            : mosaic.length >= 3
              ? "md:grid-cols-3 md:grid-rows-2"
              : mosaic.length === 2
                ? "md:grid-cols-2 md:grid-rows-1"
                : "md:grid-cols-1 md:grid-rows-1";

    return (
        <>
            {/* Phones: swipe strip */}
            <div className="relative -mx-4 md:hidden">
                <div
                    ref={strip}
                    data-lenis-prevent-horizontal
                    className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {images.map((src, i) => (
                        <button
                            key={src + i}
                            type="button"
                            onClick={() => show(i)}
                            className="relative aspect-[4/3] w-full shrink-0 snap-center"
                            aria-label={`Open photo ${i + 1} of ${images.length}`}
                        >
                            <Photo src={src} alt={i === 0 ? title : ""} sizes="100vw" priority={i === 0} />
                        </button>
                    ))}
                </div>
                <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-ivory backdrop-blur">
                    {mobileIndex + 1} / {images.length}
                </span>
            </div>

            {/* Tablet and up: mosaic */}
            <div className={cn("relative hidden h-[min(64vh,560px)] gap-2 overflow-hidden rounded-3xl md:grid", layout)}>
                {mosaic.map((src, i) => (
                    <button
                        key={src + i}
                        type="button"
                        onClick={() => show(i)}
                        className={cn(
                            "group relative overflow-hidden bg-sand",
                            i === 0 && mosaic.length >= 3 && "md:col-span-2 md:row-span-2",
                            i === 0 && mosaic.length === 2 && "md:row-span-1"
                        )}
                        aria-label={`Open photo ${i + 1} of ${images.length}`}
                    >
                        <Photo
                            src={src}
                            alt={i === 0 ? title : ""}
                            sizes={i === 0 ? "(min-width: 1024px) 50vw, 66vw" : "25vw"}
                            priority={i === 0}
                            className="transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                        />
                        <span aria-hidden="true" className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
                    </button>
                ))}
                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={() => show(0)}
                        className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ivory/95 px-4 text-sm font-medium text-ink shadow-soft backdrop-blur transition-colors hover:bg-white"
                    >
                        <Grid3x3 className="size-4" aria-hidden="true" />
                        Show all {images.length} photos
                    </button>
                )}
            </div>

            <Lightbox images={images} title={title} open={open} onOpenChange={setOpen} index={index} setIndex={setIndex} />
        </>
    );
}

function Lightbox({
    images,
    title,
    open,
    onOpenChange,
    index,
    setIndex,
}: {
    images: string[];
    title: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    index: number;
    setIndex: (fn: (i: number) => number) => void;
}) {
    const n = images.length;
    const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n, setIndex]);
    const next = useCallback(() => setIndex((i) => (i + 1) % n), [n, setIndex]);
    const touchX = useRef<number | null>(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, prev, next]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Content
                    data-lenis-prevent
                    aria-describedby={undefined}
                    className="fixed inset-0 z-[70] flex flex-col bg-ink text-ivory outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
                    onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                    onTouchEnd={(e) => {
                        if (touchX.current === null) return;
                        const dx = e.changedTouches[0].clientX - touchX.current;
                        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
                        touchX.current = null;
                    }}
                >
                    <div className="flex items-center justify-between px-4 py-3 md:px-6">
                        <Dialog.Title className="truncate pr-4 text-sm text-ivory/70">
                            {title} <span className="ml-2 tabular-nums text-ivory">{index + 1} / {n}</span>
                        </Dialog.Title>
                        <Dialog.Close className="flex size-11 items-center justify-center rounded-full hover:bg-ivory/10" aria-label="Close photos">
                            <X className="size-6" />
                        </Dialog.Close>
                    </div>

                    <div className="relative flex-1">
                        <Image
                            key={images[index]}
                            src={images[index]}
                            alt={`${title}, photo ${index + 1} of ${n}`}
                            fill
                            sizes="100vw"
                            className="object-contain animate-in fade-in-0 duration-300"
                        />
                        {n > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label="Previous photo"
                                    className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 backdrop-blur transition-colors hover:bg-ivory/20 md:flex"
                                >
                                    <ChevronLeft className="size-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label="Next photo"
                                    className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 backdrop-blur transition-colors hover:bg-ivory/20 md:flex"
                                >
                                    <ChevronRight className="size-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {n > 1 && (
                        <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none]">
                            {images.map((src, i) => (
                                <button
                                    key={src + i}
                                    type="button"
                                    onClick={() => setIndex(() => i)}
                                    aria-label={`Show photo ${i + 1}`}
                                    aria-current={i === index}
                                    className={cn(
                                        "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity",
                                        i === index ? "ring-2 ring-brass" : "opacity-50 hover:opacity-90"
                                    )}
                                >
                                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
