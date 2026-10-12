import { supabaseAdmin } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/auth-utils";
import { formatDistanceToNow } from "date-fns";

async function getBlogs() {
    const { data, error } = await supabaseAdmin
        .from("blog")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }

    return data || [];
}

function getStatusVariant(status: string) {
    switch (status) {
        case "published":
            return "default";
        case "draft":
            return "secondary";
        case "archived":
            return "outline";
        default:
            return "secondary";
    }
}

function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
        "general": "General",
        "market-news": "Market News",
        "investment-tips": "Investment Tips",
        "lifestyle": "Lifestyle",
        "property-guides": "Property Guides",
        "area-spotlight": "Area Spotlight",
    };
    return labels[category] || category;
}

export default async function BlogsPage() {
    // Verify staff access
    await requireStaff();

    const blogs = await getBlogs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">
                        Manage your blog content and articles.
                    </p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="btn-primary">
                        <Plus className="mr-2 h-4 w-4" /> Add Blog Post
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col">
                        <div className="relative aspect-video">
                            {blog.cover_image ? (
                                <Image
                                    src={blog.cover_image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    No Cover Image
                                </div>
                            )}
                            <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                    {getCategoryLabel(blog.category)}
                                </Badge>
                            </div>
                            <div className="absolute top-2 right-2">
                                <Badge variant={getStatusVariant(blog.status)}>
                                    {blog.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg line-clamp-2">{blog.title}</h3>
                            {blog.excerpt && (
                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                    {blog.excerpt}
                                </p>
                            )}

                            <div className="mt-auto pt-4 text-xs text-muted-foreground">
                                {blog.published_at ? (
                                    <span>Published {formatDistanceToNow(new Date(blog.published_at), { addSuffix: true })}</span>
                                ) : (
                                    <span>Created {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}</span>
                                )}
                            </div>
                        </div>

                        <div className="p-4 pt-0 flex gap-2">
                            <Link href={`/admin/blogs/${blog.id}/edit`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </Button>
                            </Link>
                            <DeleteBlogButton id={blog.id} title={blog.title} />
                        </div>
                    </div>
                ))}

                {blogs.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                        <p>No blog posts found.</p>
                        <Link href="/admin/blogs/new" className="text-accent hover:underline mt-2 inline-block">
                            Create your first blog post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
