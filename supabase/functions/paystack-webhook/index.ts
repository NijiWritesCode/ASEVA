// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This serves as the production webhook handler for Paystack automated payment notifications.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing Paystack signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const bodyText = await req.text();

    // Verify HMAC SHA512 Signature
    if (PAYSTACK_SECRET_KEY) {
      const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
        .update(bodyText)
        .digest("hex");

      if (hash !== signature) {
        return new Response(JSON.stringify({ error: "Invalid signature verification" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const event = JSON.parse(bodyText);

    // Only process successful charges
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const amountKobo = data.amount; // Paystack gives amount in integer kobo
      const metadata = data.metadata || {};
      const eventId = metadata.eventId || metadata.event_id;
      const milestoneId = metadata.milestoneId || metadata.milestone_id;

      if (!eventId) {
        console.warn("Paystack webhook received without target eventId in metadata");
        return new Response(JSON.stringify({ status: "acknowledged_no_event" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Check idempotency: has this transaction already been recorded?
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("transaction_reference", reference)
        .maybeSingle();

      if (existingPayment) {
        return new Response(JSON.stringify({ status: "already_processed" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Record verified payment in ledger
      const { error: insertError } = await supabase.from("payments").insert([
        {
          event_id: eventId,
          schedule_id: milestoneId || null,
          amount_kobo: amountKobo,
          payment_method: "paystack",
          transaction_reference: reference,
          payment_date: data.paid_at || new Date().toISOString(),
          status: "confirmed",
          recorded_by: "Paystack Automated Webhook",
          notes: `Automated Paystack settlement. Channel: ${data.channel || "card"}. Customer: ${data.customer?.email || "Unknown"}.`,
        },
      ]);

      if (insertError) {
        console.error("Failed to insert payment record:", insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // If tied to milestone schedule, mark milestone as paid
      if (milestoneId) {
        await supabase
          .from("payment_schedules")
          .update({ is_paid: true })
          .eq("id", milestoneId);
      }

      return new Response(JSON.stringify({ status: "success", reference }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "ignored_event", event: event.event }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
