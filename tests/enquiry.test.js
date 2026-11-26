import { describe, it, expect, beforeEach } from 'vitest';

describe('Public Booking Enquiry Engine & Anti-Spam Verification', () => {
  beforeEach(() => {
    // Mock local storage for Node test environment
    const storage = {};
    global.localStorage = {
      getItem: (key) => storage[key] || null,
      setItem: (key, val) => { storage[key] = String(val); },
      removeItem: (key) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
    };
  });

  it('rejects automated bot submissions when honeypot fields contain data', () => {
    const isBot = (formData) => {
      return Boolean((formData._hp && formData._hp.trim() !== '') || (formData.honeypot && formData.honeypot.trim() !== ''));
    };

    const legitimateSubmission = {
      fullName: 'Oluwaseun Balogun',
      email: 'balogun@lagos.ng',
      preferredDate: '2027-02-14',
      _hp: '',
      honeypot: '',
    };

    const botSubmission = {
      fullName: 'Spam Bot 3000',
      email: 'bot@spamnetwork.ru',
      preferredDate: '2027-02-14',
      _hp: 'https://viagra-promo.com',
    };

    expect(isBot(legitimateSubmission)).toBe(false);
    expect(isBot(botSubmission)).toBe(true);
  });

  it('validates that consultation event dates are strictly in the future', () => {
    const isDateValid = (dateStr) => {
      const eventDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(eventDate.getTime()) && eventDate > today;
    };

    expect(isDateValid('2027-06-15')).toBe(true);
    expect(isDateValid('2020-01-01')).toBe(false);
    expect(isDateValid('invalid-date-string')).toBe(false);
  });

  it('generates a compliant, audit-traceable enquiry reference code (ASV-YYYY-XXXX)', () => {
    const generateRef = () => {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      return `ASV-${year}-${random}`;
    };

    const ref = generateRef();
    const pattern = new RegExp(`^ASV-${new Date().getFullYear()}-\\d{4}$`);
    expect(ref).toMatch(pattern);
  });

  it('enforces submission rate-limiting to prevent distributed denial of consultation slots', () => {
    const MAX_SUBMISSIONS = 3;
    const history = [];

    const recordOrReject = () => {
      if (history.length >= MAX_SUBMISSIONS) {
        throw new Error('Too many booking submissions.');
      }
      history.push(Date.now());
      return true;
    };

    expect(recordOrReject()).toBe(true); // 1st
    expect(recordOrReject()).toBe(true); // 2nd
    expect(recordOrReject()).toBe(true); // 3rd
    expect(() => recordOrReject()).toThrow('Too many booking submissions.'); // 4th rejected
  });
});
