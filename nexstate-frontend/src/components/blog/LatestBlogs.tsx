"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

// Blog interface matching the CMS API response
interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    cover_image: string | null;
    images: string[] | null;
    category: string;
    status: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BlogListResponse {
    success: boolean;
    data: Blog[];
    error?: string;
}

// CMS API base URL
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Format date for display
function formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// Get reading time estimate
function getReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
}

// Get blog cover image with fallback
function getBlogImage(blog: Blog): string {
    if (blog.cover_image) {
        return blog.cover_image;
    }
    if (blog.images && blog.images.length > 0) {
        return blog.images[0];
    }
    // Fallback placeholder
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop';
}

// Format category for display
function formatCategory(category: string): string {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Loading skeleton component
function BlogCardSkeleton() {
    return (
        <div className="flex flex-col p-3 md:p-4 rounded-2xl border border-border bg-card animate-pulse">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 md:mb-4 bg-muted"></div>
            <div className="flex items-center justify-between gap-3 mb-2 md:mb-3 w-full">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted"></div>
                    <div className="h-4 w-20 bg-muted rounded"></div>
                </div>
                <div className="h-3 w-24 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-5 w-full bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
            </div>
        </div>
    );
}

export default function LatestBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${CMS_API_URL}/api/blogs?limit=9`, {
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }

                const data: BlogListResponse = await response.json();

                if (data.success) {
                    setBlogs(data.data);
                } else {
                    setError(data.error || 'Failed to load blogs');
                }
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchBlogs();
    }, []);

    return (
        <section className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-12">

                {/* Header */}
                <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Latest Blog Posts</h2>
                    <p className="text-muted-foreground text-sm">Discover insights, tips, and news about real estate and property investment</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[...Array(6)].map((_, index) => (
                            <BlogCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && blogs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
                    </div>
                )}

                {/* Blog Grid */}
                {!loading && !error && blogs.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.slug}`}
                                className="group flex flex-col p-3 md:p-4 rounded-2xl border border-border bg-card shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 md:mb-4">
                                    <Image
                                        src={getBlogImage(blog)}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-medium rounded-full uppercase tracking-wide">
                                        {formatCategory(blog.category)}
                                    </span>
                                </div>

                                {/* Author & Meta */}
                                <div className="flex items-center justify-between gap-3 mb-2 md:mb-3 w-full">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-medium text-xs md:text-sm text-card-foreground truncate max-w-[80px] md:max-w-none">
                                            nexstate
                                        </span>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">
                                        {formatDate(blog.published_at || blog.created_at)} • {getReadingTime(blog.content || '')}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="space-y-1 md:space-y-2">
                                    <h3 className="text-base md:text-lg font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                                        {blog.excerpt || blog.title}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}
