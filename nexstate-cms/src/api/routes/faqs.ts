import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";

export const faqsRoutes = new Elysia({ prefix: "/faqs" })
    // Get all FAQs (public)
    .get("/", async ({ query }) => {
        const { category } = query;

        let queryBuilder = supabaseAdmin
            .from("faq")
            .select("*")
            .order("sort_order", { ascending: true });

        if (category) {
            queryBuilder = queryBuilder.eq("category", category);
        }

        const { data, error } = await queryBuilder;

        if (error) {
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    }, {
        query: t.Object({
            category: t.Optional(t.String()),
        }),
        detail: {
            tags: ["FAQs"],
            summary: "Get FAQs",
            description: "Fetches all FAQs with optional category filter",
        },
    })

    // Get FAQ categories
    .get("/categories", async () => {
        const { data, error } = await supabaseAdmin
            .from("faq")
            .select("category");

        if (error) {
            return { success: false, error: error.message, data: [] };
        }

        // Get unique categories
        const categories = [...new Set(data?.map(f => f.category).filter(Boolean))];

        return { success: true, data: categories };
    }, {
        detail: {
            tags: ["FAQs"],
            summary: "Get FAQ categories",
            description: "Get list of unique FAQ categories",
        },
    });
