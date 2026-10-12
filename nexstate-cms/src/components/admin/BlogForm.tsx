"use client";

import { brand } from "@nexstate/brand";
import { useState, useMemo } from "react";
import { sanitizeBlogHtml } from "@/lib/sanitize";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createBlogPost, updateBlogPost } from "@/actions/blog-actions";
import { Loader2, Save, Globe, FileText, Image as ImageIcon, Settings, Code2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marked } from "marked";

interface BlogFormProps {
    initialData?: any;
}

const categories = [
    { value: "general", label: "General" },
    { value: "market-news", label: "Market News" },
    { value: "investment-tips", label: "Investment Tips" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "property-guides", label: "Property Guides" },
    { value: "area-spotlight", label: "Area Spotlight" },
];

export function BlogForm({ initialData }: BlogFormProps) {
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");

    const [editorMode, setEditorMode] = useState<"richtext" | "markdown">(
        initialData?.content_format === "markdown" ? "markdown" : "richtext"
    );
    const [showPreview, setShowPreview] = useState(false);
    const router = useRouter();

    // Configure marked for preview
    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    // Generate markdown preview HTML
    const previewHtml = useMemo(() => {
        if (editorMode === "markdown" && content) {
            try {
                return marked.parse(content, { async: false }) as string;
            } catch (error) {
                return "<p>Error rendering preview</p>";
            }
        }
        return "";
    }, [content, editorMode]);

    // Auto-generate slug from title
    const generateSlug = (titleValue: string) => {
        return titleValue
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Only auto-generate slug if creating new post or slug hasn't been manually edited
        if (!initialData?.id || slug === generateSlug(initialData?.title || "")) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.set("images", images.join(","));

        formData.set("slug", slug);
        formData.set("content", content);
        formData.set("content_format", editorMode === "markdown" ? "markdown" : "html");

        try {
            let result;
            if (initialData?.id) {
                result = await updateBlogPost(initialData.id, formData);
            } else {
                result = await createBlogPost(formData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "Blog post updated!" : "Blog post created!");
                router.push("/admin/marketing");
            }
        } catch (e: any) {
            console.error("Form error:", e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            Post Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Blog Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Top 10 Investment Opportunities in Dubai"
                                    required
                                    value={title}
                                    onChange={handleTitleChange}
                                    className="text-base md:text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-input focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring overflow-hidden">
                                    <span className="flex select-none items-center pl-3 pr-1 bg-muted/30 text-muted-foreground text-sm whitespace-nowrap border-r">
                                        {new URL(brand.siteUrl).host}/blog/
                                    </span>
                                    <input
                                        type="text"
                                        name="slug"
                                        id="slug"
                                        className="block flex-1 border-0 bg-transparent py-2 pl-2 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm sm:leading-6 min-w-0 w-full"
                                        placeholder="your-post-slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                placeholder="A short summary of the blog post shown in previews..."
                                className="h-24 resize-y min-h-[80px]"
                                defaultValue={initialData?.excerpt}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <Label>Content</Label>
                                <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as "richtext" | "markdown")} className="w-auto">
                                    <TabsList className="grid w-[200px] grid-cols-2">
                                        <TabsTrigger value="richtext" className="text-xs">
                                            <FileText className="h-3 w-3 mr-1" />
                                            Rich Text
                                        </TabsTrigger>
                                        <TabsTrigger value="markdown" className="text-xs">
                                            <Code2 className="h-3 w-3 mr-1" />
                                            Markdown
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            
                            {editorMode === "richtext" ? (
                                <div className="min-h-[400px] border rounded-md focus-within:ring-1 focus-within:ring-ring">
                                    <RichTextEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Write your blog content here..."
                                        className="border-0 shadow-none rounded-none"
                                    />
                                    <input type="hidden" name="content" value={content} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Using Markdown syntax. Use ## for headings, **bold**, *italic*, - for lists, etc.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="text-xs"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            {showPreview ? "Edit" : "Preview"}
                                        </Button>
                                    </div>
                                    
                                    {showPreview ? (
                                        <div className="min-h-[400px] border rounded-md p-6 bg-muted/30">
                                            <div 
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(previewHtml) }}
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1.75',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Write your blog content in markdown...&#10;&#10;## Example Heading&#10;&#10;This is **bold** and this is *italic*.&#10;&#10;- List item 1&#10;- List item 2"
                                            className="min-h-[400px] font-mono text-sm resize-y focus-visible:ring-1"
                                        />
                                    )}
                                    <input type="hidden" name="content" value={content} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
                {/* Publishing Settings */}
                <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Publishing Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={initialData?.status || "draft"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={initialData?.category || "general"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Featured Media */}
                <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Featured Media
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <ImageUpload
                                onImagesChange={setImages}
        
                                defaultImages={initialData?.images}
                                folderName={title ? `blog-${title}` : "blog-images"}
                                layoutMode="stack"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {initialData ? "Update" : "Publish"}
                    </Button>
                </div>
            </div>
        </form>
    );
}

