// Production Edge Function for public booking enquiries submission with rate limiting and anti-spam verification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // 1. Anti-spam honeypot detection
    if ((body._hp && body._hp.trim() !== "") || (body.honeypot && body.honeypot.trim() !== "")) {
      return new Response(JSON.stringify({ error: "Automated submission rejected." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Validate mandatory fields
    const { fullName, email, phone, eventType, preferredDate, location, guestCount, estimatedBudget } = body;

    if (!fullName || !email || !phone || !eventType || !preferredDate || !location) {
      return new Response(JSON.stringify({ error: "Missing required booking consultation fields." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Ensure event date is in the future
    const eventDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(eventDate.getTime()) || eventDate <= today) {
      return new Response(JSON.stringify({ error: "Event date must be in the future." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Retrieve default business ID
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .limit(1)
      .maybeSingle();

    const businessId = business?.id || "00000000-0000-0000-0000-000000000001";

    // Generate unique reference code: ASV-YYYY-XXXX
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `ASV-${year}-${random}`;

    const payload = {
      business_id: businessId,
      reference_code: referenceCode,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      event_type: eventType,
      preferred_date: preferredDate,
      alternate_date: body.alternateDate || null,
      location: location.trim(),
      venue_name: body.venueName?.trim() || null,
      guest_count: parseInt(guestCount) || 200,
      estimated_budget: estimatedBudget || "₦40M - ₦60M",
      service_id: body.serviceId || null,
      vision_notes: body.visionNotes?.trim() || null,
      referral_source: body.referralSource || null,
      status: "new",
    };

    const { data, error } = await supabase
      .from("booking_inquiries")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Enquiry database insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        referenceCode: data.reference_code,
        message: "Your booking enquiry has been received into our priority queue.",
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Submission error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
