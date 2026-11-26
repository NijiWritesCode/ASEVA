/**
 * Automated Client Notification Engine
 * Handles branded transactional communications (Email and WhatsApp)
 * for inquiries, quotation dispatches, and milestone payment reminders.
 */

export const notificationService = {
  /**
   * Generates initial booking acknowledgement notification
   */
  generateEnquiryAcknowledgement({ clientName, referenceCode, eventType, preferredDate }) {
    const subject = `ASEVA — Booking Enquiry Received [Ref: ${referenceCode}]`;
    const message = `Dear ${clientName},\n\n` +
      `Thank you for reaching out to ASEVA. We have received your consultation enquiry for your upcoming ${eventType.toUpperCase()} targeted for ${preferredDate}.\n\n` +
      `Your official reference code is: ${referenceCode}\n\n` +
      `Our executive planning team will review calendar feasibility and reach out within 24 to 48 hours to schedule your discovery consultation.\n\n` +
      `Warm regards,\n` +
      `The ASEVA Executive Concierge`;

    return {
      channel: 'email',
      subject,
      body: message,
    };
  },

  /**
   * Generates formal quotation ready notification with client portal access link
   */
  generateQuotationNotification({ clientName, eventTitle, agreedFeeNaira, portalUrl }) {
    const subject = `ASEVA — Formal Commission Proposal & Workspace Ready: ${eventTitle}`;
    const message = `Dear ${clientName},\n\n` +
      `We are pleased to present the formal architectural proposal and production roadmap for "${eventTitle}".\n\n` +
      `Total Agreed Contract Value: ${agreedFeeNaira}\n\n` +
      `You may inspect your itemized milestone schedule, view your production timeline, and complete your initial retainer deposit via our secure Patron Portal:\n` +
      `${portalUrl}\n\n` +
      `Warm regards,\n` +
      `Folashade Adeleke\n` +
      `Creative Director, ASEVA`;

    return {
      channel: 'email',
      subject,
      body: message,
    };
  },

  /**
   * Generates milestone payment reminder
   */
  generateMilestoneReminder({ clientName, eventTitle, milestoneName, amountNaira, dueDate, portalUrl }) {
    const subject = `ASEVA Milestone Reminder: ${milestoneName} Due for "${eventTitle}"`;
    const message = `Dear ${clientName},\n\n` +
      `This is a gentle notification that the ${milestoneName} installment (${amountNaira}) for "${eventTitle}" is due on ${dueDate}.\n\n` +
      `To ensure uninterrupted floral procurement and vendor reservations, please complete settlement via our secure Patron Portal:\n` +
      `${portalUrl}\n\n` +
      `Warm regards,\n` +
      `ASEVA Financial Treasury`;

    return {
      channel: 'email',
      subject,
      body: message,
    };
  },

  /**
   * Generates WhatsApp direct share URL for quick concierge communication
   */
  generateWhatsAppUrl(phone, text) {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  },
};
