import { BlogForm } from "@/components/admin/BlogForm";
import { requireStaff } from "@/lib/auth-utils";

export default async function NewBlogPage() {
    await requireStaff();

    return (
        <div className="pb-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Create Blog Post</h1>
                <p className="text-sm text-muted-foreground">
                    Draft a new article for your audience.
                </p>
            </div>

            <BlogForm />
        </div>
    );
}
