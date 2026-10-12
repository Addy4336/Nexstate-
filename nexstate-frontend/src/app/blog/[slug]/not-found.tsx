import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, ArrowLeft, Home } from "lucide-react";

export default function BlogNotFound() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
            <div className="text-center px-4 max-w-md mx-auto">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
                    <FileX className="w-12 h-12 text-muted-foreground" />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>

                {/* Description */}
                <p className="text-muted-foreground mb-8 text-lg">
                    Sorry, we couldn&apos;t find the blog post you&apos;re looking for.
                    It may have been removed or the link might be incorrect.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/blog">
                        <Button variant="default" size="lg" className="rounded-full w-full sm:w-auto">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
