import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleSlash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Section";

export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false } };

export default function PaymentCancelPage() {
    return (
        <main className="min-h-[80svh] bg-sand pb-20 pt-32 md:pt-40">
            <Container className="max-w-2xl text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-brass-deep shadow-soft">
                    <CircleSlash className="size-8" aria-hidden="true" />
                </span>
                <h1 className="text-headline mt-6">Payment cancelled</h1>
                <p className="text-lead mx-auto mt-4 max-w-md text-stone">
                    No money was taken and no booking was made. Your dates are not held, so book again soon if you still want them.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button asChild size="xl">
                        <Link href="/properties">
                            Back to homes <ArrowRight />
                        </Link>
                    </Button>
                    <Button asChild size="xl" variant="outline-dark">
                        <Link href="/contact">Talk to us</Link>
                    </Button>
                </div>
            </Container>
        </main>
    );
}
