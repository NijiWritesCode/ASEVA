/**
 * Financial Currency Utilities for ASEVA
 * Rule: All money is stored as integer kobo (1 NGN = 100 kobo).
 * Avoid floating point calculations.
 */

/**
 * Formats integer kobo into standard Nigerian Naira display string (e.g. ₦3,500,000.00)
 * @param {number|bigint|string} koboAmount
 * @param {boolean} includeKoboDecimals
 * @returns {string}
 */
export function formatKoboToNaira(koboAmount, includeKoboDecimals = true) {
  if (koboAmount === null || koboAmount === undefined || isNaN(Number(koboAmount))) {
    return '₦0.00';
  }

  const naira = Number(koboAmount) / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: includeKoboDecimals ? 2 : 0,
    maximumFractionDigits: includeKoboDecimals ? 2 : 0,
  }).format(naira);
}

/**
 * Compact formatting for KPI cards and charts (e.g. ₦3.5M, ₦500K)
 * @param {number|bigint|string} koboAmount
 * @returns {string}
 */
export function formatCompactKobo(koboAmount) {
  if (!koboAmount || isNaN(Number(koboAmount))) return '₦0';
  const naira = Number(koboAmount) / 100;

  if (naira >= 1_000_000_000) {
    return `₦${(naira / 1_000_000_000).toFixed(1)}B`;
  }
  if (naira >= 1_000_000) {
    return `₦${(naira / 1_000_000).toFixed(1)}M`;
  }
  if (naira >= 1_000) {
    return `₦${(naira / 1_000).toFixed(0)}K`;
  }
  return `₦${naira.toFixed(0)}`;
}

/**
 * Converts user-entered Naira decimal into integer kobo
 * @param {number|string} nairaAmount
 * @returns {number}
 */
export function nairaToKobo(nairaAmount) {
  if (!nairaAmount) return 0;
  const cleaned = typeof nairaAmount === 'string' 
    ? nairaAmount.replace(/[^0-9.]/g, '') 
    : nairaAmount;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100);
}
