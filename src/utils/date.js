import { format, parseISO, isValid } from 'date-fns';

/**
 * Standard business date format for ASEVA (e.g., "18 April 2027")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatLagosDate(date) {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '—';
  return format(parsed, 'd MMMM yyyy');
}

/**
 * Short date format for tables and chips (e.g., "18 Apr 2027")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatShortDate(date) {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '—';
  return format(parsed, 'd MMM yyyy');
}

/**
 * Date and time format for audit logs and payments (e.g., "18 Apr 2027, 14:30")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '—';
  return format(parsed, 'd MMM yyyy, HH:mm');
}
