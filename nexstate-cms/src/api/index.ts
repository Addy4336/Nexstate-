import { brand } from "@nexstate/brand";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { propertiesRoutes } from "./routes/properties";
import { enquiriesRoutes } from "./routes/enquiries";
import { favoritesRoutes } from "./routes/favorites";
import { blogsRoutes } from "./routes/blogs";
import { faqsRoutes } from "./routes/faqs";
import { storageRoutes } from "./routes/storage";
import { aiRoutes } from "./routes/ai";
import { paymentsRoutes } from "./routes/payments";
import { initializeCronJobs } from "../lib/cron-jobs";

// Initialize cron jobs when the API starts
initializeCronJobs();

// Create the main Elysia application
export const api = new Elysia({ prefix: "/api" })
    // Add Swagger documentation
    .use(swagger({
        path: "/docs",
        documentation: {
            info: {
                title: `${brand.name} Platform API`,
                version: "2.0.0",
                description: `API for the ${brand.name} real estate management platform`,
            },
            tags: [
                { name: "Properties", description: "Property listing endpoints" },
                { name: "AI Intelligence", description: "Natural language search, recommendations & copilot" },
                { name: "Enquiries", description: "Contact and lead endpoints" },
                { name: "Favorites", description: "Saved properties endpoints" },
                { name: "Blogs", description: "Blog content endpoints" },
                { name: "FAQs", description: "FAQ content endpoints" },
                { name: "Storage", description: "Image storage endpoints" },
                { name: "Payments", description: "Payment sessions and webhooks" },
            ],
        },
    }))

    // Health check endpoint at /api/health
    .get("/health", () => ({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: `${brand.name.toLowerCase()}-api`,
    }), {
        detail: {
            tags: ["System"],
            summary: "Health check",
            description: "Check if the API is running",
        },
    })

    // Register all route modules
    .use(propertiesRoutes)
    .use(aiRoutes)
    .use(enquiriesRoutes)
    .use(favoritesRoutes)
    .use(blogsRoutes)
    .use(faqsRoutes)
    .use(storageRoutes)
    .use(paymentsRoutes);

// Export the type for Eden Treaty client
export type Api = typeof api;

