import { brand } from "@nexstate/brand";
import Image from "next/image";
import { sanitizeBlogHtml } from "@/lib/sanitize";
import { marked } from 'marked';
import {
    Facebook,
    Twitter,
    Mail,
    MapPin,
    User,
    Maximize2,
    ArrowRight,
    ChevronRight,
    Calendar,
    Tag,
    Clock,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { ScrollToTopButton } from "@/components/blog/ScrollToTopButton";
import { ImageLightbox } from "@/components/blog/ImageLightbox";

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
    content_format?: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    data: Blog | null;
    error?: string;
}

interface BlogListResponse {
    success: boolean;
    data: Blog[];
    error?: string;
}

interface BlogPageProps {
    params: Promise<{ slug: string }>;
}

// CMS API base URL
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Fetch blog by slug from CMS API
async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const url = `${CMS_API_URL}/api/blogs/slug/${encodeURIComponent(slug)}`;
        console.log(`Fetching blog from: ${url}`);

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch blog:', response.status);
            return null;
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
            console.log(`Successfully fetched blog: ${data.data.title}`);
            return data.data;
        }

        console.error('API error:', data.error);
        return null;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

// Fetch related blogs from CMS API (excluding current blog by slug)
async function getRelatedBlogs(excludeSlug: string, limit: number = 3): Promise<Blog[]> {
    try {
        const url = `${CMS_API_URL}/api/blogs?limit=${limit + 1}`;
        console.log(`Fetching related blogs from: ${url}`);

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch related blogs:', response.status);
            return [];
        }

        const data: BlogListResponse = await response.json();

        if (data.success && data.data) {
            // Filter out the current blog and limit results
            return data.data
                .filter((blog: Blog) => blog.slug !== excludeSlug)
                .slice(0, limit);
        }

        return [];
    } catch (error) {
        console.error('Error fetching related blogs:', error);
        return [];
    }
}

// Format date for display
function formatDate(dateString: string | null): string {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Format category for display
function formatCategory(category: string): string {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Get reading time estimate
function getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// Process blog content - convert markdown to HTML if needed
function processContent(content: string, format?: string): string {
    console.log('processContent called with format:', format);
    console.log('Content preview:', content.substring(0, 100));

    // Check if content looks like markdown (contains ## or ** or * for lists)
    const looksLikeMarkdown = content.includes('##') ||
        (content.includes('**') && !content.includes('<')) ||
        /^\* |\n\* /m.test(content);

    if (format === 'markdown' || (looksLikeMarkdown && format !== 'html')) {
        // Configure marked for better HTML output
        marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert \n to <br>
        });
        const html = marked.parse(content, { async: false }) as string;
        console.log('Converted HTML preview:', html.substring(0, 200));
        return html;
    }
    return content;
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
    return 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=600&auto=format&fit=crop&q=60';
}

