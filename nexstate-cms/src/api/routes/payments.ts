import { Elysia, t } from "elysia";
import { brand } from "@nexstate/brand";
import { rateLimit, requireStaffGuard } from "../guards";
import { areDatesAvailable, quoteStay } from "@/lib/rental-utils";
import { supabaseAdmin } from "@/lib/db";
import {
    PaymentConfigError,
    generateOrderNumber,
    getPaymentProvider,
    isValidAmount,
    toMinor,
    MAX_AMOUNT,
} from "@/lib/payments";
import { settlePayment } from "@/lib/payments/settle";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const paymentsRoutes = new Elysia({ prefix: "/payments" })
    /**
     * Create a checkout. The amount is ALWAYS computed here from the stored property
     * rate and the requested dates; any client-sent amount is ignored.
     * POST /api/payments/create-session
     */
    .post("/create-session", async ({ body, set }) => {
        const { propertyId, customerEmail, customerName, customerPhone, checkInDate, checkOutDate, guests, enquiryId } = body;

        if (!propertyId || !checkInDate || !checkOutDate) {
            set.status = 400;
            return { success: false, error: "propertyId, checkInDate and checkOutDate are required" };
        }
        if (!EMAIL_RE.test(customerEmail)) {
            set.status = 400;
            return { success: false, error: "Invalid email address" };
        }
        if (!customerName.trim()) {
            set.status = 400;
            return { success: false, error: "Name is required" };
        }
        if (!ISO_DATE_RE.test(checkInDate) || !ISO_DATE_RE.test(checkOutDate)) {
            set.status = 400;
            return { success: false, error: "Dates must be YYYY-MM-DD" };
        }
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
            set.status = 400;
            return { success: false, error: "Invalid dates" };
        }

        const { data: property, error: propError } = await supabaseAdmin
            .from("property")
            .select("id, title, price, vat, booking_fee, exit_cleaning_fee, tourism_fee, security_deposit, status, current_rental_end, rental_periods")
            .eq("id", propertyId)
            .in("status", ["available", "rented"])
            .maybeSingle();

        if (propError || !property) {
            set.status = 404;
            return { success: false, error: "Property not found" };
        }

        const availability = areDatesAvailable(checkInDate, checkOutDate, property.current_rental_end, property.rental_periods || []);
        if (!availability.available) {
            set.status = 409;
            return { success: false, error: availability.reason || "Dates not available" };
        }

        const quote = quoteStay(property, checkInDate, checkOutDate);
        const amount = quote.total;
        if (!isValidAmount(amount)) {
            set.status = 400;
            return {
                success: false,
                error: `Online payment supports amounts up to ${brand.market.currencySymbol}${MAX_AMOUNT.toLocaleString(brand.market.locale)}. Please contact us to book this stay.`,
            };
        }

        let provider;
        try {
            provider = getPaymentProvider();
            if (!provider.isConfigured()) throw new PaymentConfigError("Payment provider credentials are missing");
        } catch (e) {
            console.error("Payment provider unavailable:", (e as Error).message);
            set.status = 503;
            return { success: false, error: "Online payments are not available right now" };
        }

        const orderNumber = generateOrderNumber(brand.orderPrefix);
        const currency = brand.market.currency;

        const { data: payment, error: dbError } = await supabaseAdmin
            .from("payments")
            .insert({
                order_number: orderNumber,
                property_id: propertyId,
                enquiry_id: enquiryId || null,
                user_email: customerEmail,
                user_name: customerName.trim(),
                user_phone: customerPhone || null,
                amount,
                currency,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                guests: guests || null,
                provider: provider.id,
                status: "pending",
            })
            .select("id")
            .single();

        if (dbError || !payment) {
            console.error("Failed to create payment record:", dbError);
            set.status = 500;
            return { success: false, error: "Could not start payment" };
        }

        try {
            const checkout = await provider.createCheckout({
                orderNumber,
                amountMinor: toMinor(amount),
                currency,
                description: `${property.title} (${checkInDate} to ${checkOutDate})`.slice(0, 250),
                customer: { name: customerName.trim(), email: customerEmail, phone: customerPhone },
            });

            await supabaseAdmin.from("payments").update({ provider_order_id: checkout.providerOrderId }).eq("id", payment.id);
            await supabaseAdmin.from("payment_sessions").insert({
                payment_id: payment.id,
                session_data: { provider_order: checkout.raw, quote } as object,
                expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            });

            return {
                success: true,
                order_number: orderNumber,
                provider: provider.id,
                amount,
                currency,
                quote,
                checkout: checkout.clientPayload,
            };
        } catch (error: any) {
            console.error("Checkout creation failed:", error?.message);
            await supabaseAdmin
                .from("payments")
                .update({ status: "failed", provider_status: "create_failed", updated_at: new Date().toISOString() })
                .eq("id", payment.id);
            set.status = error instanceof PaymentConfigError ? 503 : 502;
            return { success: false, error: "Online payments are not available right now" };
        }
    }, {
        beforeHandle: rateLimit("payments-create", 10),
        body: t.Object({
            propertyId: t.Optional(t.String()),
            amount: t.Optional(t.Number()), // ignored: computed server-side
            customerEmail: t.String(),
            customerName: t.String(),
            customerPhone: t.Optional(t.String()),
            checkInDate: t.Optional(t.String()),
            checkOutDate: t.Optional(t.String()),
            guests: t.Optional(t.Number()),
            enquiryId: t.Optional(t.String()),
            description: t.Optional(t.String()),
        }),
        detail: { tags: ["Payments"], summary: "Create a payment checkout" },
    })

    /**
     * Browser callback after checkout. The signed result proves the provider took the payment
     * for THIS order; we also require it to match the order we stored for this order number.
     * POST /api/payments/verify
     */
    .post("/verify", async ({ body, set }) => {
        let provider;
        try {
            provider = getPaymentProvider();
        } catch {
            set.status = 503;
            return { success: false, error: "Online payments are not available right now" };
        }

        const verified = provider.verifyClientPayment(body.data);
        if (!verified) {
            set.status = 400;
            return { success: false, error: "Payment could not be verified" };
        }

        const { data: payment } = await supabaseAdmin
            .from("payments")
            .select("id, provider_order_id")
            .eq("order_number", body.orderNumber)
            .maybeSingle();

        // Bind the signed provider order to the order number the caller claims
        if (!payment || payment.provider_order_id !== verified.providerOrderId) {
            set.status = 400;
            return { success: false, error: "Payment could not be verified" };
        }

        const result = await settlePayment({
            outcome: "paid",
            provider: provider.id,
            providerOrderId: verified.providerOrderId,
            providerPaymentId: verified.providerPaymentId,
            raw: { source: "client_verify", ...body.data },
        });

        return { success: result.ok, status: result.status, booking_status: result.bookingStatus };
    }, {
        beforeHandle: rateLimit("payments-verify", 20),
        body: t.Object({
            orderNumber: t.String(),
            data: t.Record(t.String(), t.Optional(t.String())),
        }),
        detail: { tags: ["Payments"], summary: "Verify a completed checkout" },
    })

    /**
     * The customer closed the checkout without paying.
     * POST /api/payments/cancel
     */
    .post("/cancel", async ({ body }) => {
        await supabaseAdmin
            .from("payments")
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("order_number", body.orderNumber)
            .eq("status", "pending");
        return { success: true };
    }, {
        beforeHandle: rateLimit("payments-cancel", 20),
        body: t.Object({ orderNumber: t.String() }),
        detail: { tags: ["Payments"], summary: "Mark an abandoned checkout as cancelled" },
    })

    /**
     * Server-to-server callback from the provider. The raw body is needed for signature
     * verification, so it is parsed as text here.
     * POST /api/payments/webhook
     */
    .post("/webhook", async ({ body, request, set }) => {
        let provider;
        try {
            provider = getPaymentProvider();
        } catch {
            set.status = 503;
            return "unavailable";
        }

        const rawBody = typeof body === "string" ? body : JSON.stringify(body);
        const event = provider.parseWebhook(rawBody, request.headers.get("x-razorpay-signature"));
        if (!event) {
            console.error("Webhook rejected: bad signature or malformed body");
            set.status = 400;
            return "invalid";
        }

        if (event.kind === "paid") {
            const r = await settlePayment({
                outcome: "paid",
                provider: provider.id,
                providerOrderId: event.providerOrderId,
                providerPaymentId: event.providerPaymentId,
                amountMinor: event.amountMinor,
                currency: event.currency,
                raw: event.raw,
            });
            if (!r.ok && r.error === "Unknown order") {
                // Not one of ours (e.g. another integration on the same account): acknowledge so it is not retried.
                return "ignored";
            }
        } else if (event.kind === "failed") {
            await settlePayment({
                outcome: "failed",
                provider: provider.id,
                providerOrderId: event.providerOrderId,
                providerPaymentId: event.providerPaymentId,
                reason: event.reason,
                raw: event.raw,
            });
        }

        return "ok";
    }, {
        parse: "text",
        detail: { tags: ["Payments"], summary: "Payment provider webhook" },
    })

    /**
     * Public status lookup by (unguessable) order number: non-PII fields only.
     * GET /api/payments/:orderNumber
     */
    .get("/:orderNumber", async ({ params, set }) => {
        const { data: payment, error } = await supabaseAdmin
            .from("payments")
            .select(`
                order_number, amount, currency, status, booking_status, created_at, paid_at,
                check_in_date, check_out_date, guests, provider_payment_id,
                property:property_id ( id, title )
            `)
            .eq("order_number", params.orderNumber)
            .maybeSingle();

        if (error || !payment) {
            set.status = 404;
            return { success: false, error: "Payment not found" };
        }
        return { success: true, payment };
    }, {
        params: t.Object({ orderNumber: t.String() }),
        detail: { tags: ["Payments"], summary: "Get payment status" },
    })

    /**
     * All payments (staff).
     * GET /api/payments
     */
    .get("/", async ({ query }) => {
        let queryBuilder = supabaseAdmin
            .from("payments")
            .select("*, property:property_id ( id, title )")
            .order("created_at", { ascending: false });

        if (query.status) queryBuilder = queryBuilder.eq("status", query.status);
        if (query.limit) queryBuilder = queryBuilder.limit(Math.min(parseInt(query.limit, 10) || 100, 500));

        const { data: payments, error } = await queryBuilder;
        if (error) return { success: false, error: error.message };
        return { success: true, payments, count: payments?.length || 0 };
    }, {
        beforeHandle: requireStaffGuard,
        query: t.Object({ status: t.Optional(t.String()), limit: t.Optional(t.String()) }),
        detail: { tags: ["Payments"], summary: "List payments (staff)" },
    })

    /**
     * Statistics for the admin dashboard (staff). Revenue counts successful payments only.
     * GET /api/payments/stats/summary
     */
    .get("/stats/summary", async () => {
        const { data: payments, error } = await supabaseAdmin.from("payments").select("amount, status");
        if (error) return { success: false, error: error.message };

        const rows = payments || [];
        const successful = rows.filter((p) => p.status === "success");
        return {
            success: true,
            stats: {
                total_payments: rows.length,
                successful_payments: successful.length,
                pending_payments: rows.filter((p) => p.status === "pending").length,
                failed_payments: rows.filter((p) => p.status === "failed").length,
                cancelled_payments: rows.filter((p) => p.status === "cancelled").length,
                successful_revenue: successful.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
            },
        };
    }, {
        beforeHandle: requireStaffGuard,
        detail: { tags: ["Payments"], summary: "Payment statistics (staff)" },
    });
