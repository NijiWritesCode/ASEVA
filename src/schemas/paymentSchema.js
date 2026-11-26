import { z } from 'zod';

export const paymentSchema = z.object({
  eventId: z.string().uuid('Please select a valid event'),
  scheduleId: z.string().uuid('Invalid schedule').optional().nullable(),
  amountNaira: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive('Payment amount must be greater than zero'),
  paymentMethod: z.enum(['bank_transfer', 'paystack', 'cash', 'pos', 'cheque'], {
    required_error: 'Please select a payment method',
  }),
  transactionReference: z
    .string()
    .min(3, 'Transaction reference must be at least 3 characters'),
  paymentDate: z.string().min(1, 'Please select the payment date'),
  receiptUrl: z.string().url('Invalid receipt URL').optional().nullable(),
  notes: z.string().optional(),
});
