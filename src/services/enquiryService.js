import { supabase } from '../api/client';
import { dashboardService } from './dashboardService';
import { queryClient } from '../api/queryClient';

const RATE_LIMIT_KEY = 'aseva_enquiry_rate_limit';
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const enquiryService = {
  /**
   * Checks client-side rate limit to prevent automated spam
   */
  checkRateLimit() {
    try {
      const historyStr = localStorage.getItem(RATE_LIMIT_KEY);
      const now = Date.now();
      let timestamps = historyStr ? JSON.parse(historyStr) : [];
      // Clean timestamps older than window
      timestamps = timestamps.filter((ts) => now - ts < WINDOW_MS);
      if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
        throw new Error('Too many booking submissions. For high-priority consultations, please contact our concierge directly.');
      }
      return timestamps;
    } catch (e) {
      if (e.message.includes('Too many booking')) throw e;
      return [];
    }
  },

  /**
   * Records a timestamp to rate limit ledger
   */
  recordSubmissionTimestamp(timestamps) {
    try {
      timestamps.push(Date.now());
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
    } catch (e) {
      // Storage unavailable, ignore
    }
  },

  /**
   * Submits a new booking enquiry
   * @param {Object} formData Validated form fields
   * @returns {Promise<{ success: boolean, referenceCode: string, message: string }>}
   */
  async submitEnquiry(formData) {
    // 1. Bot check via honeypot field
    if ((formData._hp && formData._hp.trim() !== '') || (formData.honeypot && formData.honeypot.trim() !== '')) {
      throw new Error('Bot submission detected.');
    }

    // 2. Client-side rate limiting check
    const rateLimitHistory = this.checkRateLimit();

    // 3. Date validation check
    const eventDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(eventDate.getTime()) || eventDate <= today) {
      throw new Error('Preferred event date must be in the future.');
    }

    // 4. Generate structured reference code
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `ASV-${year}-${randomSuffix}`;

    const payload = {
      reference_code: referenceCode,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      event_type: formData.eventType,
      preferred_date: formData.preferredDate,
      alternate_date: formData.alternateDate || null,
      location: formData.location,
      venue_name: formData.venueName || null,
      guest_count: formData.guestCount,
      estimated_budget: formData.estimatedBudget,
      service_id: formData.serviceId || null,
      vision_notes: formData.visionNotes || null,
      referral_source: formData.referralSource || null,
      status: 'new',
    };

    // 5. Always synchronize with the local operational dashboard store
    try {
      await dashboardService.createEnquiry(payload);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (syncErr) {
      console.warn('Dashboard sync warning:', syncErr);
    }

    // 6. Record rate-limit timestamp
    this.recordSubmissionTimestamp(rateLimitHistory);

    // 7. Try Supabase insert only if configured with a real backend URL
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
    const hasLiveSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (hasLiveSupabase) {
      try {
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .limit(1)
          .maybeSingle();

        const businessId = business?.id || '00000000-0000-0000-0000-000000000001';

        const dbPayload = {
          ...payload,
          business_id: businessId,
        };

        const { data, error } = await supabase
          .from('booking_inquiries')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          console.warn('Supabase DB sync note:', error.message);
        }

        if (data?.reference_code) {
          return {
            success: true,
            referenceCode: data.reference_code,
            message: 'Your booking enquiry has been received into our executive priority queue.',
          };
        }
      } catch (err) {
        console.warn('Backend sync note:', err);
      }
    }

    return {
      success: true,
      referenceCode,
      message: 'Your booking enquiry has been received into our executive priority queue.',
    };
  },
};
