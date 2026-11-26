// Supabase Edge Function: submit-inquiry
// Runtime: Deno / TypeScript (mandated for Supabase Edge Functions)
// Description: Validates inbound booking enquiries, creates record with status 'new', and dispatches transactional emails via Resend.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface InquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  preferredDate: string;
  alternateDate?: string;
  location: string;
  venueName?: string;
  guestCount: string;
  estimatedBudget: string;
  serviceId?: string;
  visionNotes?: string;
  referralSource?: string;
  _hp?: string; // Honeypot
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: InquiryPayload = await req.json();

    // 1. Anti-abuse honeypot validation
    if (payload._hp && payload._hp.trim() !== '') {
      return new Response(
        JSON.stringify({ error: 'Bot submission rejected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate mandatory fields
    if (!payload.fullName || !payload.email || !payload.phone || !payload.eventType || !payload.preferredDate) {
      return new Response(
        JSON.stringify({ error: 'Missing mandatory fields' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Date validation (must be in future)
    const targetDate = new Date(payload.preferredDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (isNaN(targetDate.getTime()) || targetDate <= now) {
      return new Response(
        JSON.stringify({ error: 'Preferred event date must be in the future' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Initialize Supabase administrative client using backend secrets
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Retrieve target business workspace (default to first active business)
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, email')
      .limit(1)
      .maybeSingle();

    const businessId = business?.id || '00000000-0000-0000-0000-000000000001';

    // 6. Generate unique reference code (ASV-YYYY-XXXX)
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `ASV-${year}-${randomSuffix}`;

    // 7. Insert enquiry record
    const { data: inquiry, error: insertError } = await supabase
      .from('booking_inquiries')
      .insert([
        {
          business_id: businessId,
          reference_code: referenceCode,
          full_name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          event_type: payload.eventType,
          preferred_date: payload.preferredDate,
          alternate_date: payload.alternateDate || null,
          location: payload.location,
          venue_name: payload.venueName || null,
          guest_count: payload.guestCount,
          estimated_budget: payload.estimatedBudget,
          service_id: payload.serviceId || null,
          vision_notes: payload.visionNotes || null,
          referral_source: payload.referralSource || null,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to record booking enquiry', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Transactional email dispatch via Resend (decoupled from booking creation)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        // A. Email to customer
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ASEVA Concierge <concierge@asevaevents.com>',
            to: [payload.email],
            subject: `Enquiry Received: ${referenceCode} — ASEVA Event Architecture`,
            html: `
              <div style="font-family: serif; color: #121316; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h1 style="color: #D4AF37; font-size: 24px; letter-spacing: 2px;">ASEVA</h1>
                <p>Dear ${payload.fullName},</p>
                <p>Thank you for inquiring with ASEVA for your upcoming <strong>${payload.eventType}</strong> on <strong>${payload.preferredDate}</strong>.</p>
                <p>Your booking reference code is: <strong>${referenceCode}</strong>.</p>
                <p>Our concierge team is reviewing calendar availability and will be in contact within 24 to 48 hours for a discovery consultation.</p>
                <hr style="border: none; border-top: 1px solid #E8E2D5; margin: 24px 0;" />
                <p style="font-size: 11px; color: #6B7280;">ASEVA Luxury Event Architecture • Victoria Island, Lagos, Nigeria</p>
              </div>
            `,
          }),
        });

        // B. Administrative notification to ASEVA staff
        const staffEmail = business?.email || 'concierge@asevaevents.com';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ASEVA Platform <system@asevaevents.com>',
            to: [staffEmail],
            subject: `[New Inquiry] ${referenceCode} — ${payload.fullName} (${payload.eventType})`,
            html: `
              <div style="font-family: sans-serif; color: #121316; padding: 20px;">
                <h2>New Booking Enquiry Received</h2>
                <p><strong>Client:</strong> ${payload.fullName} (${payload.email}, ${payload.phone})</p>
                <p><strong>Event:</strong> ${payload.eventType} on ${payload.preferredDate}</p>
                <p><strong>Location:</strong> ${payload.location} (${payload.venueName || 'No venue specified'})</p>
                <p><strong>Budget / Guests:</strong> ${payload.estimatedBudget} / ${payload.guestCount}</p>
                <p><strong>Vision:</strong> ${payload.visionNotes || 'N/A'}</p>
                <p><a href="http://localhost:3000/dashboard/enquiries">View in ASEVA Dashboard</a></p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        // Email failure does NOT invalidate enquiry creation
        console.warn('Resend email dispatch error:', emailErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        referenceCode,
        message: 'Your booking enquiry has been received into our priority queue.',
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Server error', details: err?.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
