import { describe, it, expect, beforeEach } from 'vitest';
import { portalService } from '../src/services/portalService';
import { dashboardService } from '../src/services/dashboardService';

describe('Patron Self-Service Portal Service', () => {
  beforeEach(() => {
    // Reset stored state before each test
    dashboardService.resetToSeedData();
  });

  it('rejects lookup with empty or whitespace-only code', async () => {
    await expect(portalService.lookupEvent('')).rejects.toThrow(
      'Please enter a valid reference code, event ID, or email address.'
    );
    await expect(portalService.lookupEvent('   ')).rejects.toThrow(
      'Please enter a valid reference code, event ID, or email address.'
    );
  });

  it('successfully retrieves confirmed event workspace by event ID', async () => {
    const result = await portalService.lookupEvent('evt-001');

    expect(result.type).toBe('confirmed_event');
    expect(result.event).toBeDefined();
    expect(result.event.id).toBe('evt-001');
    expect(result.event.title).toBe('The Danjuma Imperial Nuptials');
    expect(result.client).toBeDefined();
    expect(result.client.full_name).toBe('Alhaji Mansur Danjuma');

    // Check financial vitals
    expect(result.financials).toBeDefined();
    expect(result.financials.agreed_price_kobo).toBe(7500000000);
    expect(result.financials.total_paid_kobo).toBe(5250000000); // 22.5M + 30M
    expect(result.financials.balance_kobo).toBe(2250000000); // 22.5M

    // Check payment schedules and roadmap
    expect(result.payment_schedules.length).toBeGreaterThan(0);
    expect(result.payments.length).toBeGreaterThan(0);
    expect(result.roadmap.length).toBe(5);
    expect(result.roadmap[0].title).toContain('Spatial Concept');
  });

  it('retrieves flagship celebration when querying with demo keyword', async () => {
    const result = await portalService.lookupEvent('demo');

    expect(result.type).toBe('confirmed_event');
    expect(result.event.id).toBe('evt-001');
    expect(typeof result.event.days_remaining).toBe('number');
  });

  it('returns enquiry_only state when reference belongs to unconverted inquiry', async () => {
    const result = await portalService.lookupEvent('ASV-2026-1042');

    expect(result.type).toBe('enquiry_only');
    expect(result.enquiry).toBeDefined();
    expect(result.enquiry.reference_code).toBe('ASV-2026-1042');
    expect(result.message).toContain('seasonal director review');
  });

  it('locates confirmed event by client email', async () => {
    const result = await portalService.lookupEvent('mansur@danjumagroup.com');

    expect(result.type).toBe('confirmed_event');
    expect(result.event.client_id).toBe('cli-001');
    expect(result.client.email).toBe('mansur@danjumagroup.com');
  });

  it('locates confirmed event by enquiry reference code after conversion', async () => {
    // 1. Convert enq-001
    const { event, enquiry } = await dashboardService.convertEnquiryToBooking('enq-001', {
      agreedPriceKobo: 4500000000,
      leadPlanner: 'Test Planner',
    });

    // 2. Lookup by reference code
    const result = await portalService.lookupEvent(enquiry.reference_code);

    expect(result.type).toBe('confirmed_event');
    expect(result.event.id).toBe(event.id);
    expect(result.financials.agreed_price_kobo).toBe(4500000000);
  });

  it('throws error if reference code or email does not match any record', async () => {
    await expect(portalService.lookupEvent('UNKNOWN-REF-99999')).rejects.toThrow(
      'No active celebration found matching'
    );
  });
});
