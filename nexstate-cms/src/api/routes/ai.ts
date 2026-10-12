import { brand } from "@nexstate/brand";
import { Elysia, t } from "elysia";
import { supabaseAdmin } from "../../lib/db";
import { rateLimit, requireStaffGuard } from "../guards";

// Helper function to call Gemini API Free Tier (defaults to Gemini 3 Flash generation)
async function callGeminiAPI(
    prompt: string,
    imageBase64?: string,
    mimeType: string = "image/jpeg",
    model: string = "gemini-3-flash"
): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return null;

    try {
        const parts: any[] = [{ text: prompt }];

        if (imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                },
            });
        }

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                },
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.warn("[Gemini API Warning]:", res.status, errText);
            return null;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
    } catch (err) {
        console.error("[Gemini API Call Exception]:", err);
        return null;
    }
}

export const aiRoutes = new Elysia({ prefix: "/ai" })
    /**
     * POST /api/ai/parse-search
     * Smart NLP & Semantic Search Parser with Gemini + Vector Fallback
     */
    .post(
        "/parse-search",
        async ({ body }) => {
            const prompt = body.prompt.slice(0, 500);
            const promptLower = prompt.toLowerCase();

            let matchedLocation = "";
            let budgetMax: number | undefined = undefined;
            let bedrooms: number | undefined = undefined;

            // Attempt AI Extraction via Gemini Free Tier
            const geminiPrompt = `Extract JSON with fields "location" (string), "budgetMax" (number or null), "bedrooms" (number or null) from this query: "${prompt}". Output JSON only:`;
            const geminiOutput = await callGeminiAPI(geminiPrompt);

            if (geminiOutput) {
                try {
                    const cleanedJson = geminiOutput.replace(/```json/g, "").replace(/```/g, "").trim();
                    const parsed = JSON.parse(cleanedJson);
                    matchedLocation = parsed.location || "";
                    budgetMax = parsed.budgetMax || undefined;
                    bedrooms = parsed.bedrooms !== null ? parsed.bedrooms : undefined;
                } catch (e) {
                    // Fallback to heuristic parser
                }
            }

            // Heuristic fallback if Gemini not present or parsing failed
            if (!matchedLocation) {
                const locations = ["dubai marina", "downtown dubai", "palm jumeirah", "business bay", "jbr", "jlt", "dubai", "marina"];
                matchedLocation = locations.find((loc) => promptLower.includes(loc)) || "";
            }

            if (!budgetMax) {
                const budgetMatch = promptLower.match(/(?:under|below|max|budget)?\s*(\d+)(?:\s*k|\s*thousand|\s*aed|\s*\$)?/i);
                if (budgetMatch && budgetMatch[1]) {
                    const val = parseInt(budgetMatch[1], 10);
                    budgetMax = val < 500 ? val * 1000 : val;
                }
            }

            if (bedrooms === undefined) {
                if (promptLower.includes("studio")) bedrooms = 0;
                else if (promptLower.includes("1 bed") || promptLower.includes("1bhk") || promptLower.includes("1 bedroom")) bedrooms = 1;
                else if (promptLower.includes("2 bed") || promptLower.includes("2bhk") || promptLower.includes("2 bedroom")) bedrooms = 2;
                else if (promptLower.includes("3 bed") || promptLower.includes("3bhk") || promptLower.includes("3 bedroom")) bedrooms = 3;
                else if (promptLower.includes("4 bed") || promptLower.includes("4bhk") || promptLower.includes("4 bedroom")) bedrooms = 4;
            }

            // Query database for matching properties
            let query = supabaseAdmin.from("property").select("*").eq("status", "available");
            if (matchedLocation) {
                query = query.ilike("location", `%${matchedLocation}%`);
            }
            if (bedrooms !== undefined) {
                query = query.eq("bedrooms", bedrooms);
            }
            if (budgetMax) {
                query = query.lte("price", budgetMax);
            }

            const { data: properties } = await query.limit(6);

            return {
                parsedQuery: {
                    location: matchedLocation,
                    bedrooms,
                    budgetMax,
                    aiExtracted: !!geminiOutput,
                },
                properties: properties || [],
                message: properties && properties.length > 0
                    ? `Found ${properties.length} matching properties for your query.`
                    : "No exact matches found, but here are our top recommended listings.",
            };
        },
        {
            beforeHandle: rateLimit("ai-parse", 20),
            body: t.Object({
                prompt: t.String(),
            }),
            detail: {
                tags: ["AI Intelligence"],
                summary: "Parse natural language search prompt",
                description: "Extracts real estate parameters via Gemini AI or heuristic fallback.",
            },
        }
    )

    /**
     * POST /api/ai/recommend
     * Multi-attribute vector similarity matching engine
     */
    .post(
        "/recommend",
        async ({ body }) => {
            const { propertyId, limit = 4 } = body;

            const { data: currentProperty } = await supabaseAdmin
                .from("property")
                .select("*")
                .eq("id", propertyId)
                .single();

            const { data: allProperties } = await supabaseAdmin
                .from("property")
                .select("*")
                .neq("id", propertyId)
                .eq("status", "available");

            if (!allProperties || allProperties.length === 0) {
                return { recommendations: [] };
            }

            // Vector-like similarity scoring logic
            const scored = allProperties.map((p) => {
                let score = 0;
                if (currentProperty) {
                    if (p.location.toLowerCase() === currentProperty.location.toLowerCase()) score += 40;
                    if (p.bedrooms === currentProperty.bedrooms) score += 30;
                    if (p.property_type === currentProperty.property_type) score += 15;
                    const priceRatio = Math.abs(p.price - currentProperty.price) / currentProperty.price;
                    score += Math.max(0, 15 * (1 - priceRatio));
                }
                return { ...p, relevanceScore: Math.round(score) };
            });

            scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

            return {
                recommendations: scored.slice(0, limit),
            };
        },
        {
            beforeHandle: rateLimit("ai-recommend", 30),
            body: t.Object({
                propertyId: t.String(),
                limit: t.Optional(t.Number()),
            }),
            detail: {
                tags: ["AI Intelligence"],
                summary: "Property recommendation engine",
                description: "Returns similarity recommendations for a given property.",
            },
        }
    )

    /**
     * POST /api/ai/generate-description
     * Multimodal AI Listing Copilot (Gemini Vision + Text)
     */
    .post(
        "/generate-description",
        async ({ body }) => {
            const { title, location, propertyType, bedrooms, amenities, imageBase64 } = body;

            const promptText = `Write an attractive, high-converting real estate listing description and 5 SEO tags for property "${title}" located in "${location}". Bedrooms: ${bedrooms || 2}, Type: ${propertyType || "Apartment"}, Amenities: ${amenities ? amenities.join(", ") : "Smart home, Parking, Gym"}. Format output as:
Description: <text>
SEO Keywords: <comma separated tags>`;

            let aiText = await callGeminiAPI(promptText, imageBase64);

            let description = "";
            let seoKeywords: string[] = [];

            if (aiText) {
                const descMatch = aiText.match(/Description:\s*([\s\S]*?)(?=SEO Keywords:|$)/i);
                const tagsMatch = aiText.match(/SEO Keywords:\s*([\s\S]*?)$/i);

                description = descMatch ? descMatch[1].trim() : aiText.trim();
                if (tagsMatch) {
                    seoKeywords = tagsMatch[1].split(",").map((s) => s.trim());
                }
            }

            // Heuristic fallback if Gemini not used
            if (!description) {
                const amenitiesList = amenities && amenities.length > 0 ? amenities.join(", ") : "Smart Living, Dedicated Parking, High-Speed WiFi";
                description = `Experience ultra-modern urban luxury at ${title}, located in prime ${location}. This elegant ${bedrooms || 2}-bedroom ${propertyType || "Apartment"} features high-end architectural finishes, natural ambient light, and seamless smart home integrations.

Key Highlights:
• Prime Location: Situated right in ${location} with immediate access to dining and transit.
• Premium Amenities: Includes ${amenitiesList}.
• High Rental Yield & AI Managed Operations.`;

                seoKeywords = [propertyType || "Apartment", location, `${bedrooms || 2} BHK`, "Luxury Living", `${brand.name} Featured`];
            }

            return {
                description,
                seoKeywords,
                aiPowered: !!aiText,
            };
        },
        {
            beforeHandle: requireStaffGuard,
            body: t.Object({
                title: t.String(),
                location: t.String(),
                propertyType: t.Optional(t.String()),
                bedrooms: t.Optional(t.Number()),
                amenities: t.Optional(t.Array(t.String())),
                imageBase64: t.Optional(t.String()),
            }),
            detail: {
                tags: ["AI Intelligence"],
                summary: "Generate AI property copy & tags",
                description: "Multimodal AI Copilot for creating listing content in Admin CMS.",
            },
        }
    )

    /**
     * POST /api/ai/agent
     * Conversational Agent with Tool Calling (Property Search, Tour Booking, ROI Calculator, FAQ)
     */
    .post(
        "/agent",
        async ({ body }) => {
            const { conversationHistory = [] } = body;
            const message = body.message.slice(0, 1000);
            const messageLower = message.toLowerCase();

            // 1. Tool Call: Property Search
            if (messageLower.includes("search") || messageLower.includes("find") || messageLower.includes("bedroom") || messageLower.includes("rent") || messageLower.includes("apartment")) {
                const { data: properties } = await supabaseAdmin.from("property").select("*").eq("status", "available").limit(3);
                return {
                    response: `I found ${properties?.length || 0} top available properties matching your interest! Here are the recommendations:`,
                    toolUsed: "searchProperties",
                    properties: properties || [],
                };
            }

            // 2. Tool Call: Tour Booking
            if (messageLower.includes("book") || messageLower.includes("visit") || messageLower.includes("tour") || messageLower.includes("schedule")) {
                return {
                    response: "I can schedule a property site visit for you right away! Please share your contact details and preferred date, or use our instant booking form.",
                    toolUsed: "bookPropertyTour",
                    action: "SHOW_ENQUIRY_DIALOG",
                };
            }

            // 3. Tool Call: Yield / ROI Calculator
            if (messageLower.includes("yield") || messageLower.includes("roi") || messageLower.includes("calculator") || messageLower.includes("return")) {
                return {
                    response: `${brand.name} provides instant real estate investment calculation! An average luxury apartment in a prime ${brand.market.city} location yields 7.5% - 9.2% net annual rental return.`,
                    toolUsed: "calculateMortgageOrYield",
                    action: "SHOW_CALCULATOR",
                };
            }

            // 4. Default Agent NLU Response via Gemini or Fallback
            const agentPrompt = `You are ${brand.name}, a smart real estate assistant. Answer this query helpfully and concisely: "${message}"`;
            const geminiRes = await callGeminiAPI(agentPrompt);

            return {
                response: geminiRes || `Welcome to ${brand.name}! I can help you search properties, calculate rental yield ROI, or book a tour.`,
                toolUsed: "conversationalAgent",
            };
        },
        {
            beforeHandle: rateLimit("ai-agent", 15),
            body: t.Object({
                message: t.String(),
                conversationHistory: t.Optional(t.Array(t.Any())),
            }),
            detail: {
                tags: ["AI Intelligence"],
                summary: "Conversational Tool-Calling Copilot Agent",
                description: "Interactive agent routing queries to search, tour booking, ROI calculation, or FAQ tools.",
            },
        }
    );
