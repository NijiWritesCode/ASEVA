import { describe, it, expect, beforeEach } from 'vitest';
import { enquiryService } from '../src/services/enquiryService';
import { dashboardService } from '../src/services/dashboardService';

describe('End-to-End Booking Reflection & Dashboard Sync', () => {
  beforeEach(() => {
    // Setup isolated localStorage
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('immediately reflects public booking submission and conversion to upcoming production schedule', async () => {
    // 1. Initial State
    const initialMetrics = await dashboardService.getDashboardMetrics();
    const initialCount = initialMetrics.newEnquiriesCount;
    const initialActiveEvents = initialMetrics.activeEventsCount;

    // 2. Client submits booking on public website
    const submissionResult = await enquiryService.submitEnquiry({
      fullName: 'Chief Adeleke Davies',
      email: 'adeleke@davies.ng',
      phone: '+234 803 111 2233',
      eventType: 'wedding',
      preferredDate: '2027-05-15',
      location: 'Banana Island, Lagos',
      venueName: 'Private Oceanfront Estate',
      guestCount: '600',
      estimatedBudget: '₦100M+',
      visionNotes: 'Floating glass marquee over the lagoon with bespoke floral arches.',
    });

    expect(submissionResult.success).toBe(true);
    expect(submissionResult.referenceCode).toBeDefined();

    // 3. Staff opens /dashboard/enquiries
    const enquiries = await dashboardService.getEnquiries();
    expect(enquiries.length).toBeGreaterThan(0);
    
    // Most recent inquiry is at index 0
    const latestEnquiry = enquiries[0];
    expect(latestEnquiry.full_name).toBe('Chief Adeleke Davies');
    expect(latestEnquiry.status).toBe('new');

    // 4. Staff opens /dashboard (Overview)
    const updatedMetrics = await dashboardService.getDashboardMetrics();
    expect(updatedMetrics.newEnquiriesCount).toBe(initialCount + 1);

    // 5. Staff clicks "Convert to Confirmed Event" and confirms in modal
    const conversionResult = await dashboardService.convertEnquiryToBooking({
      inquiryId: latestEnquiry.id,
      agreedPriceKobo: 9500000000, // ₦95,000,000
      eventTitle: 'The Davies Oceanfront Nuptials',
      leadPlanner: 'Folashade Adeleke',
    });

    expect(conversionResult.event).toBeDefined();
    expect(conversionResult.event.title).toBe('The Davies Oceanfront Nuptials');
    expect(conversionResult.event.agreed_price_kobo).toBe(9500000000);

    // 6. Verify that it appears in Upcoming Production Schedule
    const postConvertMetrics = await dashboardService.getDashboardMetrics();
    expect(postConvertMetrics.activeEventsCount).toBe(initialActiveEvents + 1);

    // Verify it is present in the upcoming production schedule list
    const foundInSchedule = postConvertMetrics.upcomingEvents.some(
      (ev) => ev.title === 'The Davies Oceanfront Nuptials'
    );
    expect(foundInSchedule).toBe(true);

    // Verify master events list has it
    const allEvents = await dashboardService.getEvents();
    expect(allEvents.some((ev) => ev.title === 'The Davies Oceanfront Nuptials')).toBe(true);
  });
});
