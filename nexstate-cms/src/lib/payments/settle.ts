import { supabaseAdmin } from "@/lib/db";
import { toMinor } from "./index";

export type SettleOutcome =
    | {
          outcome: "paid";
          provider: string;
          providerOrderId: string;
          providerPaymentId: string;
          /** Amount the provider says was paid, in minor units. Omit when the amount is already bound by a signed order. */
          amountMinor?: number;
          currency?: string;
          raw?: unknown;
      }
    | {
          outcome: "failed";
          provider: string;
          providerOrderId: string;
          providerPaymentId?: string;
          reason?: string;
          raw?: unknown;
      };

export interface SettleResult {
    ok: boolean;
    /** Payment status after this call. */
    status: "success" | "failed" | "pending" | "cancelled" | "unknown";
    /** True when another request (webhook or browser) had already settled this payment. */
    alreadySettled?: boolean;
    bookingStatus?: string;
    error?: string;
}

/**
 * Applies a provider outcome to our payment record. Safe to call any number of times and
 * from concurrent requests (browser verify + webhook): the payment is claimed with a
 * conditional UPDATE so the booking is created exactly once, and the booking itself goes
 * through book_property_period(), which locks the property row and rejects overlaps.
 */
export async function settlePayment(o: SettleOutcome): Promise<SettleResult> {
    const { data: payment, error: findError } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("provider", o.provider)
        .eq("provider_order_id", o.providerOrderId)
        .maybeSingle();

    if (findError || !payment) return { ok: false, status: "unknown", error: "Unknown order" };

    if (o.outcome === "failed") {
        // Never downgrade a successful payment; only a still-pending one can fail.
        await supabaseAdmin
            .from("payments")
            .update({
                status: "failed",
                provider_payment_id: o.providerPaymentId ?? payment.provider_payment_id,
                provider_status: "failed",
                provider_response: { reason: o.reason ?? null, event: o.raw ?? null },
                updated_at: new Date().toISOString(),
            })
            .eq("id", payment.id)
            .eq("status", "pending");
        return { ok: true, status: payment.status === "success" ? "success" : "failed" };
    }

    // paid: the provider-reported amount and currency must match what we created the order for
    if (o.amountMinor !== undefined || o.currency !== undefined) {
        const expectedMinor = toMinor(Number(payment.amount));
        if (o.amountMinor !== expectedMinor || (o.currency && o.currency !== payment.currency)) {
            console.error("Payment amount/currency mismatch", { order: payment.order_number });
            await supabaseAdmin
                .from("payments")
                .update({
                    status: "failed",
                    provider_status: "amount_mismatch",
                    provider_response: o.raw ?? null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", payment.id)
                .neq("status", "success");
            return { ok: false, status: "failed", error: "Amount mismatch" };
        }
    }

    // Claim: only one caller flips the row to success.
    const now = new Date().toISOString();
    const { data: claimed } = await supabaseAdmin
        .from("payments")
        .update({
            status: "success",
            provider_payment_id: o.providerPaymentId,
            provider_status: "paid",
            provider_response: o.raw ?? null,
            paid_at: now,
            updated_at: now,
        })
        .eq("id", payment.id)
        .neq("status", "success")
        .select("id")
        .maybeSingle();

    if (!claimed) {
        return { ok: true, status: "success", alreadySettled: true, bookingStatus: payment.booking_status };
    }

    // Booking
    let bookingStatus = "not_applicable";
    if (payment.property_id && payment.check_in_date && payment.check_out_date) {
        const { data: result, error: rpcError } = await supabaseAdmin.rpc("book_property_period", {
            p_property_id: payment.property_id,
            p_period: {
                start_date: payment.check_in_date,
                end_date: payment.check_out_date,
                tenant_name: payment.user_name,
                tenant_email: payment.user_email,
                tenant_phone: payment.user_phone,
                amount: Number(payment.amount),
                guests: payment.guests || 1,
                status: "confirmed",
                payment_id: payment.id,
                created_at: now,
            },
        });

        if (rpcError) {
            console.error("book_property_period failed", rpcError);
            bookingStatus = "error";
        } else {
            bookingStatus = String(result);
        }

        // "conflict": the customer paid but the dates were taken in the meantime. Surface it for a refund.
        if (bookingStatus === "confirmed" && payment.enquiry_id) {
            await supabaseAdmin.from("enquiry").update({ status: "converted" }).eq("id", payment.enquiry_id);
        }
        if (bookingStatus !== "confirmed") {
            console.error("Paid but booking not confirmed", { order: payment.order_number, bookingStatus });
        }
    }

    await supabaseAdmin.from("payments").update({ booking_status: bookingStatus }).eq("id", payment.id);
    return { ok: true, status: "success", bookingStatus };
}
