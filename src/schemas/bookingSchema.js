import { z } from 'zod';

export const bookingSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(255, 'Full name exceeds maximum length'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid telephone number')
    .max(25, 'Telephone number is too long'),
  eventType: z
    .string()
    .min(1, 'Please select the type of event'),
  preferredDate: z
    .string()
    .min(1, 'Please select your preferred event date')
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected > today;
    }, 'Event date must be in the future'),
  alternateDate: z.string().optional(),
  location: z
    .string()
    .min(2, 'Please indicate the preferred city or region'),
  venueName: z.string().optional(),
  guestCount: z
    .string()
    .min(1, 'Please select an estimated guest count'),
  estimatedBudget: z
    .string()
    .min(1, 'Please select an estimated budget range'),
  serviceId: z.string().optional(),
  visionNotes: z.string().optional(),
  referralSource: z.string().optional(),
  // Honeypot field for bot mitigation
  _hp: z.string().max(0, 'Bot submission rejected').optional(),
});
