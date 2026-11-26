import { describe, it, expect } from 'vitest';
import { paystackService } from '../src/services/paystackService';

describe('Paystack Luxury Event Payment Integration', () => {
  it('generates a unique and traceable Paystack transaction reference with correct prefixes', () => {
    const ref = paystackService.generateReference();
    expect(ref.startsWith('PSTK-ASV')).toBe(true);
    expect(ref).toContain(String(new Date().getFullYear()));
  });

  it('initializes a Paystack transaction configuration with exact integer kobo without decimals', () => {
    const txConfig = paystackService.initializeTransaction({
      email: 'client@danjumagroup.ng',
      amountKobo: 2250000000, // ₦22,500,000 (30% deposit)
      eventId: 'evt-001',
      milestoneId: 'sch-001',
      eventTitle: 'The Danjuma Imperial Nuptials',
      milestoneName: 'Initial Retainer Deposit (30%)',
    });

    expect(txConfig.currency).toBe('NGN');
    expect(txConfig.email).toBe('client@danjumagroup.ng');
    expect(txConfig.amount).toBe(2250000000);
    expect(Number.isInteger(txConfig.amount)).toBe(true);
    expect(txConfig.metadata.eventId).toBe('evt-001');
    expect(txConfig.metadata.milestoneId).toBe('sch-001');
    expect(txConfig.metadata.custom_fields.length).toBe(3);
  });

  it('rejects invalid or non-positive transaction amounts', () => {
    expect(() =>
      paystackService.initializeTransaction({
        email: 'test@example.com',
        amountKobo: 0,
        eventId: 'evt-001',
        milestoneId: 'sch-001',
        eventTitle: 'Test Event',
        milestoneName: 'Deposit',
      })
    ).toThrow('Transaction amount must be a positive integer kobo value.');
  });
});
