import BlogHero from "@/components/blog/BlogHero";
import LatestBlogs from "@/components/blog/LatestBlogs";
import BlogLists from "@/components/blog/BlogLists";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
    description: "Explore the latest stories and updates from nexstate.",
};

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <BlogHero />

            {/* Latest Blogs Section */}
            <LatestBlogs />

            {/* Blog Lists Section */}
            <BlogLists />
        </main>
    );
}
