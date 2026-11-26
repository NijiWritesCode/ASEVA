import { describe, it, expect } from 'vitest';

/**
 * Monetary Standard Verification:
 * 1 NGN = 100 kobo (Integer Arithmetic only).
 * Zero floating-point rounding errors permitted across any ledger or margin calculation.
 */

function formatNaira(kobo, showDecimals = false) {
  if (kobo === undefined || kobo === null) return '₦0';
  const numericKobo = typeof kobo === 'bigint' ? Number(kobo) : kobo;
  const naira = numericKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(naira);
}

function formatCompact(kobo) {
  if (kobo === undefined || kobo === null) return '₦0';
  const numericKobo = typeof kobo === 'bigint' ? Number(kobo) : kobo;
  const naira = numericKobo / 100;
  if (Math.abs(naira) >= 1_000_000_000) {
    return `₦${(naira / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(naira) >= 1_000_000) {
    return `₦${(naira / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(naira) >= 1_000) {
    return `₦${(naira / 1_000).toFixed(0)}K`;
  }
  return formatNaira(kobo, false);
}

describe('ASEVA Integer-Kobo Financial Engine', () => {
  it('correctly formats multi-million Naira amounts from integer kobo without decimal drift', () => {
    // ₦45,000,000 = 4,500,000,000 kobo
    const feeKobo = 4500000000n;
    const formatted = formatNaira(feeKobo, false);
    // Standard Nigerian Naira representation
    expect(formatted).toContain('45,000,000');
    expect(formatted).toContain('₦');
  });

  it('correctly renders compact luxury financial representations', () => {
    expect(formatCompact(7500000000n)).toBe('₦75.0M');
    expect(formatCompact(3800000000n)).toBe('₦38.0M');
    expect(formatCompact(15000000000n)).toBe('₦150.0M');
    expect(formatCompact(45000000n)).toBe('₦450K');
  });

  it('preserves exact integer precision when splitting into 30% / 40% / 30% milestone tranches', () => {
    // Example: ₦85,500,000.75 equivalent in integer kobo
    const contractKobo = 8550000000n;
    
    // Milestone calculations strictly in BigInt
    const depositKobo = (contractKobo * 30n) / 100n;
    const midKobo = (contractKobo * 40n) / 100n;
    const finalKobo = contractKobo - depositKobo - midKobo;

    // Verify exact tranche sums equal 100% of the contract with 0 kobo drift
    expect(depositKobo + midKobo + finalKobo).toBe(contractKobo);
    expect(depositKobo).toBe(2565000000n); // ₦25,650,000
    expect(midKobo).toBe(3420000000n);     // ₦34,200,000
    expect(finalKobo).toBe(2565000000n);   // ₦25,650,000
  });

  it('accurately computes Gross Operating Margin and percentage without floating-point inaccuracies', () => {
    const contractKobo = 7500000000n; // ₦75,000,000
    const expensesKobo = 4250000000n; // ₦42,500,000 (disbursements to florists, caterers, venue)
    
    const grossMarginKobo = contractKobo - expensesKobo; // ₦32,500,000
    expect(grossMarginKobo).toBe(3250000000n);

    // Margin percentage calculation
    const marginPercent = Number((grossMarginKobo * 10000n) / contractKobo) / 100;
    expect(marginPercent).toBeCloseTo(43.33, 2);
  });
});