// Generate dynamic metadata
export async function generateMetadata({ params }: BlogPageProps) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Blog Not Found',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: blog.title,
        description: blog.excerpt || `Read ${blog.title} on the ${brand.name} blog.`,
    };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
    const { slug } = await params;

    // Fetch blog data
    const blog = await getBlogBySlug(slug);

    // If blog not found, show 404
    if (!blog) {
        notFound();
    }

    // Debug logging
    console.log('Blog content_format:', blog.content_format);
    console.log('Blog content preview:', blog.content?.substring(0, 100));

    // Fetch related blogs
    const relatedBlogs = await getRelatedBlogs(slug, 3);

    const readingTime = getReadingTime(blog.content || '');
    const coverImage = getBlogImage(blog);

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 -z-10 [mask-image:linear-gradient(to_bottom,black_50%,transparent)]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-7xl pt-24 md:pt-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">

                    {/* Middle Column: Main Content */}
                    <article className="lg:col-span-12 xl:col-span-9 flex flex-col gap-8">

                        {/* Post Header */}
                        <div className="space-y-6">
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium tracking-wide uppercase">
                                    {formatCategory(blog.category)}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium tracking-wide flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {readingTime} min read
                                </span>
                                {blog.status === 'published' && (
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-medium tracking-wide">
                                        Published
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
                                {blog.title}
                            </h1>

                            {/* Author & Date Row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{brand.name} Team</span>
                                        <span className="text-xs">Author</span>
                                    </div>
                                </div>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(blog.published_at || blog.created_at)}</span>
                                </div>
                                {blog.updated_at && blog.updated_at !== blog.created_at && (
                                    <>
                                        <span className="text-border">•</span>
                                        <span className="text-xs">Updated: {formatDate(blog.updated_at)}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Image Lightbox - Cover Image and Gallery */}
                        <ImageLightbox
                            images={blog.images || []}
                            coverImage={coverImage}
                            title={blog.title}
                        />

                        {/* Excerpt Section */}
                        {blog.excerpt && (
                            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border-l-4 border-primary">
                                <p className="text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
                                    "{blog.excerpt}"
                                </p>
                            </div>
                        )}

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 my-4 border-y border-border">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Published</span>
                                    <span className="font-semibold text-sm">{formatDate(blog.published_at || blog.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</span>
                                    <span className="font-semibold text-sm">{formatCategory(blog.category)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Reading Time</span>
                                    <span className="font-semibold text-sm">{readingTime} min</span>
                                </div>
                            </div>
                            {blog.images && blog.images.length > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                                        <Maximize2 className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Images</span>
                                        <span className="font-semibold text-sm">{blog.images.length} photos</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Body - Render HTML or Markdown content */}
                        <div
                            className="prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-img:rounded-2xl prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeBlogHtml(processContent(blog.content || '', blog.content_format))
                            }}
                        />
                    </article>

                    {/* Right Sidebar: Blog Info */}
                    <aside className="lg:col-span-12 xl:col-span-3 hidden xl:flex flex-col pt-32 lg:pt-64">
                        <div className="sticky top-24 space-y-8">
                            {/* About this post */}
                            <div>
                                <h3 className="font-bold text-lg mb-6">About this post</h3>
                                <ul className="space-y-5 relative border-l border-border ml-2 pl-6">
                                    <li className="relative text-sm text-muted-foreground">
                                        <span className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-background"></span>
                                        <span className="font-medium text-foreground block">Category</span>
                                        <span className="text-primary">{formatCategory(blog.category)}</span>
                                    </li>
                                    <li className="relative text-sm text-muted-foreground">
                                        <span className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-border"></span>
                                        <span className="font-medium text-foreground block">Published</span>
                                        {formatDate(blog.published_at || blog.created_at)}
                                    </li>
                                    {blog.updated_at && blog.updated_at !== blog.created_at && (
                                        <li className="relative text-sm text-muted-foreground">
                                            <span className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-border"></span>
                                            <span className="font-medium text-foreground block">Last Updated</span>
                                            {formatDate(blog.updated_at)}
                                        </li>
                                    )}
                                    <li className="relative text-sm text-muted-foreground">
                                        <span className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-border"></span>
                                        <span className="font-medium text-foreground block">Reading Time</span>
                                        {readingTime} min read
                                    </li>
                                    {blog.images && blog.images.length > 0 && (
                                        <li className="relative text-sm text-muted-foreground">
                                            <span className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-border"></span>
                                            <span className="font-medium text-foreground block">Images</span>
                                            {blog.images.length} photo{blog.images.length !== 1 ? 's' : ''}
                                        </li>
                                    )}
                                </ul>
                            </div>


                        </div>
                    </aside>

                </div>
            </div>

            {/* Related Posts Section */}
            {relatedBlogs.length > 0 && (
                <section className="bg-gray-50/50 py-24 relative overflow-hidden mt-16">
                    {/* Background Pattern - Subtle Ripples */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03)_0%,transparent_50%)] pointer-events-none"></div>

                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Related Posts</h2>
                            <Link href="/blog" className="group flex items-center gap-3 pl-6 pr-2 py-2 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl">
                                <span className="text-sm font-medium">View More</span>
                                <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map((relatedBlog, index) => (
                                <Link
                                    key={relatedBlog.id}
                                    href={`/blog/${relatedBlog.slug}`}
                                    className={`bg-background p-3 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col gap-4 border border-border/50 ${index === 1 ? 'flex-col-reverse' : ''
                                        }`}
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden">
                                        <Image
                                            src={getBlogImage(relatedBlog)}
                                            alt={relatedBlog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <span className={`absolute ${index === 1 ? 'top-4' : 'bottom-4'} left-4 bg-background px-5 py-2 rounded-full text-xs font-bold tracking-wide shadow-sm`}>
                                            {formatCategory(relatedBlog.category)}
                                        </span>
                                    </div>

                                    {/* Text Section */}
                                    <div className={`px-2 ${index === 1 ? 'pt-4' : 'pb-4'}`}>
                                        <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {relatedBlog.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {relatedBlog.excerpt || formatDate(relatedBlog.published_at || relatedBlog.created_at)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Empty Related Posts Fallback */}
            {relatedBlogs.length === 0 && (
                <section className="bg-gray-50/50 py-24 relative overflow-hidden mt-16">
                    <div className="container mx-auto px-4 max-w-7xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">Explore More</h2>
                        <p className="text-muted-foreground mb-8">Check out our other blog posts</p>
                        <Link href="/blog">
                            <Button size="lg" className="rounded-full">
                                View All Posts
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </section>
            )}

            {/* Footer / Newsletter Section */}


            <ScrollToTopButton />
        </main>
    );
}
