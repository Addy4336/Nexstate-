import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";

export const blogsRoutes = new Elysia({ prefix: "/blogs" })
    // Get all published blogs (public)
    .get("/", async ({ query }) => {
        const limit = query.limit ? parseInt(query.limit) : undefined;

        let queryBuilder = supabaseAdmin
            .from("blog")
            .select("*")
            .eq("status", "published")
            .order("created_at", { ascending: false });

        if (limit) {
            queryBuilder = queryBuilder.limit(limit);
        }

        const { data, error } = await queryBuilder;

        if (error) {
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    }, {
        query: t.Object({
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Blogs"],
            summary: "Get published blogs",
            description: "Fetches all published blog posts",
        },
    })

    // Get blog by slug
    .get("/slug/:slug", async ({ params }) => {
        const { data, error } = await supabaseAdmin
            .from("blog")
            .select("*")
            .eq("slug", params.slug)
            .eq("status", "published")
            .single();

        if (error) {
            return { success: false, error: "Blog not found", data: null };
        }

        return { success: true, data };
    }, {
        params: t.Object({
            slug: t.String(),
        }),
        detail: {
            tags: ["Blogs"],
            summary: "Get blog by slug",
            description: "Fetches a single blog post by its slug",
        },
    })

    // Get blog by ID
    .get("/:id", async ({ params }) => {
        const { data, error } = await supabaseAdmin
            .from("blog")
            .select("*")
            .eq("id", params.id)
            .eq("status", "published")
            .single();

        if (error) {
            return { success: false, error: "Blog not found", data: null };
        }

        return { success: true, data };
    }, {
        params: t.Object({
            id: t.String(),
        }),
        detail: {
            tags: ["Blogs"],
            summary: "Get blog by ID",
            description: "Fetches a single blog post by its ID",
        },
    });
