'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

interface Blog {
    id: string;
    title: string;
    slug: string;
    cover_image?: string | null;
    images?: string[] | null;
    excerpt?: string;
    created_at: string;
}

// Get blog cover image
function getBlogImage(blog: Blog): string | null {
    let url = blog.cover_image;

    if (!url && blog.images && blog.images.length > 0) {
        url = blog.images[0];
    }

    if (!url) return null;

    // Handle relative URLs
    if (url.startsWith('/')) {
        const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        // Remove trailing slash from base URL to avoid double slashes
        const cleanBaseUrl = apiUrl.replace(/\/$/, '');
        url = `${cleanBaseUrl}${url}`;
    }

    return url;
}

interface ListCategory {
    title: string;
    items: Blog[];
}

export default function BlogLists() {
    const [listData, setListData] = useState<ListCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_API_URL}/api/blogs`);
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    const blogs = result.data;

                    // Organize blogs into categories
                    // Latest: First 4 blogs (most recent)
                    // Most Viewed: Next 4 blogs
                    // Editor's Choice: Next 4 blogs
                    const latestBlogs = blogs.slice(0, 4);
                    const mostViewedBlogs = blogs.slice(4, 8);
                    const editorsChoice = blogs.slice(8, 12);

                    const categories: ListCategory[] = [];

                    if (latestBlogs.length > 0) {
                        categories.push({
                            title: "Latest",
                            items: latestBlogs
                        });
                    }

                    if (mostViewedBlogs.length > 0) {
                        categories.push({
                            title: "Most Viewed",
                            items: mostViewedBlogs
                        });
                    }

                    if (editorsChoice.length > 0) {
                        categories.push({
                            title: "Editor's Choice",
                            items: editorsChoice
                        });
                    }

                    // If we have fewer blogs, just show what we have in Latest
                    if (categories.length === 0 && blogs.length > 0) {
                        categories.push({
                            title: "Latest",
                            items: blogs
                        });
                    }

                    setListData(categories);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-12 bg-background">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center py-10 text-muted-foreground">Loading blogs...</div>
                </div>
            </section>
        );
    }

    if (listData.length === 0) {
        return (
            <section className="py-8 md:py-12 bg-background">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center py-10 text-muted-foreground">No blogs available.</div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 bg-background">
            <div className="container mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {listData.map((list, index) => (
                        <div key={index} className="bg-card rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-border p-4 md:p-6">

                            {/* Header */}
                            <div className="relative mb-4 md:mb-6 border-b border-border pb-2">
                                <span className={`${list.title === "Most Viewed" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"} px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium`}>
                                    {list.title}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="flex flex-col gap-4 md:gap-6">
                                {list.items.map((item) => (
                                    <Link href={`/blog/${item.slug}`} key={item.id} className="group flex gap-3 md:gap-4 items-start">
                                        {/* Image */}
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                                            {getBlogImage(item) ? (
                                                <Image
                                                    src={getBlogImage(item)!}
                                                    alt={item.title || "Blog thumbnail"}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <span className="text-muted-foreground text-xs">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 py-1 border-b border-border pb-4 md:pb-6 last:border-0 last:pb-0">
                                            <p className="text-card-foreground text-xs md:text-sm font-medium leading-relaxed group-hover:text-primary transition-colors line-clamp-3 md:line-clamp-none">
                                                {item.title}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
