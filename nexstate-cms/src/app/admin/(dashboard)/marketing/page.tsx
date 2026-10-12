import { supabaseAdmin } from "@/lib/db";
import { requireStaff } from "@/lib/auth-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Edit, FileText, HelpCircle, Calendar, ArrowRight, Table as TableIcon, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";
import { DeleteFaqButton } from "@/components/admin/DeleteFaqButton";
import { ToggleFaqButton } from "@/components/admin/ToggleFaqButton";

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

async function getFaqs() {
    const { data, error } = await supabaseAdmin
        .from("faq")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching FAQs:", error);
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

function getBlogCategoryLabel(category: string) {
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

function getFaqCategoryLabel(category: string) {
    const labels: Record<string, string> = {
        "general": "General",
        "properties": "Properties",
        "investment": "Investment",
        "buying": "Buying",
        "selling": "Selling",
        "renting": "Renting",
        "legal": "Legal",
        "finance": "Finance",
    };
    return labels[category] || category;
}

function getFaqCategoryColor(category: string) {
    const colors: Record<string, string> = {
        "general": "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200",
        "properties": "bg-indigo-50 text-indigo-700 hover:bg-indigo-50/80 border-indigo-200",
        "investment": "bg-emerald-50 text-emerald-700 hover:bg-emerald-50/80 border-emerald-200",
        "buying": "bg-blue-50 text-blue-700 hover:bg-blue-50/80 border-blue-200",
        "selling": "bg-amber-50 text-amber-700 hover:bg-amber-50/80 border-amber-200",
        "renting": "bg-pink-50 text-pink-700 hover:bg-pink-50/80 border-pink-200",
        "legal": "bg-rose-50 text-rose-700 hover:bg-rose-50/80 border-rose-200",
        "finance": "bg-purple-50 text-purple-700 hover:bg-purple-50/80 border-purple-200",
    };
    return colors[category] || "bg-muted text-muted-foreground";
}

export default async function MarketingPage() {
    await requireStaff();

    const [blogs, faqs] = await Promise.all([getBlogs(), getFaqs()]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
                <p className="text-sm text-muted-foreground">
                    Content management for your blog posts and knowledge base.
                </p>
            </div>

            <Tabs defaultValue="blogs" className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b">
                    <TabsList className="h-10 p-1 bg-muted/50 rounded-lg">
                        <TabsTrigger value="blogs" className="gap-2 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <LayoutGrid className="h-4 w-4" />
                            Blogs ({blogs.length})
                        </TabsTrigger>
                        <TabsTrigger value="faqs" className="gap-2 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <TableIcon className="h-4 w-4" />
                            FAQs ({faqs.length})
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        {/* Contextual actions could go here */}
                    </div>
                </div>

                {/* Blogs Tab */}
                <TabsContent value="blogs" className="space-y-6 mt-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold tracking-tight">Recent Posts</h2>
                        <Link href="/admin/marketing/blogs/new">
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> Create Post
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="group bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
                                <Link href={`/admin/marketing/blogs/${blog.id}/edit`} className="block relative aspect-[16/9] bg-muted overflow-hidden">
                                    {blog.cover_image ? (
                                        <Image
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 bg-secondary/30">
                                            <FileText className="h-10 w-10 mb-2" />
                                            <span className="text-xs font-medium">No Cover Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 z-10">
                                        <Badge variant="secondary" className="bg-background/95 backdrop-blur-md shadow-sm text-xs font-semibold px-2 py-0.5 border-none">
                                            {getBlogCategoryLabel(blog.category)}
                                        </Badge>
                                    </div>
                                </Link>

                                <div className="p-4 flex-1 flex flex-col space-y-3">
                                    <div className="flex-1 space-y-2">
                                        <Link href={`/admin/marketing/blogs/${blog.id}/edit`} className="block">
                                            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {blog.title}
                                            </h3>
                                        </Link>
                                        {blog.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {blog.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {blog.published_at ? (
                                                <span>{formatDistanceToNow(new Date(blog.published_at), { addSuffix: true })}</span>
                                            ) : (
                                                <span>Draft • {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}</span>
                                            )}
                                        </div>
                                        <Badge variant={getStatusVariant(blog.status)} className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                                            {blog.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted/20 border-t flex items-center justify-between gap-2">
                                    <Link href={`/admin/marketing/blogs/${blog.id}/edit`} className="flex-1">
                                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-medium hover:bg-background hover:shadow-sm">
                                            Edit Post
                                        </Button>
                                    </Link>
                                    <div className="w-[1px] h-4 bg-border"></div>
                                    <DeleteBlogButton id={blog.id} title={blog.title} />
                                </div>
                            </div>
                        ))}

                        {blogs.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-muted/10 border-2 border-dashed border-muted rounded-2xl">
                                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-8 w-8 text-muted-foreground/60" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
                                    Start writing your first blog post to engage your audience.
                                </p>
                                <Link href="/admin/marketing/blogs/new">
                                    <Button>Create Post</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* FAQs Tab */}
                <TabsContent value="faqs" className="space-y-6 mt-0">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">FAQ Management</h2>
                            <p className="text-sm text-muted-foreground">Manage questions and answers for your help center.</p>
                        </div>
                        <Link href="/admin/marketing/faqs/new">
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> Add Question
                            </Button>
                        </Link>
                    </div>

                    <Card className="border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {faqs.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <HelpCircle className="h-8 w-8 text-muted-foreground/60" />
                                    </div>
                                    <h3 className="text-lg font-semibold">No questions found</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
                                        Create common questions and answers to help your users.
                                    </p>
                                    <Link href="/admin/marketing/faqs/new">
                                        <Button>Add FAQ</Button>
                                    </Link>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/40">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[60px] pl-4">#</TableHead>
                                            <TableHead className="w-[45%]">Question</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right pr-4">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {faqs.map((faq, index) => (
                                            <TableRow key={faq.id} className="group hover:bg-muted/30">
                                                <TableCell className="font-medium text-muted-foreground pl-4">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 py-1">
                                                        <p className="font-medium text-sm text-foreground">{faq.question}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getFaqCategoryColor(faq.category)}>
                                                        {getFaqCategoryLabel(faq.category)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <ToggleFaqButton
                                                        id={faq.id}
                                                        isActive={faq.is_active}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right pr-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/marketing/faqs/${faq.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <DeleteFaqButton id={faq.id} question={faq.question} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
