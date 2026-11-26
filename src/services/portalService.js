import { dashboardService } from './dashboardService';

/**
 * Patron Self-Service Portal Service
 * Allows clients to view their event workspace, countdown, payment schedules,
 * and settle milestones securely via Paystack without requiring internal staff accounts.
 */

export const portalService = {
  /**
   * Looks up an event workspace by booking reference code, event ID, or client email
   * @param {string} codeOrEmail Reference code (e.g. ASV-2026-1001), event ID (evt-001), or email
   * @returns {Promise<Object>} Enriched client event portal data
   */
  async lookupEvent(codeOrEmail) {
    if (!codeOrEmail || !codeOrEmail.trim()) {
      throw new Error('Please enter a valid reference code, event ID, or email address.');
    }

    const state = dashboardService._getRawState();
    const query = codeOrEmail.trim().toLowerCase();

    // 1. Try finding by event ID
    let event = state.events.find((e) => e.id.toLowerCase() === query);

    // 2. Try finding via associated inquiry reference code
    if (!event) {
      const enq = state.enquiries.find((eq) => eq.reference_code.toLowerCase() === query);
      if (enq && enq.converted_event_id) {
        event = state.events.find((e) => e.id === enq.converted_event_id);
      }
      if (!event && enq) {
        // Inquiry exists but hasn't been converted to event yet
        return {
          type: 'enquiry_only',
          enquiry: enq,
          message: 'Your inquiry has been received and is currently under seasonal director review.',
        };
      }
    }

    // 3. Try finding by client email
    if (!event) {
      const client = state.clients.find((c) => c.email.toLowerCase() === query);
      if (client) {
        event = state.events.find((e) => e.client_id === client.id);
      }
    }

    // Default to the flagship Danjuma Nuptials if 'demo' is requested
    if (!event && query === 'demo') {
      event = state.events[0];
    }

    if (!event) {
      throw new Error(`No active celebration found matching "${codeOrEmail}". Please check your booking confirmation email.`);
    }

    // Enrich event details
    const client = state.clients.find((c) => c.id === event.client_id) || {
      full_name: 'Valued Patron',
      email: query,
    };

    const paymentSchedules = state.payment_schedules.filter((s) => s.event_id === event.id);
    const payments = state.payments.filter((p) => p.event_id === event.id && p.status === 'confirmed');

    const totalPaidKobo = payments.reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);
    const agreedPriceKobo = BigInt(event.agreed_price_kobo);
    const balanceKobo = agreedPriceKobo > totalPaidKobo ? agreedPriceKobo - totalPaidKobo : 0n;

    // Calculate countdown
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      type: 'confirmed_event',
      event: {
        ...event,
        days_remaining: daysRemaining,
      },
      client,
      financials: {
        agreed_price_kobo: Number(agreedPriceKobo),
        total_paid_kobo: Number(totalPaidKobo),
        balance_kobo: Number(balanceKobo),
      },
      payment_schedules: paymentSchedules,
      payments,
      roadmap: [
        {
          phase: 'Phase 01',
          title: 'Spatial Concept & Floral Architecture',
          description: 'Design boards, color palette, custom fabrications, and 3D floral sketches.',
          status: 'completed',
          date: 'Completed',
        },
        {
          phase: 'Phase 02',
          title: 'Venue 3D Spatial Layout & Guest Flow',
          description: 'Technical CAD layout, red carpet ingress, VIP security positioning, and staging.',
          status: 'completed',
          date: 'Completed',
        },
        {
          phase: 'Phase 03',
          title: 'Culinary Curation & Table Styling',
          description: '5-course private tasting, signature cocktail mixology, and imported glassware styling.',
          status: 'in_progress',
          date: 'Active Production',
        },
        {
          phase: 'Phase 04',
          title: 'Technical AV Rig & Rehearsal Run-of-Show',
          description: 'Curved LED wall calibration, orchestral sound check, and protocol timing.',
          status: 'upcoming',
          date: 'T-7 Days',
        },
        {
          phase: 'Phase 05',
          title: 'Execution & Seamless Day-of Orchestration',
          description: 'Executive on-site direction from dawn setup to late-night luxury concierge departure.',
          status: 'upcoming',
          date: 'Event Day',
        },
      ],
    };
  },
};
