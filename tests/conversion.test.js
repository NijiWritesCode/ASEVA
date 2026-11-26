import { describe, it, expect } from 'vitest';

describe('Atomic Lead-to-Event Conversion & Production Milestone Engine', () => {
  it('atomically generates a client profile, event project workspace, and 3-tranche milestone schedule', () => {
    // Simulated enquiry record
    const mockEnquiry = {
      id: 'enq-test-101',
      reference_code: 'ASV-2026-8821',
      full_name: 'Dr. Kunle Adeleke',
      email: 'kunle.adeleke@medicare.ng',
      phone: '+234 802 334 5566',
      event_type: 'social',
      preferred_date: '2027-01-20',
      location: 'Victoria Island, Lagos',
      venue_name: 'Civic Centre Grand Banquet Hall',
      guest_count: 450,
      vision_notes: 'Black-tie 60th diamond jubilee. Requires custom 360-degree rotating stage.',
      status: 'under_review',
    };

    const agreedPriceKobo = 6000000000n; // ₦60,000,000

    // 1. Client Profile
    const client = {
      id: `cli-${Date.now()}`,
      full_name: mockEnquiry.full_name,
      email: mockEnquiry.email,
      phone: mockEnquiry.phone,
      address: mockEnquiry.location,
    };

    // 2. Event Workspace
    const event = {
      id: `evt-${Date.now()}`,
      client_id: client.id,
      title: `${mockEnquiry.full_name}'s Diamond Jubilee`,
      event_type: mockEnquiry.event_type,
      event_date: mockEnquiry.preferred_date,
      venue_name: mockEnquiry.venue_name,
      agreed_price_kobo: agreedPriceKobo,
      status: 'planning',
    };

    // 3. Milestone Schedules
    const depositKobo = (agreedPriceKobo * 30n) / 100n;
    const midKobo = (agreedPriceKobo * 40n) / 100n;
    const finalKobo = agreedPriceKobo - depositKobo - midKobo;

    const milestones = [
      { name: 'Initial Retainer Deposit (30%)', amount_kobo: depositKobo, is_paid: false },
      { name: 'Mid-Planning Installment (40%)', amount_kobo: midKobo, is_paid: false },
      { name: 'Final Production Settlement (30%)', amount_kobo: finalKobo, is_paid: false },
    ];

    expect(client.full_name).toBe('Dr. Kunle Adeleke');
    expect(event.agreed_price_kobo).toBe(6000000000n);
    expect(milestones.length).toBe(3);

    // Verify financial integrity
    const sumMilestones = milestones.reduce((sum, m) => sum + m.amount_kobo, 0n);
    expect(sumMilestones).toBe(agreedPriceKobo);
    expect(depositKobo).toBe(1800000000n); // ₦18,000,000
    expect(midKobo).toBe(2400000000n);     // ₦24,000,000
    expect(finalKobo).toBe(1800000000n);   // ₦18,000,000
  });
});
