import { describe, it, expect, beforeEach } from 'vitest';
import { dashboardService } from '../src/services/dashboardService';
import { notificationService } from '../src/services/notificationService';

describe('Audit Ledger & Notification Engine', () => {
  beforeEach(() => {
    dashboardService.resetToSeedData();
  });

  describe('Immutable Audit Logging', () => {
    it('retrieves default seed audit logs ordered in reverse chronological order', async () => {
      const logs = await dashboardService.getAuditLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);

      // Verify reverse chronological order
      for (let i = 0; i < logs.length - 1; i++) {
        const current = new Date(logs[i].created_at).getTime();
        const next = new Date(logs[i + 1].created_at).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it('filters audit logs by entityId and action', async () => {
      const logsForEvt1 = await dashboardService.getAuditLogs({ entityId: 'evt-001' });
      expect(logsForEvt1.length).toBeGreaterThan(0);
      logsForEvt1.forEach((entry) => {
        expect(entry.entity_id).toBe('evt-001');
      });

      const conversionLogs = await dashboardService.getAuditLogs({ action: 'enquiry_converted' });
      conversionLogs.forEach((entry) => {
        expect(entry.action).toBe('enquiry_converted');
      });
    });

    it('creates and records manual audit log entries with logAction', async () => {
      const initialLogs = await dashboardService.getAuditLogs();
      const initialCount = initialLogs.length;

      const newEntry = await dashboardService.logAction({
        actorName: 'Audit Officer',
        action: 'security_override',
        entityType: 'system',
        entityId: 'sys-sec-01',
        description: 'Manual verification of VIP patron compliance.',
      });

      expect(newEntry.id).toBeDefined();
      expect(newEntry.actor_name).toBe('Audit Officer');
      expect(newEntry.action).toBe('security_override');

      const updatedLogs = await dashboardService.getAuditLogs();
      expect(updatedLogs.length).toBe(initialCount + 1);
      expect(updatedLogs[0].id).toBe(newEntry.id);
    });

    it('automatically records audit log when converting an enquiry to a booking', async () => {
      const initialLogs = await dashboardService.getAuditLogs({ action: 'enquiry_converted' });
      const initialCount = initialLogs.length;

      const { event } = await dashboardService.convertEnquiryToBooking('enq-001', {
        agreedPriceKobo: 4800000000,
        leadPlanner: 'Lead Orchestrator',
      });

      const updatedLogs = await dashboardService.getAuditLogs({ action: 'enquiry_converted' });
      expect(updatedLogs.length).toBe(initialCount + 1);
      expect(updatedLogs[0].entity_id).toBe(event.id);
      expect(updatedLogs[0].description).toContain('Converted enquiry');
    });

    it('automatically records audit log when recording a manual payment', async () => {
      const initialLogs = await dashboardService.getAuditLogs({ action: 'payment_recorded' });
      const initialCount = initialLogs.length;

      const payment = await dashboardService.recordManualPayment({
        eventId: 'evt-001',
        amountKobo: 500000000,
        paymentMethod: 'bank_transfer',
        reference: 'TRX-TEST-AUDIT-999',
        notes: 'Final balance test settlement',
        recordedBy: 'Finance Lead Tester',
      });

      const updatedLogs = await dashboardService.getAuditLogs({ action: 'payment_recorded' });
      expect(updatedLogs.length).toBe(initialCount + 1);
      expect(updatedLogs[0].entity_id).toBe(payment.id);
      expect(updatedLogs[0].description).toContain('bank transfer');
    });

    it('automatically records audit log when recording an expense', async () => {
      const initialLogs = await dashboardService.getAuditLogs({ action: 'expense_logged' });
      const initialCount = initialLogs.length;

      const expense = await dashboardService.recordExpense({
        eventId: 'evt-001',
        category: 'florals',
        vendorName: 'Bloom Master Africa',
        amountKobo: 350000000,
        description: 'Imported White Dutch Orchids',
        recordedBy: 'Florals Director',
      });

      const updatedLogs = await dashboardService.getAuditLogs({ action: 'expense_logged' });
      expect(updatedLogs.length).toBe(initialCount + 1);
      expect(updatedLogs[0].entity_id).toBe(expense.id);
      expect(updatedLogs[0].description).toContain('Bloom Master Africa');
    });
  });

  describe('Client Notification Service', () => {
    it('generates branded enquiry acknowledgement email template', () => {
      const notification = notificationService.generateEnquiryAcknowledgement({
        clientName: 'Lady Folake',
        referenceCode: 'ASV-2026-9999',
        eventType: 'gala',
        preferredDate: '2026-12-31',
      });

      expect(notification.channel).toBe('email');
      expect(notification.subject).toContain('ASV-2026-9999');
      expect(notification.body).toContain('Lady Folake');
      expect(notification.body).toContain('ASV-2026-9999');
      expect(notification.body).toContain('24 to 48 hours');
    });

    it('generates proposal and quotation notification template with portal link', () => {
      const notification = notificationService.generateQuotationNotification({
        clientName: 'Dr. Adeyemi',
        eventTitle: 'Adeyemi Silver Ball',
        agreedFeeNaira: '₦45,000,000',
        portalUrl: 'https://aseva.luxury/portal/ASV-2026-8888',
      });

      expect(notification.channel).toBe('email');
      expect(notification.subject).toContain('Adeyemi Silver Ball');
      expect(notification.body).toContain('₦45,000,000');
      expect(notification.body).toContain('https://aseva.luxury/portal/ASV-2026-8888');
    });

    it('generates milestone payment reminder notification template', () => {
      const notification = notificationService.generateMilestoneReminder({
        clientName: 'Chief Alabi',
        eventTitle: 'Alabi 25th Silver Jubilee',
        milestoneName: 'Mid-Planning Installment (40%)',
        amountNaira: '₦15,200,000',
        dueDate: '2026-11-30',
        portalUrl: 'https://aseva.luxury/portal/demo',
      });

      expect(notification.channel).toBe('email');
      expect(notification.subject).toContain('Mid-Planning Installment');
      expect(notification.body).toContain('Chief Alabi');
      expect(notification.body).toContain('₦15,200,000');
      expect(notification.body).toContain('2026-11-30');
    });

    it('generates clean, encoded WhatsApp direct URL', () => {
      const url = notificationService.generateWhatsAppUrl('+234 802 345 6789', 'Hello ASEVA Concierge! I have a question.');
      expect(url).toContain('https://wa.me/2348023456789');
      expect(url).toContain('text=Hello%20ASEVA%20Concierge!%20I%20have%20a%20question.');
    });
  });
});
